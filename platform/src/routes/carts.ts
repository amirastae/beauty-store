import { Hono } from 'hono'
import type { AppBindings } from '../env'
import { fail } from '../lib/response'

export const carts = new Hono<AppBindings>()

function randomId(prefix: string) {
  return prefix + '_' + crypto.randomUUID().replaceAll('-', '')
}

carts.post('/', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Cart database is not bound in this environment.', 503)

  const id = randomId('cart')
  const now = new Date().toISOString()

  await db.prepare(
    `INSERT INTO carts (id, currency_code, status, subtotal_minor, discount_minor, shipping_minor, tax_minor, total_minor, created_at, updated_at)
     VALUES (?, 'USD', 'open', 0, 0, 0, 0, 0, ?, ?)`
  ).bind(id, now, now).run()

  return c.json({ ok: true, data: { id, currency_code: 'USD', status: 'open', total_minor: 0 } }, 201)
})

carts.get('/:id', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Cart database is not bound in this environment.', 503)

  const cart = await db.prepare(`SELECT * FROM carts WHERE id = ? LIMIT 1`).bind(c.req.param('id')).first()
  if (!cart) return fail('CART_NOT_FOUND', 'Cart not found.', 404)

  const lines = await db.prepare(
    `SELECT ci.id, ci.variant_id, ci.quantity, ci.unit_price_minor, ci.line_total_minor,
            pv.title AS variant_title, p.title AS product_title, p.thumbnail_url
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

  const cart = await db.prepare(`SELECT id, status FROM carts WHERE id = ? LIMIT 1`).bind(c.req.param('id')).first()
  if (!cart || cart.status !== 'open') return fail('CART_NOT_OPEN', 'Cart is not open.', 409)

  const variant = await db.prepare(
    `SELECT id, price_minor, currency_code FROM product_variants WHERE id = ? AND status = 'active' LIMIT 1`
  ).bind(variantId).first<{ id: string; price_minor: number; currency_code: string }>()

  if (!variant) return fail('VARIANT_NOT_FOUND', 'Variant not found.', 404)

  const lineId = randomId('line')
  const lineTotal = variant.price_minor * quantity
  const now = new Date().toISOString()

  await db.batch([
    db.prepare(
      `INSERT INTO cart_items (id, cart_id, variant_id, quantity, unit_price_minor, line_total_minor, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(lineId, c.req.param('id'), variantId, quantity, variant.price_minor, lineTotal, now, now),
    db.prepare(
      `UPDATE carts SET subtotal_minor = (
         SELECT COALESCE(SUM(line_total_minor), 0) FROM cart_items WHERE cart_id = ?
       ), total_minor = (
         SELECT COALESCE(SUM(line_total_minor), 0) FROM cart_items WHERE cart_id = ?
       ), updated_at = ? WHERE id = ?`
    ).bind(c.req.param('id'), c.req.param('id'), now, c.req.param('id'))
  ])

  return c.json({ ok: true, data: { id: lineId } }, 201)
})
