import { Hono } from 'hono'
import type { AppBindings } from '../env'
import { fail } from '../lib/response'

export const catalog = new Hono<AppBindings>()

catalog.get('/products', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Catalog database is not bound in this environment.', 503)

  const limitRaw = Number(c.req.query('limit') ?? 24)
  const limit = Math.min(Math.max(Number.isFinite(limitRaw) ? limitRaw : 24, 1), 100)
  const cursor = c.req.query('cursor')

  const sql = cursor
    ? `SELECT id, slug, title, subtitle, status, thumbnail_url, created_at
       FROM products
       WHERE status = 'active' AND id > ?
       ORDER BY id ASC LIMIT ?`
    : `SELECT id, slug, title, subtitle, status, thumbnail_url, created_at
       FROM products
       WHERE status = 'active'
       ORDER BY id ASC LIMIT ?`

  const stmt = cursor ? db.prepare(sql).bind(cursor, limit + 1) : db.prepare(sql).bind(limit + 1)
  const result = await stmt.all()

  const rows = result.results as Array<Record<string, unknown>>
  const hasMore = rows.length > limit
  const items = hasMore ? rows.slice(0, limit) : rows
  const nextCursor = hasMore ? String(items[items.length - 1]?.id ?? '') : null

  return c.json({ ok: true, data: { items, next_cursor: nextCursor } })
})

catalog.get('/products/:slug', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Catalog database is not bound in this environment.', 503)

  const slug = c.req.param('slug')
  const product = await db.prepare(
    `SELECT id, slug, title, subtitle, description, status, thumbnail_url, created_at, updated_at
     FROM products WHERE slug = ? AND status = 'active' LIMIT 1`
  ).bind(slug).first()

  if (!product) return fail('PRODUCT_NOT_FOUND', 'Product not found.', 404)

  const variants = await db.prepare(
    `SELECT id, sku, title, price_minor, currency_code, compare_at_minor, option_json, inventory_policy
     FROM product_variants WHERE product_id = ? AND status = 'active' ORDER BY position ASC`
  ).bind(product.id).all()

  return c.json({ ok: true, data: { ...product, variants: variants.results } })
})
