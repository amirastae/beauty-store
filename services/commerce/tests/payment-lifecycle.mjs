import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const base = process.argv[2] || 'http://127.0.0.1:8787'
const mockBase = process.argv[3] || 'http://127.0.0.1:8790'
const wranglerConfig = process.env.PAYMENT_TEST_CONFIG || 'wrangler.payment-test.jsonc'
const jsonHeaders = { 'content-type': 'application/json' }

async function request(path, { method = 'GET', headers = {}, body, redirect = 'manual' } = {}) {
  const response = await fetch(base + path, { method, headers, body, redirect })
  const text = await response.text()
  let parsed
  try { parsed = JSON.parse(text) } catch { parsed = text }
  return { status: response.status, body: parsed, headers: response.headers }
}

async function setMode(mode) {
  const response = await fetch(mockBase + '/__mode', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ mode })
  })
  if (!response.ok) throw new Error('mock mode failed: ' + mode)
}

async function inventory(variantId) {
  const response = await request('/api/v1/inventory/' + encodeURIComponent(variantId))
  if (response.status !== 200) throw new Error('inventory failed: ' + JSON.stringify(response))
  return response.body.data
}

async function status(receipt) {
  const response = await request('/api/v1/orders/status', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ receipt })
  })
  if (response.status !== 200) throw new Error('status failed: ' + JSON.stringify(response))
  return response.body.data
}

async function createOrder(variantId) {
  const before = await inventory(variantId)
  const cart = await request('/api/v1/carts', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ currency_code: 'IRR' })
  })
  if (cart.status !== 201) throw new Error('cart failed: ' + JSON.stringify(cart))

  const cartId = cart.body.data.id
  const add = await request('/api/v1/carts/' + encodeURIComponent(cartId) + '/items', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ variant_id: variantId, quantity: 1 })
  })
  if (![200, 201].includes(add.status)) throw new Error('add failed: ' + JSON.stringify(add))

  const checkout = await request('/api/v1/checkout/' + encodeURIComponent(cartId), {
    method: 'POST',
    headers: { ...jsonHeaders, 'Idempotency-Key': 'paylife-' + crypto.randomUUID() },
    body: JSON.stringify({
      phone: '09121234567',
      shipping_address: {
        full_name: 'Payment Lifecycle QA',
        line1: 'Test Address',
        city: 'Tehran',
        postal_code: '1234567890',
        country_code: 'IR'
      }
    })
  })
  if (checkout.status !== 201) throw new Error('checkout failed: ' + JSON.stringify(checkout))

  const after = await inventory(variantId)
  if (after.stock_on_hand !== before.stock_on_hand) {
    throw new Error('stock changed before verified payment: ' + JSON.stringify({ before, after }))
  }
  if (after.reserved !== before.reserved + 1 || after.available !== before.available - 1) {
    throw new Error('reservation invariant failed: ' + JSON.stringify({ before, after }))
  }

  return { before, order: checkout.body.data }
}

async function startPayment(orderId) {
  return request('/api/v1/payments/' + encodeURIComponent(orderId) + '/start', {
    method: 'POST',
    headers: jsonHeaders,
    body: '{}'
  })
}

async function callback(orderId, authority, providerStatus) {
  const query = new URLSearchParams({
    order_id: orderId,
    Authority: authority,
    Status: providerStatus
  })
  return request('/api/v1/payments/zarinpal/callback?' + query.toString())
}

async function expireOrder(orderId) {
  const sql = "UPDATE orders SET payment_expires_at='2000-01-01T00:00:00.000Z' WHERE id='" +
    orderId.replaceAll("'", "''") + "';"
  await exec('npx', [
    'wrangler', 'd1', 'execute', 'DB',
    '--config', wranglerConfig,
    '--local',
    '--command', sql
  ], { maxBuffer: 4 * 1024 * 1024 })
}

async function assertReleased(variantId, before, label) {
  const now = await inventory(variantId)
  if (now.stock_on_hand !== before.stock_on_hand || now.reserved !== before.reserved || now.available !== before.available) {
    throw new Error(label + ' did not release reservation exactly once: ' + JSON.stringify({ before, now }))
  }
}

