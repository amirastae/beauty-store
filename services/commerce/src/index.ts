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
import { compat } from './routes/compat'
import { payments } from './routes/payments'
import { orders } from './routes/orders'
import { ensurePreviewDatabase } from './lib/bootstrap'
import { releaseExpiredOrders } from './lib/order-inventory'

const app = new Hono<AppBindings>()

function allowedOrigin(env: AppBindings['Bindings'], origin: string) {
  if (!origin) return ''
  const configured = (env.ALLOWED_ORIGINS || 'https://beauty-store.nayererohalamini.workers.dev')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (configured.includes(origin)) return origin
  if (env.APP_ENV !== 'production' && /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)) return origin
  return ''
}

app.use('*', logger())
app.use('/api/*', async (c, next) => {
  await ensurePreviewDatabase(c.env)
  await next()
})
app.use('/api/*', cors({
  origin: (origin, c) => allowedOrigin(c.env, origin),
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
    payment_provider_configured: Boolean(c.env.PAYMENT_PROVIDER && c.env.ZARINPAL_MERCHANT_ID && c.env.PAYMENT_CALLBACK_BASE_URL),
    timestamp: new Date().toISOString()
  }
}))

app.route('/api/v1', catalog)
app.route('/api/v1', inventory)
app.route('/api/v1', checkout)
app.route('/api/v1', media)
app.route('/api/v1', search)
app.route('/api/v1', compat)
app.route('/api/v1', payments)
app.route('/api/v1', orders)
app.route('/api/v1/carts', carts)
app.route('/api/v1/admin', admin)

app.notFound((c) => c.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Route not found.' } }, 404))
app.onError((err, c) => {
  console.error(err)
  return c.json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error.' } }, 500)
})

export default {
  fetch: app.fetch,
  scheduled: (_controller: ScheduledController, env: AppBindings['Bindings'], ctx: ExecutionContext) => {
    ctx.waitUntil(releaseExpiredOrders(env).then((result) => {
      console.log('expired order release', result)
    }))
  }
} satisfies ExportedHandler<AppBindings['Bindings']>
