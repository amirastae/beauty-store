export type VelouraV2CartLine = {
  product: {
    id: string
    slug: string
    nameFa: string
    nameEn: string
    price: number
  }
  qty: number
  shadeId?: string
}

type ResolvedVariant = {
  variant_id: string
  product_id: string
  sku: string
  title: string
  price_minor: number
  compare_at_minor: number | null
  currency_code: string
  option_json: string
  slug: string
  product_title: string
  thumbnail_url: string | null
}

type ApiEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } }

export class VelouraCommerceClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(this.baseUrl.replace(/\/$/, '') + path, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(init?.headers || {})
      }
    })

    const payload = await response.json() as ApiEnvelope<T>
    if (!response.ok || !payload.ok) {
      const error = !payload.ok ? payload.error : { code: 'REQUEST_FAILED', message: 'Request failed.' }
      throw Object.assign(new Error(error.message), { code: error.code, status: response.status })
    }

    return payload.data
  }

  resolveVelouraV2Variant(productId: string, shadeId?: string) {
    return this.request<ResolvedVariant>('/api/v1/compat/veloura-v2/resolve', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, shade_id: shadeId })
    })
  }

  resolveShopV1Variant(productId: number | string) {
    return this.request<ResolvedVariant>('/api/v1/compat/shop-v1/resolve', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId })
    })
  }

  createCart(currencyCode: 'USD' | 'IRR' = 'USD') {
    return this.request<{ id: string; currency_code: string; status: string; total_minor: number }>(
      '/api/v1/carts',
      { method: 'POST', body: JSON.stringify({ currency_code: currencyCode }) }
    )
  }

  addItem(cartId: string, variantId: string, quantity: number) {
    return this.request<{ id: string; quantity: number }>(
      '/api/v1/carts/' + encodeURIComponent(cartId) + '/items',
      {
        method: 'POST',
        body: JSON.stringify({ variant_id: variantId, quantity })
      }
    )
  }

  async createCartFromVelouraV2(lines: VelouraV2CartLine[]) {
    const cart = await this.createCart('IRR')

    for (const line of lines) {
      const resolved = await this.resolveVelouraV2Variant(line.product.id, line.shadeId)
      await this.addItem(cart.id, resolved.variant_id, line.qty)
    }

    return cart
  }

  async createCartFromShopV1(lines: Array<{ id: number | string; qty: number }>) {
    const cart = await this.createCart('USD')

    for (const line of lines) {
      const resolved = await this.resolveShopV1Variant(line.id)
      await this.addItem(cart.id, resolved.variant_id, line.qty)
    }

    return cart
  }

  checkout(cartId: string, input: {
    email: string
    shipping_address: Record<string, unknown>
    billing_address?: Record<string, unknown>
    idempotencyKey?: string
  }) {
    const key = input.idempotencyKey || crypto.randomUUID()
    return this.request<{
      order_id: string
      order_number: number
      payment_id: string
      payment_status: string
      currency_code: string
      subtotal_minor: number
      shipping_minor: number
      total_minor: number
    }>('/api/v1/checkout/' + encodeURIComponent(cartId), {
      method: 'POST',
      headers: { 'Idempotency-Key': key },
      body: JSON.stringify({
        email: input.email,
        shipping_address: input.shipping_address,
        billing_address: input.billing_address
      })
    })
  }
}

export function irrToToman(irr: number) {
  return Math.trunc(irr / 10)
}
