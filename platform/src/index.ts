import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import type { AppBindings } from './env'
import { catalog } from './routes/catalog'
import { carts } from './routes/carts'
import { checkout } from './routes/checkout'
import { inventory } from './routes/inventory'
import { admin } from './routes/admin'
import { media } from './routes/media'
import { search } from './routes/search'
import { ensurePreviewDatabase } from './lib/bootstrap'

const app = new Hono<AppBindings>()

app.use('*', logger())
app.use('/api/*', async (c, next) => {
  await ensurePreviewDatabase(c.env)
  await next()
})
app.use('/api/*', cors({
  origin: (origin) => origin || '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Idempotency-Key', 'Authorization', 'X-Admin-Key'],
  maxAge: 86400
}))

app.get('/api/v1/health', (c) => c.json({
  ok: true,
  data: {
    service: 'veloura-commerce-core',
    env: c.env.APP_ENV,
    database_bound: Boolean(c.env.DB),
    media_bound: Boolean(c.env.MEDIA),
    admin_configured: Boolean(c.env.ADMIN_API_KEY),
    timestamp: new Date().toISOString()
  }
}))

app.route('/api/v1', catalog)
app.route('/api/v1', inventory)
app.route('/api/v1', checkout)
app.route('/api/v1', media)
app.route('/api/v1', search)
app.route('/api/v1/carts', carts)
app.route('/api/v1/admin', admin)

app.notFound((c) => c.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Route not found.' } }, 404))
app.onError((err, c) => {
  console.error(err)
  return c.json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error.' } }, 500)
})

export default app
