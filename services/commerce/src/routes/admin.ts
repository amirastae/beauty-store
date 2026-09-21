import { Hono } from 'hono'
import type { AppBindings } from '../env'
import { adminAuth } from '../middleware/admin'
import { fail } from '../lib/response'

export const admin = new Hono<AppBindings>()
admin.use('*', adminAuth)

admin.get('/stats', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Database is not bound.', 503)

  const [products, orders, carts, revenue, outbox] = await db.batch([
    db.prepare(`SELECT COUNT(*) AS count FROM products WHERE status = 'active'`),
    db.prepare(`SELECT COUNT(*) AS count FROM orders`),
    db.prepare(`SELECT COUNT(*) AS count FROM carts WHERE status = 'open'`),
    db.prepare(`SELECT COALESCE(SUM(total_minor),0) AS total FROM orders WHERE payment_status = 'paid'`),
    db.prepare(`SELECT COUNT(*) AS count FROM outbox_events WHERE status = 'pending'`)
  ])

  return c.json({
    ok: true,
    data: {
      products: products.results[0],
      orders: orders.results[0],
      open_carts: carts.results[0],
      paid_revenue: revenue.results[0],
      pending_outbox: outbox.results[0]
    }
  })
})

admin.get('/orders', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Database is not bound.', 503)

  const limit = Math.min(Math.max(Number(c.req.query('limit') || 50), 1), 100)
  const result = await db.prepare(
    `SELECT id, order_number, email, currency_code, status, payment_status,
            fulfillment_status, total_minor, created_at, updated_at
     FROM orders ORDER BY created_at DESC LIMIT ?`
  ).bind(limit).all()

  return c.json({ ok: true, data: result.results })
})

admin.patch('/orders/:id/status', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Database is not bound.', 503)

  const body = await c.req.json<{ status?: string; fulfillment_status?: string }>()
    .catch((): { status?: string; fulfillment_status?: string } => ({}))

  const allowedOrder = new Set(['pending','confirmed','cancelled','completed'])
  const allowedFulfillment = new Set(['unfulfilled','processing','fulfilled','returned'])

  if (body.status && !allowedOrder.has(body.status)) return fail('INVALID_ORDER_STATUS', 'Invalid order status.')
  if (body.fulfillment_status && !allowedFulfillment.has(body.fulfillment_status)) {
    return fail('INVALID_FULFILLMENT_STATUS', 'Invalid fulfillment status.')
  }

  const order = await db.prepare(`SELECT id, status, fulfillment_status FROM orders WHERE id = ? LIMIT 1`)
    .bind(c.req.param('id')).first<{ id: string; status: string; fulfillment_status: string }>()

  if (!order) return fail('ORDER_NOT_FOUND', 'Order not found.', 404)

  const nextStatus = body.status ?? order.status
  const nextFulfillment = body.fulfillment_status ?? order.fulfillment_status

  await db.prepare(
    `UPDATE orders SET status = ?, fulfillment_status = ?, updated_at = ? WHERE id = ?`
  ).bind(nextStatus, nextFulfillment, new Date().toISOString(), order.id).run()

  return c.json({ ok: true, data: { id: order.id, status: nextStatus, fulfillment_status: nextFulfillment } })
})

admin.get('/outbox', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Database is not bound.', 503)

  const result = await db.prepare(
    `SELECT id, event_type, aggregate_type, aggregate_id, status, attempts, available_at, created_at
     FROM outbox_events ORDER BY created_at DESC LIMIT 100`
  ).all()

  return c.json({ ok: true, data: result.results })
})

admin.put('/media', async (c) => {
  const bucket = c.env.MEDIA
  if (!bucket) return fail('MEDIA_NOT_BOUND', 'Media bucket is not bound.', 503)

  const key = c.req.query('key')?.trim()
  if (!key || key.length > 180 || key.includes('..')) return fail('INVALID_MEDIA_KEY', 'A safe media key is required.')

  const length = Number(c.req.header('content-length') || 0)
  if (length > 8 * 1024 * 1024) return fail('MEDIA_TOO_LARGE', 'Media upload exceeds 8 MB.', 413)

  const body = await c.req.arrayBuffer()
  if (body.byteLength > 8 * 1024 * 1024) return fail('MEDIA_TOO_LARGE', 'Media upload exceeds 8 MB.', 413)

  const contentType = c.req.header('content-type') || 'application/octet-stream'
  await bucket.put(key, body, { httpMetadata: { contentType } })

  return c.json({ ok: true, data: { key, size: body.byteLength, content_type: contentType } }, 201)
})
