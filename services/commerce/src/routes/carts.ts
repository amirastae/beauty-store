import { Hono } from 'hono'
import type { AppBindings } from '../env'
import { fail } from '../lib/response'

export const carts = new Hono<AppBindings>()

const allowedCurrencies = new Set(['USD','IRR'])

function randomId(prefix: string) {
  return prefix + '_' + crypto.randomUUID().replaceAll('-', '')
}

async function recalc(db: D1Database, cartId: string) {
  const now = new Date().toISOString()
  await db.prepare(
    `UPDATE carts SET subtotal_minor = (
       SELECT COALESCE(SUM(line_total_minor), 0) FROM cart_items WHERE cart_id = ?
     ), total_minor = (
       SELECT COALESCE(SUM(line_total_minor), 0) FROM cart_items WHERE cart_id = ?
     ), updated_at = ? WHERE id = ?`
  ).bind(cartId, cartId, now, cartId).run()
}

carts.post('/', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Cart database is not bound in this environment.', 503)

  const body = await c.req.json<{ currency_code?: string }>().catch(
    (): { currency_code?: string } => ({})
  )
  const currency = String(body.currency_code || 'USD').toUpperCase()
  if (!allowedCurrencies.has(currency)) return fail('UNSUPPORTED_CURRENCY', 'Unsupported cart currency.', 400)

  const id = randomId('cart')
  const now = new Date().toISOString()

  await db.prepare(
    `INSERT INTO carts (id, currency_code, status, subtotal_minor, discount_minor, shipping_minor, tax_minor, total_minor, created_at, updated_at)
     VALUES (?, ?, 'open', 0, 0, 0, 0, 0, ?, ?)`
  ).bind(id, currency, now, now).run()

  return c.json({ ok: true, data: { id, currency_code: currency, status: 'open', total_minor: 0 } }, 201)
})

carts.get('/:id', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Cart database is not bound in this environment.', 503)

  const cart = await db.prepare(`SELECT * FROM carts WHERE id = ? LIMIT 1`).bind(c.req.param('id')).first()
  if (!cart) return fail('CART_NOT_FOUND', 'Cart not found.', 404)

  const lines = await db.prepare(
    `SELECT ci.id, ci.variant_id, ci.quantity, ci.unit_price_minor, ci.line_total_minor,
            pv.title AS variant_title, pv.currency_code,
            p.title AS product_title, p.thumbnail_url
     FROM cart_items ci
     JOIN product_variants pv ON pv.id = ci.variant_id
     JOIN products p ON p.id = pv.product_id
     WHERE ci.cart_id = ? ORDER BY ci.created_at ASC`
  ).bind(c.req.param('id')).all()

  return c.json({ ok: true, data: { ...cart, items: lines.results } })
})

carts.post('/:id/items', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Cart database is not bound in this environment.', 503)

  const body = await c.req.json<{ variant_id?: string; quantity?: number }>().catch(
    (): { variant_id?: string; quantity?: number } => ({})
  )
  const variantId = body.variant_id
  const quantity = Math.floor(Number(body.quantity ?? 1))

  if (!variantId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    return fail('INVALID_LINE_ITEM', 'variant_id and quantity between 1 and 20 are required.')
  }

  const cartId = c.req.param('id')
  const cart = await db.prepare(`SELECT id, status, currency_code FROM carts WHERE id = ? LIMIT 1`)
    .bind(cartId).first<{ id: string; status: string; currency_code: string }>()
  if (!cart || cart.status !== 'open') return fail('CART_NOT_OPEN', 'Cart is not open.', 409)

  const variant = await db.prepare(
    `SELECT id, price_minor, currency_code FROM product_variants WHERE id = ? AND status = 'active' LIMIT 1`
  ).bind(variantId).first<{ id: string; price_minor: number; currency_code: string }>()

  if (!variant) return fail('VARIANT_NOT_FOUND', 'Variant not found.', 404)
  if (variant.currency_code !== cart.currency_code) {
    return fail('CURRENCY_MISMATCH', 'Variant currency does not match cart currency.', 409)
  }

  const existing = await db.prepare(
    `SELECT id, quantity FROM cart_items WHERE cart_id = ? AND variant_id = ? LIMIT 1`
  ).bind(cartId, variantId).first<{ id: string; quantity: number }>()

  const now = new Date().toISOString()
  if (existing) {
    const nextQty = existing.quantity + quantity
    if (nextQty > 20) return fail('QUANTITY_LIMIT', 'Maximum quantity per variant is 20.', 400)

    await db.prepare(
      `UPDATE cart_items SET quantity = ?, unit_price_minor = ?, line_total_minor = ?, updated_at = ?
       WHERE id = ?`
    ).bind(nextQty, variant.price_minor, nextQty * variant.price_minor, now, existing.id).run()

    await recalc(db, cartId)
    return c.json({ ok: true, data: { id: existing.id, quantity: nextQty } })
  }

  const lineId = randomId('line')
  await db.prepare(
    `INSERT INTO cart_items (id, cart_id, variant_id, quantity, unit_price_minor, line_total_minor, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(lineId, cartId, variantId, quantity, variant.price_minor, variant.price_minor * quantity, now, now).run()

  await recalc(db, cartId)
  return c.json({ ok: true, data: { id: lineId, quantity } }, 201)
})

carts.patch('/:id/items/:itemId', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Cart database is not bound in this environment.', 503)

  const body = await c.req.json<{ quantity?: number }>().catch((): { quantity?: number } => ({}))
  const quantity = Math.floor(Number(body.quantity))
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    return fail('INVALID_QUANTITY', 'quantity must be between 1 and 20.', 400)
  }

  const cartId = c.req.param('id')
  const item = await db.prepare(
    `SELECT ci.id, pv.price_minor
     FROM cart_items ci
     JOIN product_variants pv ON pv.id = ci.variant_id
     JOIN carts c ON c.id = ci.cart_id
     WHERE ci.id = ? AND ci.cart_id = ? AND c.status = 'open' LIMIT 1`
  ).bind(c.req.param('itemId'), cartId).first<{ id: string; price_minor: number }>()

  if (!item) return fail('LINE_ITEM_NOT_FOUND', 'Line item not found in an open cart.', 404)

  await db.prepare(
    `UPDATE cart_items SET quantity = ?, unit_price_minor = ?, line_total_minor = ?, updated_at = ?
     WHERE id = ?`
  ).bind(quantity, item.price_minor, quantity * item.price_minor, new Date().toISOString(), item.id).run()

  await recalc(db, cartId)
  return c.json({ ok: true, data: { id: item.id, quantity } })
})

carts.delete('/:id/items/:itemId', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Cart database is not bound in this environment.', 503)

  const cartId = c.req.param('id')
  const result = await db.prepare(
    `DELETE FROM cart_items
     WHERE id = ? AND cart_id = ?
       AND EXISTS (SELECT 1 FROM carts WHERE id = ? AND status = 'open')`
  ).bind(c.req.param('itemId'), cartId, cartId).run()

  if ((result.meta.changes ?? 0) !== 1) {
    return fail('LINE_ITEM_NOT_FOUND', 'Line item not found in an open cart.', 404)
  }

  await recalc(db, cartId)
  return c.body(null, 204)
})
