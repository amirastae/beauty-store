(() => {
  const variantMap = {
    1: 'var_serum_std', 2: 'var_tint_std', 3: 'var_cream_std', 4: 'var_scent04_std',
    5: 'var_balm_std', 6: 'var_cleanser_std', 7: 'var_oil_std', 8: 'var_afterlight_std'
  }

  const getCart = () => {
    try { return JSON.parse(localStorage.getItem('veloura-cart') || '[]') } catch { return [] }
  }

  function apiBase() {
    return window.VELOURA_API_BASE || localStorage.getItem('veloura-api-base') || ''
  }

  async function api(path, init = {}) {
    const base = apiBase()
    if (!base) throw Object.assign(new Error('Commerce API is not configured yet.'), { code: 'API_NOT_CONFIGURED' })

    const res = await fetch(base.replace(/\/$/, '') + path, {
      ...init,
      headers: { 'content-type': 'application/json', ...(init.headers || {}) }
    })
    const body = await res.json().catch(() => null)
    if (!res.ok) throw Object.assign(new Error(body?.error?.message || 'Checkout request failed.'), {
      code: body?.error?.code || 'REQUEST_FAILED', status: res.status
    })
    return body?.data
  }

  function showCheckout() {
    const items = getCart()
    if (!items.length) { window.toast?.('Your bag is empty'); return }

    let dialog = document.getElementById('commerceCheckout')
    if (!dialog) {
      dialog = document.createElement('dialog')
      dialog.id = 'commerceCheckout'
      dialog.className = 'commerce-checkout'
      document.body.appendChild(dialog)
    }

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)
    dialog.innerHTML = `
      <form method="dialog" class="cc-shell" id="checkoutForm">
        <button type="button" class="cc-close" data-cc-close aria-label="Close">×</button>
        <div class="cc-head"><p>SECURE CHECKOUT</p><h2>Complete your ritual.</h2>
        <span>${items.reduce((a,b)=>a+b.qty,0)} items · $${total.toFixed(0)}</span></div>
        <div class="cc-grid">
          <label>Email<input required name="email" type="email" autocomplete="email"></label>
          <label>Full name<input required name="full_name" autocomplete="name"></label>
          <label class="cc-wide">Address<input required name="line1" autocomplete="street-address"></label>
          <label>City<input required name="city" autocomplete="address-level2"></label>
          <label>Postal code<input required name="postal_code" autocomplete="postal-code"></label>
          <label>Country<input required name="country_code" value="DE" maxlength="2" autocomplete="country"></label>
        </div>
        <div class="cc-note">Payment is not charged until a payment provider is connected.</div>
        <button class="btn btn-dark cc-submit" type="submit">Create secure order <span>↗</span></button>
        <div class="cc-status" id="ccStatus" aria-live="polite"></div>
      </form>`

    dialog.showModal()
    dialog.querySelector('[data-cc-close]').addEventListener('click', () => dialog.close())
    const form = dialog.querySelector('#checkoutForm')

    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      const submit = form.querySelector('.cc-submit')
      const status = form.querySelector('#ccStatus')
      submit.disabled = true
      submit.textContent = 'Preparing order…'
      status.textContent = ''

      try {
        const data = new FormData(form)
        const remoteCart = await api('/api/v1/carts', { method: 'POST', body: '{}' })

        for (const item of items) {
          const variant = variantMap[item.id]
          if (!variant) throw new Error('A product in your bag is not mapped to inventory.')
          await api('/api/v1/carts/' + encodeURIComponent(remoteCart.id) + '/items', {
            method: 'POST',
            body: JSON.stringify({ variant_id: variant, quantity: item.qty })
          })
        }

        const key = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()
        const order = await api('/api/v1/checkout/' + encodeURIComponent(remoteCart.id), {
          method: 'POST',
          headers: { 'Idempotency-Key': key },
          body: JSON.stringify({
            email: data.get('email'),
            shipping_address: {
              full_name: data.get('full_name'), line1: data.get('line1'),
              city: data.get('city'), postal_code: data.get('postal_code'),
              country_code: String(data.get('country_code') || '').toUpperCase()
            }
          })
        })

        localStorage.removeItem('veloura-cart')
        status.innerHTML = `Order <strong>#${order.order_number}</strong> created. Payment provider connection is the final gate.`
        submit.textContent = 'Order created'
      } catch (error) {
        status.textContent = error.code === 'API_NOT_CONFIGURED'
          ? 'Checkout core is ready, but the Cloudflare API binding has not been activated yet.'
          : error.message
        submit.disabled = false
        submit.textContent = 'Try again'
      }
    })
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('.checkout')) { event.preventDefault(); showCheckout() }
  })

  const style = document.createElement('style')
  style.textContent = `
    .commerce-checkout{border:0;padding:0;width:min(760px,94vw);border-radius:28px;background:#f6f1eb;color:#151311;box-shadow:0 35px 120px rgba(0,0,0,.28)}
    .commerce-checkout::backdrop{background:rgba(20,15,12,.52);backdrop-filter:blur(9px)}
    .cc-shell{padding:clamp(26px,5vw,52px);position:relative}.cc-close{position:absolute;right:18px;top:16px;border:0;background:transparent;font-size:30px;cursor:pointer}
    .cc-head p{font-size:9px;letter-spacing:.2em;font-weight:600;margin:0 0 12px}.cc-head h2{font-size:clamp(36px,7vw,66px);line-height:.92;letter-spacing:-.05em;margin:0;font-weight:500}.cc-head span{display:block;margin-top:16px;font-size:11px;opacity:.6}
    .cc-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:30px 0 16px}.cc-grid label{font-size:9px;letter-spacing:.11em;text-transform:uppercase}.cc-grid input{display:block;width:100%;margin-top:7px;padding:14px 0;border:0;border-bottom:1px solid rgba(21,19,17,.22);background:transparent;font:400 14px "DM Sans",sans-serif;outline:0}.cc-wide{grid-column:1/-1}
    .cc-note{font-size:10px;line-height:1.5;opacity:.55;margin:12px 0 20px}.cc-submit{border:0;width:100%}.cc-status{min-height:20px;font-size:11px;line-height:1.5;text-align:center;margin-top:14px}
    @media(max-width:560px){.cc-grid{grid-template-columns:1fr}.cc-wide{grid-column:auto}.commerce-checkout{border-radius:24px}}
  `
  document.head.appendChild(style)
})()
