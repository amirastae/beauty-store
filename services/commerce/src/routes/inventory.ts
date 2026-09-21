import { Hono } from 'hono'
import type { AppBindings } from '../env'
import { fail } from '../lib/response'

export const inventory = new Hono<AppBindings>()

inventory.get('/inventory/:variantId', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Inventory database is not bound in this environment.', 503)

  const row = await db.prepare(
    `SELECT variant_id, stock_on_hand, reserved,
            MAX(stock_on_hand - reserved, 0) AS available
     FROM inventory_items WHERE variant_id = ? LIMIT 1`
  ).bind(c.req.param('variantId')).first()

  if (!row) return fail('INVENTORY_NOT_FOUND', 'Inventory record not found.', 404)
  return c.json({ ok: true, data: row })
})
