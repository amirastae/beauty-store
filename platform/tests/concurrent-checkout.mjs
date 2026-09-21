import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const run = promisify(execFile)
const base = process.argv[2] || 'http://127.0.0.1:8787'

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  const args = ['-4', '-sS', '-X', method, '-w', '\n%{http_code}', base + path]
  for (const [name, value] of Object.entries(headers)) args.push('-H', name + ': ' + value)
  if (body !== undefined) args.push('--data-binary', body)
  const { stdout } = await run('curl', args, { maxBuffer: 1024 * 1024 })
  const split = stdout.lastIndexOf('\n')
  const text = stdout.slice(0, split)
  const status = Number(stdout.slice(split + 1))
  let parsed
  try { parsed = JSON.parse(text) } catch { parsed = text }
  return { status, body: parsed }
}

const jsonHeaders = { 'content-type': 'application/json' }
const cart = await request('/api/v1/carts', {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify({ currency_code: 'USD' })
})
if (cart.status !== 201) throw new Error('cart create failed: ' + JSON.stringify(cart))

const cartId = cart.body.data.id
const add = await request('/api/v1/carts/' + encodeURIComponent(cartId) + '/items', {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify({ variant_id: 'var_balm_std', quantity: 1 })
})
if (![200, 201].includes(add.status)) throw new Error('add item failed: ' + JSON.stringify(add))

const payload = JSON.stringify({
  email: 'race@example.com',
  shipping_address: { full_name: 'Race QA', line1: '1 Test', city: 'Berlin', postal_code: '10115', country_code: 'DE' }
})

const keyA = 'race-key-a-' + crypto.randomUUID()
const keyB = 'race-key-b-' + crypto.randomUUID()
const [a, b] = await Promise.all([
  request('/api/v1/checkout/' + encodeURIComponent(cartId), {
    method: 'POST', headers: { ...jsonHeaders, 'Idempotency-Key': keyA }, body: payload
  }),
  request('/api/v1/checkout/' + encodeURIComponent(cartId), {
    method: 'POST', headers: { ...jsonHeaders, 'Idempotency-Key': keyB }, body: payload
  })
])

const successCount = [a, b].filter((x) => x.status === 201).length
const rejected = [a, b].filter((x) => x.status === 409)
if (successCount !== 1 || rejected.length !== 1) {
  throw new Error('duplicate checkout guard failed: ' + JSON.stringify({ a, b }))
}
const code = rejected[0]?.body?.error?.code
if (!['CART_CHECKOUT_IN_PROGRESS', 'CART_NOT_OPEN'].includes(code)) {
  throw new Error('unexpected rejection code: ' + JSON.stringify(rejected[0]))
}
console.log(JSON.stringify({ ok: true, cart_id: cartId, statuses: [a.status, b.status], rejection_code: code }))
