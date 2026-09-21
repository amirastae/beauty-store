import { Hono } from 'hono'
import type { AppBindings } from '../env'
import { fail } from '../lib/response'

export const checkout = new Hono<AppBindings>()

type CartLine = {
  id: string
  variant_id: string
  quantity: number
  unit_price_minor: number
  line_total_minor: number
  sku: string
  variant_title: string
  product_id: string
  product_title: string
}

type IdemRow = {
  request_hash: string
  response_status: number | null
  response_body: string | null
  locked_until: string | null
}

function id(prefix: string) {
  return prefix + '_' + crypto.randomUUID().replaceAll('-', '')
}

async function nextOrderNumber(db: D1Database) {
  const row = await db.prepare(
    `INSERT INTO order_sequences (name, next_value)
     VALUES ('order', 100000000)
     ON CONFLICT(name) DO UPDATE SET next_value = next_value + 1
     RETURNING next_value`
  ).first<{ next_value: number }>()

  if (!row) throw new Error('ORDER_SEQUENCE_UNAVAILABLE')
  return row.next_value
}

function receiptToken() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function normalizePhone(input: unknown) {
  const fa = '۰۱۲۳۴۵۶۷۸۹'
  const ar = '٠١٢٣٤٥٦٧٨٩'
  return String(input ?? '')
    .replace(/[۰-۹]/g, (d) => String(fa.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ar.indexOf(d)))
    .replace(/[^0-9+]/g, '')
}

function shippingPolicy(env: AppBindings['Bindings'], currency: string, subtotal: number) {
  const flatRaw = currency === 'IRR'
    ? env.SHIPPING_FLAT_MINOR_IRR
    : currency === 'USD'
      ? env.SHIPPING_FLAT_MINOR_USD
      : undefined
  const thresholdRaw = currency === 'IRR'
    ? env.SHIPPING_FREE_THRESHOLD_MINOR_IRR
    : currency === 'USD'
      ? env.SHIPPING_FREE_THRESHOLD_MINOR_USD
      : undefined

  const flat = Number(flatRaw)
  const threshold = Number(thresholdRaw)
  if (!Number.isFinite(flat) || flat < 0 || !Number.isFinite(threshold) || threshold < 0) return null

  return { flat, threshold, amount: subtotal >= threshold ? 0 : flat }
}

