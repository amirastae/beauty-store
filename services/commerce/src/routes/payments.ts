import { Hono } from 'hono'
import type { AppBindings } from '../env'
import { fail } from '../lib/response'

export const payments = new Hono<AppBindings>()

type PaymentRow = {
  payment_id: string
  order_id: string
  order_number: number
  amount_minor: number
  currency_code: string
  payment_status: string
  provider: string
  provider_reference: string | null
  email: string
  phone: string | null
}

type ZarinpalResponse = {
  data?: {
    code?: number
    authority?: string
    ref_id?: number
    message?: string
    card_hash?: string
    card_pan?: string
  }
  errors?: unknown
}

function config(env: AppBindings['Bindings']) {
  if ((env.PAYMENT_PROVIDER || '').toLowerCase() !== 'zarinpal') return null
  const merchantId = env.ZARINPAL_MERCHANT_ID?.trim()
  const callbackBase = env.PAYMENT_CALLBACK_BASE_URL?.trim().replace(/\/$/, '')
  if (!merchantId || !callbackBase) return null
  return {
    merchantId,
    callbackBase,
    apiBase: (env.ZARINPAL_API_BASE || 'https://api.zarinpal.com/pg/v4/payment').replace(/\/$/, ''),
    startBase: (env.ZARINPAL_STARTPAY_BASE || 'https://www.zarinpal.com/pg/StartPay').replace(/\/$/, ''),
    storefrontBase: env.STOREFRONT_BASE_URL?.trim().replace(/\/$/, '') || ''
  }
}

function resultResponse(env: AppBindings['Bindings'], status: 'success' | 'failed' | 'cancelled', orderNumber?: number) {
  const base = env.STOREFRONT_BASE_URL?.trim().replace(/\/$/, '')
  if (base) {
    const params = new URLSearchParams({ payment: status })
    if (orderNumber) params.set('order', String(orderNumber))
    return Response.redirect(base + '/checkout/?' + params.toString(), 302)
  }
  return Response.json({ ok: status === 'success', data: { payment: status, order_number: orderNumber ?? null } })
}

async function postZarinpal(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'VELOURA Commerce/1.0' },
    body: JSON.stringify(body)
  })
  const payload = await response.json() as ZarinpalResponse
  if (!response.ok) throw Object.assign(new Error('Payment provider request failed.'), { payload })
  return payload
}

payments.post('/payments/:orderId/start', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Payment database is not bound.', 503)

  const cfg = config(c.env)
  if (!cfg) return fail('PAYMENT_PROVIDER_NOT_CONFIGURED', 'Payment provider is not configured.', 503)

  const row = await db.prepare(
    `SELECT p.id AS payment_id, p.order_id, o.order_number, p.amount_minor, p.currency_code,
            p.status AS payment_status, p.provider, p.provider_reference, o.email, o.phone
     FROM payments p
     JOIN orders o ON o.id = p.order_id
     WHERE p.order_id = ? LIMIT 1`
  ).bind(c.req.param('orderId')).first<PaymentRow>()

  if (!row) return fail('PAYMENT_NOT_FOUND', 'Payment record not found.', 404)
  if (row.currency_code !== 'IRR') return fail('PAYMENT_CURRENCY_UNSUPPORTED', 'Configured provider only supports IRR orders.', 409)
  if (row.payment_status === 'paid') return fail('PAYMENT_ALREADY_PAID', 'Order is already paid.', 409)

  if (row.provider === 'zarinpal' && row.provider_reference && row.payment_status === 'pending_redirect') {
    return c.json({ ok: true, data: { redirect_url: cfg.startBase + '/' + row.provider_reference, authority: row.provider_reference } })
  }

  const callbackUrl = cfg.callbackBase + '/api/v1/payments/zarinpal/callback?order_id=' + encodeURIComponent(row.order_id)
  const metadata: Record<string, string> = { order_id: String(row.order_number) }
  if (row.phone) metadata.mobile = row.phone
  if (row.email) metadata.email = row.email

  let providerResult: ZarinpalResponse
  try {
    providerResult = await postZarinpal(cfg.apiBase + '/request.json', {
      merchant_id: cfg.merchantId,
      amount: row.amount_minor,
      currency: 'IRR',
      callback_url: callbackUrl,
      description: 'VELOURA order ' + row.order_number,
      metadata
    })
  } catch (error) {
    console.error('zarinpal request failed', error)
    return fail('PAYMENT_PROVIDER_UNAVAILABLE', 'Payment provider request failed.', 502)
  }

  const authority = providerResult.data?.authority
  if (providerResult.data?.code !== 100 || !authority) {
    console.error('zarinpal request rejected', providerResult.errors || providerResult.data)
    return fail('PAYMENT_PROVIDER_REJECTED', 'Payment provider rejected the request.', 502)
  }

  await db.prepare(
    `UPDATE payments
     SET provider = 'zarinpal', provider_reference = ?, status = 'pending_redirect',
         metadata_json = ?, updated_at = ?
     WHERE id = ?`
  ).bind(authority, JSON.stringify(providerResult.data), new Date().toISOString(), row.payment_id).run()

  return c.json({
    ok: true,
    data: {
      redirect_url: cfg.startBase + '/' + authority,
      authority
    }
  })
})