async function successCase() {
  const variant = 'var_v2_lip_rose'
  const created = await createOrder(variant)
  await setMode('success')
  const start = await startPayment(created.order.order_id)
  if (start.status !== 200) throw new Error('success start failed: ' + JSON.stringify(start))
  const authority = start.body.data.authority

  const first = await callback(created.order.order_id, authority, 'OK')
  if (first.status !== 200 || first.body?.data?.payment !== 'success') {
    throw new Error('success callback failed: ' + JSON.stringify(first))
  }

  const paidInventory = await inventory(variant)
  if (
    paidInventory.stock_on_hand !== created.before.stock_on_hand - 1 ||
    paidInventory.reserved !== created.before.reserved ||
    paidInventory.available !== created.before.available - 1
  ) {
    throw new Error('paid inventory invariant failed: ' + JSON.stringify({ before: created.before, paidInventory }))
  }

  const paidStatus = await status(created.order.receipt_token)
  if (paidStatus.payment_status !== 'paid' || !['confirmed', 'manual_review'].includes(paidStatus.order_status)) {
    throw new Error('paid status invariant failed: ' + JSON.stringify(paidStatus))
  }

  const duplicate = await callback(created.order.order_id, authority, 'OK')
  if (duplicate.status !== 200 || duplicate.body?.data?.payment !== 'success') {
    throw new Error('duplicate success callback failed: ' + JSON.stringify(duplicate))
  }

  const afterDuplicate = await inventory(variant)
  if (
    afterDuplicate.stock_on_hand !== paidInventory.stock_on_hand ||
    afterDuplicate.reserved !== paidInventory.reserved
  ) {
    throw new Error('duplicate callback changed inventory twice: ' + JSON.stringify({ paidInventory, afterDuplicate }))
  }
}

async function cancellationCase() {
  const variant = 'var_v2_lip_berry'
  const created = await createOrder(variant)
  await setMode('cancel')
  const start = await startPayment(created.order.order_id)
  if (start.status !== 200) throw new Error('cancel start failed: ' + JSON.stringify(start))

  const result = await callback(created.order.order_id, start.body.data.authority, 'NOK')
  if (result.status !== 200 || result.body?.data?.payment !== 'cancelled') {
    throw new Error('cancel callback failed: ' + JSON.stringify(result))
  }

  await assertReleased(variant, created.before, 'cancel')
  const state = await status(created.order.receipt_token)
  if (state.payment_status !== 'cancelled' || state.order_status !== 'cancelled') {
    throw new Error('cancel status failed: ' + JSON.stringify(state))
  }

  const duplicate = await callback(created.order.order_id, start.body.data.authority, 'NOK')
  if (duplicate.status !== 200) throw new Error('duplicate cancel callback failed')
  await assertReleased(variant, created.before, 'duplicate cancel')
}

async function verifyFailureCase() {
  const variant = 'var_v2_lip_nude'
  const created = await createOrder(variant)
  await setMode('verify_fail')
  const start = await startPayment(created.order.order_id)
  if (start.status !== 200) throw new Error('verify-fail start failed: ' + JSON.stringify(start))

  const result = await callback(created.order.order_id, start.body.data.authority, 'OK')
  if (result.status !== 200 || result.body?.data?.payment !== 'failed') {
    throw new Error('verify-fail callback failed: ' + JSON.stringify(result))
  }

  await assertReleased(variant, created.before, 'verify failure')
  const state = await status(created.order.receipt_token)
  if (state.payment_status !== 'failed' || state.order_status !== 'cancelled') {
    throw new Error('verify failure status failed: ' + JSON.stringify(state))
  }
}

async function requestRejectionAndExpiryCase() {
  const variant = 'var_v2_eye_champagne'
  const created = await createOrder(variant)
  await setMode('request_reject')
  const rejected = await startPayment(created.order.order_id)
  if (rejected.status !== 502 || rejected.body?.error?.code !== 'PAYMENT_PROVIDER_REJECTED') {
    throw new Error('provider rejection gate failed: ' + JSON.stringify(rejected))
  }

  const stillReserved = await inventory(variant)
  if (
    stillReserved.stock_on_hand !== created.before.stock_on_hand ||
    stillReserved.reserved !== created.before.reserved + 1
  ) {
    throw new Error('provider rejection should retain temporary reservation: ' + JSON.stringify(stillReserved))
  }

  await expireOrder(created.order.order_id)
  const expired = await startPayment(created.order.order_id)
  if (expired.status !== 409 || expired.body?.error?.code !== 'ORDER_EXPIRED') {
    throw new Error('expiry path failed: ' + JSON.stringify(expired))
  }

  await assertReleased(variant, created.before, 'expiry')
  const state = await status(created.order.receipt_token)
  if (state.payment_status !== 'expired' || state.order_status !== 'cancelled') {
    throw new Error('expiry status failed: ' + JSON.stringify(state))
  }
}

await successCase()
await cancellationCase()
await verifyFailureCase()
await requestRejectionAndExpiryCase()

console.log('PAYMENT_LIFECYCLE_PASS')
