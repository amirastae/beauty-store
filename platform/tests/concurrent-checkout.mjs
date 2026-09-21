const base = process.argv[2] || 'http://127.0.0.1:8787'

async function request(path, init = {}) {
  const res = await fetch(base + path, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers || {}) }
  })
  const text = await res.text()
  let body
  try { body = JSON.parse(text) } catch { body = text }
  return { status: res.status, body }
}

const cart = await request('/api/v1/carts', {
  method: 'POST',
  body: JSON.stringify({ currency_code: 'USD' })
})
if (cart.status !== 201) throw new Error('cart create failed: ' + JSON.stringify(cart))

const cartId = cart.body.data.id
const add = await request('/api/v1/carts/' + encodeURIComponent(cartId) + '/items', {
  method: 'POST',
  body: JSON.stringify({ variant_id: 'var_balm_std', quantity: 1 })
})
if (![200, 201].includes(add.status)) throw new Error('add item failed: ' + JSON.stringify(add))

const payload = JSON.stringify({
  email: 'race@example.com',
  shipping_address: {
    full_name: 'Race QA',
    line1: '1 Test',
    city: 'Berlin',
    postal_code: '10115',
    country_code: 'DE'
  }
})

const [a, b] = await Promise.all([
  request('/api/v1/checkout/' + encodeURIComponent(cartId), {
    method: 'POST',
    headers: { 'Idempotency-Key': 'race-key-a-' + crypto.randomUUID() },
    body: payload
  }),
  request('/api/v1/checkout/' + encodeURIComponent(cartId), {
    method: 'POST',
    headers: { 'Idempotency-Key': 'race-key-b-' + crypto.randomUUID() },
    body: payload
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

console.log(JSON.stringify({
  ok: true,
  cart_id: cartId,
  statuses: [a.status, b.status],
  rejection_code: code
}))
