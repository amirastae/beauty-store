(() => {
  const API_BASE = window.VELOURA_API_BASE || localStorage.getItem('veloura-api-base') || ''

  async function request(path, init = {}) {
    if (!API_BASE) throw new Error('API_NOT_CONFIGURED')
    const res = await fetch(API_BASE.replace(/\/$/, '') + path, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(init.headers || {})
      }
    })

    const body = await res.json().catch(() => null)
    if (!res.ok) {
      const err = new Error(body?.error?.message || 'Request failed')
      err.code = body?.error?.code || 'REQUEST_FAILED'
      err.status = res.status
      throw err
    }
    return body?.data
  }

  function idem() {
    return crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()
  }

  window.VelouraCommerce = {
    configured: Boolean(API_BASE),
    async createCart() {
      return request('/api/v1/carts', { method: 'POST', body: '{}' })
    },
    async getCart(cartId) {
      return request('/api/v1/carts/' + encodeURIComponent(cartId))
    },
    async addItem(cartId, variantId, quantity = 1) {
      return request('/api/v1/carts/' + encodeURIComponent(cartId) + '/items', {
        method: 'POST',
        body: JSON.stringify({ variant_id: variantId, quantity })
      })
    },
    async checkout(cartId, payload) {
      return request('/api/v1/checkout/' + encodeURIComponent(cartId), {
        method: 'POST',
        headers: { 'Idempotency-Key': idem() },
        body: JSON.stringify(payload)
      })
    }
  }
})()
