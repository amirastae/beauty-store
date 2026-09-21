import { Hono } from 'hono'
import type { AppBindings } from '../env'
import { fail } from '../lib/response'

export const search = new Hono<AppBindings>()

search.get('/search', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Search database is not bound.', 503)

  const q = (c.req.query('q') || '').trim()
  if (q.length < 2) return c.json({ ok: true, data: [] })

  const like = '%' + q.replaceAll('%', '\\%').replaceAll('_', '\\_') + '%'
  const result = await db.prepare(
    `SELECT id, slug, title, subtitle, thumbnail_url
     FROM products
     WHERE status = 'active'
       AND (title LIKE ? ESCAPE '\\' OR subtitle LIKE ? ESCAPE '\\' OR description LIKE ? ESCAPE '\\')
     ORDER BY title ASC LIMIT 24`
  ).bind(like, like, like).all()

  return c.json({ ok: true, data: result.results })
})
