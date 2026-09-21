import { Hono } from 'hono'
import type { AppBindings } from '../env'
import { fail } from '../lib/response'

export const orders = new Hono<AppBindings>()

async function sha256Hex(input: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

orders.post('/orders/status', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Order database is not bound in this environment.', 503)

  const body = await c.req.json<{ receipt?: string }>().catch((): { receipt?: string } => ({}))
  const receipt = (body.receipt || '').trim().toLowerCase()

  if (!/^[a-f0-9]{64}$/.test(receipt)) {
    return fail('ORDER_RECEIPT_INVALID', 'Order receipt is invalid.', 400)
  }

  const tokenHash = await sha256Hex(receipt)
  const now = new Date().toISOString()

  const row = await db.prepare(
    `SELECT o.order_number, o.status AS order_status, o.payment_status,
            o.fulfillment_status, o.currency_code, o.total_minor,
            o.payment_expires_at, o.updated_at
     FROM order_receipts r
     JOIN orders o ON o.id = r.order_id
     WHERE r.token_hash = ?
       AND (r.expires_at IS NULL OR r.expires_at > ?)
     LIMIT 1`
  ).bind(tokenHash, now).first<{
    order_number: number
    order_status: string
    payment_status: string
    fulfillment_status: string
    currency_code: string
    total_minor: number
    payment_expires_at: string | null
    updated_at: string
  }>()

  if (!row) return fail('ORDER_RECEIPT_NOT_FOUND', 'Order receipt was not found or has expired.', 404)

  c.header('Cache-Control', 'private, no-store, max-age=0')
  c.header('Pragma', 'no-cache')
  c.header('X-Content-Type-Options', 'nosniff')

  return c.json({ ok: true, data: row })
})
