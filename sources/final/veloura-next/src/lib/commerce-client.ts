export type CommerceHealth = {
  service: string
  env: string
  database_bound: boolean
  media_bound: boolean
  admin_configured: boolean
  payment_provider_configured: boolean
}

export type ResolvedVariant = {
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

type Envelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } }

export class CommerceApiError extends Error {
  code: string
  status: number

  constructor(code: string, message: string, status: number) {
    super(message)
    this.name = "CommerceApiError"
    this.code = code
    this.status = status
  }
}

export const commerceApiBase = (process.env.NEXT_PUBLIC_COMMERCE_API_BASE || "").replace(/\/$/, "")
export const commerceConfigured = Boolean(commerceApiBase)

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!commerceApiBase) {
    throw new CommerceApiError("COMMERCE_API_NOT_CONFIGURED", "Commerce API is not configured.", 503)
  }

  const response = await fetch(commerceApiBase + path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers || {})
    }
  })

  const payload = await response.json().catch(() => null) as Envelope<T> | null
  if (!response.ok || !payload || !payload.ok) {
    const error = payload && !payload.ok
      ? payload.error
      : { code: "REQUEST_FAILED", message: "Commerce request failed." }
    throw new CommerceApiError(error.code, error.message, response.status)
  }

  return payload.data
}

export const commerce = {
  health: () => request<CommerceHealth>("/api/v1/health"),

  resolveVariant: (productId: string, shadeId?: string) =>
    request<ResolvedVariant>("/api/v1/compat/veloura-v2/resolve", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, shade_id: shadeId })
    }),

  createCart: () =>
    request<{ id: string; currency_code: string; status: string; total_minor: number }>("/api/v1/carts", {
      method: "POST",
      body: JSON.stringify({ currency_code: "IRR" })
    }),

  addItem: (cartId: string, variantId: string, quantity: number) =>
    request<{ id: string; quantity: number }>(
      "/api/v1/carts/" + encodeURIComponent(cartId) + "/items",
      {
        method: "POST",
        body: JSON.stringify({ variant_id: variantId, quantity })
      }
    ),

  checkout: (
    cartId: string,
    input: {
      phone: string
      email?: string
      shipping_address: Record<string, unknown>
      billing_address?: Record<string, unknown>
    },
    idempotencyKey: string
  ) =>
    request<{
      order_id: string
      order_number: number
      payment_id: string
      payment_status: string
      currency_code: string
      subtotal_minor: number
      shipping_minor: number
      total_minor: number
      payment_expires_at: string
    }>("/api/v1/checkout/" + encodeURIComponent(cartId), {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(input)
    }),

  startPayment: (orderId: string) =>
    request<{ redirect_url: string; authority: string }>(
      "/api/v1/payments/" + encodeURIComponent(orderId) + "/start",
      { method: "POST", body: "{}" }
    )
}

export function irrToToman(value: number) {
  return Math.trunc(value / 10)
}