payments.get('/payments/zarinpal/callback', async (c) => {
  const db = c.env.DB
  if (!db) return fail('DB_NOT_BOUND', 'Payment database is not bound.', 503)

  const cfg = config(c.env)
  if (!cfg) return fail('PAYMENT_PROVIDER_NOT_CONFIGURED', 'Payment provider is not configured.', 503)

  const authority = (c.req.query('Authority') || '').trim()
  const callbackStatus = (c.req.query('Status') || '').trim().toUpperCase()
  const orderId = (c.req.query('order_id') || '').trim()
  if (!authority || !orderId) return fail('PAYMENT_CALLBACK_INVALID', 'Payment callback is invalid.', 400)

  const row = await db.prepare(
    `SELECT p.id AS payment_id, p.order_id, o.order_number, p.amount_minor, p.currency_code,
            p.status AS payment_status, p.provider, p.provider_reference, o.email, o.phone
     FROM payments p
     JOIN orders o ON o.id = p.order_id
     WHERE p.order_id = ? AND p.provider = 'zarinpal' AND p.provider_reference = ?
     LIMIT 1`
  ).bind(orderId, authority).first<PaymentRow>()

  if (!row) return fail('PAYMENT_CALLBACK_UNKNOWN', 'Payment callback does not match an order.', 404)
  if (row.payment_status === 'paid') return resultResponse(c.env, 'success', row.order_number)

  if (callbackStatus !== 'OK') {
    const now = new Date().toISOString()
    await db.batch([
      db.prepare(`UPDATE payments SET status = 'cancelled', updated_at = ? WHERE id = ? AND status <> 'paid'`).bind(now, row.payment_id),
      db.prepare(`UPDATE orders SET payment_status = 'cancelled', updated_at = ? WHERE id = ? AND payment_status <> 'paid'`).bind(now, row.order_id)
    ])
    return resultResponse(c.env, 'cancelled', row.order_number)
  }

  let providerResult: ZarinpalResponse
  try {
    providerResult = await postZarinpal(cfg.apiBase + '/verify.json', {
      merchant_id: cfg.merchantId,
      amount: row.amount_minor,
      authority
    })
  } catch (error) {
    console.error('zarinpal verify failed', error)
    return fail('PAYMENT_VERIFY_UNAVAILABLE', 'Payment verification is temporarily unavailable.', 502)
  }

  const code = providerResult.data?.code
  if (code !== 100 && code !== 101) {
    const now = new Date().toISOString()
    await db.batch([
      db.prepare(`UPDATE payments SET status = 'failed', metadata_json = ?, updated_at = ? WHERE id = ? AND status <> 'paid'`)
        .bind(JSON.stringify(providerResult), now, row.payment_id),
      db.prepare(`UPDATE orders SET payment_status = 'failed', updated_at = ? WHERE id = ? AND payment_status <> 'paid'`)
        .bind(now, row.order_id)
    ])
    return resultResponse(c.env, 'failed', row.order_number)
  }

  const now = new Date().toISOString()
  const eventId = 'wh_' + crypto.randomUUID().replaceAll('-', '')
  const outboxId = 'evt_' + crypto.randomUUID().replaceAll('-', '')
  const payload = JSON.stringify({
    order_id: row.order_id,
    order_number: row.order_number,
    authority,
    ref_id: providerResult.data?.ref_id ?? null
  })

  await db.batch([
    db.prepare(
      `INSERT OR IGNORE INTO webhook_events
       (id, provider, external_id, event_type, payload_json, status, created_at, processed_at)
       VALUES (?, 'zarinpal', ?, 'payment.verify', ?, 'processed', ?, ?)`
    ).bind(eventId, authority, JSON.stringify(providerResult), now, now),
    db.prepare(
      `UPDATE payments
       SET status = 'paid', metadata_json = ?, updated_at = ?
       WHERE id = ?`
    ).bind(JSON.stringify(providerResult.data), now, row.payment_id),
    db.prepare(
      `UPDATE orders
       SET payment_status = 'paid', status = 'confirmed', updated_at = ?
       WHERE id = ?`
    ).bind(now, row.order_id),
    db.prepare(
      `INSERT INTO outbox_events
       (id, event_type, aggregate_type, aggregate_id, payload_json, status, attempts, available_at, created_at)
       VALUES (?, 'payment.succeeded', 'order', ?, ?, 'pending', 0, ?, ?)`
    ).bind(outboxId, row.order_id, payload, now, now)
  ])

  return resultResponse(c.env, 'success', row.order_number)
})