async function sha256Hex(input: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function releaseReservations(db: D1Database, lines: CartLine[]) {
  const now = new Date().toISOString()
  for (const line of lines) {
    await db.prepare(
      `UPDATE inventory_items
       SET reserved = MAX(reserved - ?, 0), updated_at = ?
       WHERE variant_id = ?`
    ).bind(line.quantity, now, line.variant_id).run()
  }
}

async function releaseIdempotencyLock(db: D1Database, key: string) {
  await db.prepare(
    `UPDATE idempotency_keys
     SET locked_until = NULL, updated_at = ?
     WHERE key = ? AND scope = 'checkout' AND response_status IS NULL`
  ).bind(new Date().toISOString(), key).run()
}

async function releaseCheckoutClaim(db: D1Database, cartId: string, idem: string) {
  await db.prepare(
    `DELETE FROM checkout_claims WHERE cart_id = ? AND idempotency_key = ?`
  ).bind(cartId, idem).run()
}

checkout.post('/checkout/:cartId', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Checkout database is not bound in this environment.', 503)

  const idem = c.req.header('Idempotency-Key')?.trim()
  if (!idem || idem.length < 8 || idem.length > 120) {
    return fail('IDEMPOTENCY_KEY_REQUIRED', 'A valid Idempotency-Key header is required.', 400)
  }

  const cartId = c.req.param('cartId')
  const cart = await db.prepare(
    `SELECT id, customer_id, email, currency_code, status
     FROM carts WHERE id = ? LIMIT 1`
  ).bind(cartId).first<{
    id: string
    customer_id: string | null
    email: string | null
    currency_code: string
    status: string
  }>()

  if (!cart) return fail('CART_NOT_FOUND', 'Cart not found.', 404)

  const body = await c.req.json<{
    email?: string
    phone?: string
    shipping_address?: Record<string, unknown>
    billing_address?: Record<string, unknown>
  }>().catch(() => ({} as {
    email?: string
    phone?: string
    shipping_address?: Record<string, unknown>
    billing_address?: Record<string, unknown>
  }))

  const email = String(body.email ?? cart.email ?? '').trim().toLowerCase()
  const phone = normalizePhone(body.phone)
  if (email && !email.includes('@')) return fail('EMAIL_INVALID', 'Email is invalid.', 400)
  if (phone && phone.replace(/\D/g, '').length < 7) return fail('PHONE_INVALID', 'Phone number is invalid.', 400)
  if (!email && !phone) return fail('CONTACT_REQUIRED', 'Email or phone is required.', 400)
  if (!body.shipping_address || typeof body.shipping_address !== 'object') {
    return fail('SHIPPING_ADDRESS_REQUIRED', 'Shipping address is required.', 400)
  }

  const requestHash = await sha256Hex(JSON.stringify({
    cart_id: cartId,
    email,
    phone,
    shipping_address: body.shipping_address,
    billing_address: body.billing_address ?? null
  }))

  const existing = await db.prepare(
    `SELECT request_hash, response_status, response_body, locked_until
     FROM idempotency_keys WHERE key = ? AND scope = 'checkout' LIMIT 1`
  ).bind(idem).first<IdemRow>()

  if (existing) {
    if (existing.request_hash !== requestHash) {
      return fail('IDEMPOTENCY_KEY_REUSED', 'This idempotency key was already used for a different request.', 409)
    }

    if (existing.response_status && existing.response_body) {
      return new Response(existing.response_body, {
        status: existing.response_status,
        headers: { 'content-type': 'application/json; charset=utf-8' }
      })
    }

    if (existing.locked_until && Date.parse(existing.locked_until) > Date.now()) {
      return fail('IDEMPOTENCY_IN_PROGRESS', 'An identical checkout request is already in progress.', 409)
    }

    const lockUntil = new Date(Date.now() + 30_000).toISOString()
    const lock = await db.prepare(
      `UPDATE idempotency_keys SET locked_until = ?, updated_at = ?
       WHERE key = ? AND scope = 'checkout'
         AND response_status IS NULL
         AND (locked_until IS NULL OR locked_until <= ?)`
    ).bind(lockUntil, new Date().toISOString(), idem, new Date().toISOString()).run()

    if ((lock.meta.changes ?? 0) !== 1) {
      return fail('IDEMPOTENCY_IN_PROGRESS', 'An identical checkout request is already in progress.', 409)
    }
  } else {
    try {
      const now = new Date().toISOString()
      await db.prepare(
        `INSERT INTO idempotency_keys
         (key, scope, request_hash, locked_until, created_at, updated_at)
         VALUES (?, 'checkout', ?, ?, ?, ?)`
      ).bind(idem, requestHash, new Date(Date.now() + 30_000).toISOString(), now, now).run()
    } catch {
      return fail('IDEMPOTENCY_IN_PROGRESS', 'An identical checkout request is already in progress.', 409)
    }
  }

  if (cart.status !== 'open') {
    await releaseIdempotencyLock(db, idem)
    return fail('CART_NOT_OPEN', 'Cart is not open.', 409)
  }

  const linesResult = await db.prepare(
    `SELECT ci.id, ci.variant_id, ci.quantity, ci.unit_price_minor, ci.line_total_minor,
            pv.sku, pv.title AS variant_title, p.id AS product_id, p.title AS product_title
     FROM cart_items ci
     JOIN product_variants pv ON pv.id = ci.variant_id
     JOIN products p ON p.id = pv.product_id
     WHERE ci.cart_id = ? ORDER BY ci.created_at ASC`
  ).bind(cartId).all<CartLine>()

  const lines = linesResult.results
  if (!lines.length) {
    await releaseIdempotencyLock(db, idem)
    return fail('CART_EMPTY', 'Cart is empty.', 409)
  }

  const claimNow = new Date().toISOString()
  await db.prepare(
    `DELETE FROM checkout_claims WHERE cart_id = ? AND expires_at <= ?`
  ).bind(cartId, claimNow).run()

  try {
    await db.prepare(
      `INSERT INTO checkout_claims (cart_id, idempotency_key, expires_at, created_at)
       VALUES (?, ?, ?, ?)`
    ).bind(cartId, idem, new Date(Date.now() + 300_000).toISOString(), claimNow).run()
  } catch {
    await releaseIdempotencyLock(db, idem)
    return fail('CART_CHECKOUT_IN_PROGRESS', 'This cart already has a checkout in progress or completed.', 409)
  }

  const reserved: CartLine[] = []
  for (const line of lines) {
    const result = await db.prepare(
      `UPDATE inventory_items
       SET reserved = reserved + ?, updated_at = ?
       WHERE variant_id = ? AND (stock_on_hand - reserved) >= ?`
    ).bind(line.quantity, new Date().toISOString(), line.variant_id, line.quantity).run()

    if ((result.meta.changes ?? 0) !== 1) {
      await releaseReservations(db, reserved)
      await releaseCheckoutClaim(db, cartId, idem)
      await releaseIdempotencyLock(db, idem)
      return fail('INSUFFICIENT_STOCK', `Insufficient stock for variant ${line.variant_id}.`, 409)
    }
    reserved.push(line)
  }

  try {
    const subtotal = lines.reduce((sum, line) => sum + line.line_total_minor, 0)
    const shippingRule = shippingPolicy(c.env, cart.currency_code, subtotal)
    if (!shippingRule) {
      await releaseReservations(db, reserved)
      await releaseCheckoutClaim(db, cartId, idem)
      await releaseIdempotencyLock(db, idem)
      return fail('SHIPPING_POLICY_NOT_CONFIGURED', 'Shipping policy is not configured for this currency.', 503)
    }

    const shipping = shippingRule.amount
    const discount = 0
    const tax = 0
    const total = subtotal - discount + shipping + tax
    const now = new Date().toISOString()
    const paymentExpiresAt = new Date(Date.now() + 30 * 60_000).toISOString()
    const orderId = id('ord')
    const paymentId = id('pay')
    const orderNo = await nextOrderNumber(db)
    const receipt = receiptToken()
    const receiptHash = await sha256Hex(receipt)

    const payload = JSON.stringify({
      ok: true,
      data: {
        order_id: orderId,
        order_number: orderNo,
        payment_id: paymentId,
        payment_status: 'requires_provider',
        currency_code: cart.currency_code,
        subtotal_minor: subtotal,
        shipping_minor: shipping,
        total_minor: total,
        payment_expires_at: paymentExpiresAt,
        receipt_token: receipt
      }
    })

    const statements: D1PreparedStatement[] = [
      db.prepare(
        `INSERT INTO orders
         (id, order_number, customer_id, email, phone, currency_code, status, payment_status,
          fulfillment_status, subtotal_minor, discount_minor, shipping_minor, tax_minor,
          total_minor, shipping_address_json, billing_address_json, payment_expires_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'pending', 'unpaid', 'unfulfilled', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        orderId, orderNo, cart.customer_id, email, phone || null, cart.currency_code,
        subtotal, discount, shipping, tax, total,
        JSON.stringify(body.shipping_address),
        body.billing_address ? JSON.stringify(body.billing_address) : null,
        paymentExpiresAt,
        now, now
      )
    ]

    for (const line of lines) {
      statements.push(
        db.prepare(
          `INSERT INTO order_items
           (id, order_id, product_id, variant_id, product_title, variant_title, sku,
            quantity, unit_price_minor, line_total_minor, snapshot_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          id('oi'), orderId, line.product_id, line.variant_id, line.product_title,
          line.variant_title, line.sku, line.quantity, line.unit_price_minor,
          line.line_total_minor, JSON.stringify(line)
        )
      )
      statements.push(
        db.prepare(
          `INSERT INTO inventory_events
           (id, variant_id, event_type, quantity, reference_type, reference_id, metadata_json, created_at)
           VALUES (?, ?, 'reserve', ?, 'order', ?, '{}', ?)`
        ).bind(id('inv'), line.variant_id, line.quantity, orderId, now)
      )
    }

    statements.push(
      db.prepare(
        `INSERT INTO order_receipts
         (token_hash, order_id, created_at, expires_at)
         VALUES (?, ?, ?, ?)`
      ).bind(receiptHash, orderId, now, new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString())
    )

    statements.push(
      db.prepare(
        `INSERT INTO payments
         (id, order_id, cart_id, provider, status, amount_minor, currency_code,
          idempotency_key, metadata_json, created_at, updated_at)
         VALUES (?, ?, ?, 'unconfigured', 'requires_provider', ?, ?, ?, '{}', ?, ?)`
      ).bind(paymentId, orderId, cartId, total, cart.currency_code, idem, now, now)
    )

    statements.push(
      db.prepare(`UPDATE carts SET status = 'completed', email = ?, phone = ?, updated_at = ? WHERE id = ?`)
        .bind(email || null, phone || null, now, cartId)
    )

    statements.push(
      db.prepare(`DELETE FROM checkout_claims WHERE cart_id = ? AND idempotency_key = ?`)
        .bind(cartId, idem)
    )

    statements.push(
      db.prepare(
        `INSERT INTO outbox_events
         (id, event_type, aggregate_type, aggregate_id, payload_json, status, attempts, available_at, created_at)
         VALUES (?, 'order.created', 'order', ?, ?, 'pending', 0, ?, ?)`
      ).bind(id('evt'), orderId, payload, now, now)
    )

    statements.push(
      db.prepare(
        `UPDATE idempotency_keys
         SET response_status = 201, response_body = ?, locked_until = NULL, updated_at = ?
         WHERE key = ? AND scope = 'checkout' AND request_hash = ?`
      ).bind(payload, now, idem, requestHash)
    )

    await db.batch(statements)

    return new Response(payload, {
      status: 201,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    })
  } catch (error) {
    await releaseReservations(db, reserved)
    await releaseCheckoutClaim(db, cartId, idem)
    await releaseIdempotencyLock(db, idem)
    console.error('checkout failed', error)
    return fail('CHECKOUT_FAILED', 'Checkout could not be completed.', 500)
  }
})
