import type { MiddlewareHandler } from 'hono'
import type { AppBindings } from '../env'

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export const adminAuth: MiddlewareHandler<AppBindings> = async (c, next) => {
  const expected = c.env.ADMIN_API_KEY
  if (!expected) {
    return c.json({ ok: false, error: { code: 'ADMIN_DISABLED', message: 'Admin API is not configured.' } }, 503)
  }

  const bearer = c.req.header('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const direct = c.req.header('x-admin-key') ?? ''
  const provided = bearer || direct

  if (!provided || !safeEqual(provided, expected)) {
    return c.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Admin authorization failed.' } }, 401)
  }

  await next()
}
