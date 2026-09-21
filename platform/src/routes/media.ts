import { Hono } from 'hono'
import type { AppBindings } from '../env'
import { fail } from '../lib/response'

export const media = new Hono<AppBindings>()

media.get('/media/:key', async (c) => {
  const bucket = c.env.MEDIA
  if (!bucket) return fail('MEDIA_NOT_BOUND', 'Media bucket is not bound.', 503)

  const object = await bucket.get(c.req.param('key'))
  if (!object) return fail('MEDIA_NOT_FOUND', 'Media object not found.', 404)

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')

  return new Response(object.body, { headers })
})
