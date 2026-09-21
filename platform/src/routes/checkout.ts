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

function id(prefix: string) {
  return prefix + '_' + crypto.randomUUID().replaceAll('-', '')
}

function orderNumber() {
  const bytes = new Uint32Array(1)
  crypto.getRandomValues(bytes)
  return 100000000 + (bytes[0] % 900000000)
}

async function releaseReservations(db: D1Database, lines: CartLine[]) {
  for (const line of lines) {
    await db.prepare(
      `UPDATE inventory_items
       SET reserved = MAX(reserved - ?, 0), updated_at = ?
       WHERE variant_id = ?`
    ).bind(line.quantity, new Date().toISOString(), line.variant_id).run()
  }
}

checkout.post('/checkout/:cartId', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Checkout database is not bound in this environment.', 503)

  const idem = c.req.header('Idempotency-Key')?.trim()
  if (!idem || idem.length < 8 || idem.length > 120) {
    return fail('IDEMPOTENCY_KEY_REQUIRED', 'A valid Idempotency-Key header is required.', 400)
  }

  const existing = await db.prepare(
    `SELECT response_status, response_body FROM idempotency_keys
     WHERE key = ? AND scope = 'checkout' LIMIT 1`
  ).bind(idem).first<{ response_status: number | null; response_body: string | null }>()

  if (existing?.response_status && existing.response_body) {
    return new Response(existing.response_body, {
      status: existing.response_status,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    })
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
  if (cart.status !== 'open') return fail('CART_NOT_OPEN', 'Cart is not open.', 409)

  const body = await c.req.json<{
    email?: string
    shipping_address?: Record<string, unknown>
    billing_address?: Record<string, unknown>
  }>().catch(() => ({} as {
    email?: string
    shipping_address?: Record<string, unknown>
    billing_address?: Record<string, unknown>
  }))

  const email = String(body.email ?? cart.email ?? '').trim().toLowerCase()
  if (!email || !email.includes('@')) return fail('EMAIL_REQUIRED', 'A valid email is required.', 400)
  if (!body.shipping_address || typeof body.shipping_address !== 'object') {
    return fail('SHIPPING_ADDRESS_REQUIRED', 'Shipping address is required.', 400)
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
  if (!lines.length) return fail('CART_EMPTY', 'Cart is empty.', 409)

  await db.prepare(
    `INSERT OR IGNORE INTO idempotency_keys
     (key, scope, request_hash, created_at, updated_at)
     VALUES (?, 'checkout', ?, ?, ?)`
  ).bind(idem, cartId, new Date().toISOString(), new Date().toISOString()).run()

  const reserved: CartLine[] = []
  for (const line of lines) {
    const result = await db.prepare(
      `UPDATE inventory_items
       SET reserved = reserved + ?, updated_at = ?
       WHERE variant_id = ? AND (stock_on_hand - reserved) >= ?`
    ).bind(line.quantity, new Date().toISOString(), line.variant_id, line.quantity).run()

    if ((result.meta.changes ?? 0) !== 1) {
      await releaseReservations(db, reserved)
      return fail('INSUFFICIENT_STOCK', `Insufficient stock for variant ${line.variant_id}.`, 409)
    }
    reserved.push(line)
  }

  try {
    const subtotal = lines.reduce((sum, line) => sum + line.line_total_minor, 0)
    const shipping = subtotal >= 7500 ? 0 : 800
    const discount = 0
    const tax = 0
    const total = subtotal - discount + shipping + tax
    const now = new Date().toISOString()
    const orderId = id('ord')
    const paymentId = id('pay')
    const orderNo = orderNumber()

    const statements: D1PreparedStatement[] = [
      db.prepare(
        `INSERT INTO orders
         (id, order_number, customer_id, email, currency_code, status, payment_status,
          fulfillment_status, subtotal_minor, discount_minor, shipping_minor, tax_minor,
          total_minor, shipping_address_json, billing_address_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'pending', 'unpaid', 'unfulfilled', ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        orderId, orderNo, cart.customer_id, email, cart.currency_code,
        subtotal, discount, shipping, tax, total,
        JSON.stringify(body.shipping_address),
        body.billing_address ? JSON.stringify(body.billing_address) : null,
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
    }

    statements.push(
      db.prepare(
        `INSERT INTO payments
         (id, order_id, cart_id, provider, status, amount_minor, currency_code,
          idempotency_key, metadata_json, created_at, updated_at)
         VALUES (?, ?, ?, 'unconfigured', 'requires_provider', ?, ?, ?, '{}', ?, ?)`
      ).bind(paymentId, orderId, cartId, total, cart.currency_code, idem, now, now)
    )

    statements.push(
      db.prepare(
        `UPDATE inventory_items
         SET stock_on_hand = stock_on_hand - ?, reserved = MAX(reserved - ?, 0), updated_at = ?
         WHERE variant_id = ?`
      ).bind(lines[0].quantity, lines[0].quantity, now, lines[0].variant_id)
    )

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      statements.push(
        db.prepare(
          `UPDATE inventory_items
           SET stock_on_hand = stock_on_hand - ?, reserved = MAX(reserved - ?, 0), updated_at = ?
           WHERE variant_id = ?`
        ).bind(line.quantity, line.quantity, now, line.variant_id)
      )
    }

    statements.push(
      db.prepare(`UPDATE carts SET status = 'completed', email = ?, updated_at = ? WHERE id = ?`)
        .bind(email, now, cartId)
    )

    await db.batch(statements)

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
        total_minor: total
      }
    })

    await db.prepare(
      `UPDATE idempotency_keys
       SET response_status = 201, response_body = ?, updated_at = ?
       WHERE key = ? AND scope = 'checkout'`
    ).bind(payload, now, idem).run()

    return new Response(payload, {
      status: 201,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    })
  } catch (error) {
    await releaseReservations(db, reserved)
    console.error('checkout failed', error)
    return fail('CHECKOUT_FAILED', 'Checkout could not be completed.', 500)
  }
})
