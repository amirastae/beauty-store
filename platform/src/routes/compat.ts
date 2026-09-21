import { Hono } from 'hono'
import type { AppBindings } from '../env'
import { fail } from '../lib/response'

export const compat = new Hono<AppBindings>()

compat.post('/compat/veloura-v2/resolve', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Database is not bound.', 503)

  const body = await c.req.json<{ product_id?: string; shade_id?: string }>()
    .catch((): { product_id?: string; shade_id?: string } => ({}))

  const productId = body.product_id?.trim()
  if (!productId) return fail('PRODUCT_ID_REQUIRED', 'product_id is required.')

  const shade = body.shade_id?.trim() || 'default'
  const externalId = productId + ':' + shade

  const ref = await db.prepare(
    `SELECT er.resource_id AS variant_id, pv.product_id, pv.sku, pv.title,
            pv.price_minor, pv.compare_at_minor, pv.currency_code, pv.option_json,
            p.slug, p.title AS product_title, p.thumbnail_url
     FROM external_refs er
     JOIN product_variants pv ON pv.id = er.resource_id
     JOIN products p ON p.id = pv.product_id
     WHERE er.namespace = 'veloura-v2.1'
       AND er.external_id = ?
       AND er.resource_type = 'variant'
     LIMIT 1`
  ).bind(externalId).first()

  if (!ref) return fail('FRONTEND_VARIANT_NOT_FOUND', 'No backend variant mapping exists for this product/shade.', 404)

  return c.json({ ok: true, data: ref })
})
