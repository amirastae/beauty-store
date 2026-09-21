export type CommerceCartLine = {
  product: { id: string }
  qty: number
  shadeId?: string
}

type Envelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } }

const configuredBase = process.env.NEXT_PUBLIC_COMMERCE_API_BASE?.trim().replace(/\/$/, "") || ""

export const commerceEnabled = Boolean(configuredBase)

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!configuredBase) throw Object.assign(new Error("Commerce API is not configured."), { code: "COMMERCE_NOT_CONFIGURED" })

  const response = await fetch(configuredBase + path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {})
    }
  })

  const payload = await response.json().catch(() => null) as Envelope<T> | null
  if (!response.ok || !payload || !payload.ok) {
    const error = payload && !payload.ok ? payload.error : { code: "REQUEST_FAILED", message: "Commerce request failed." }
    throw Object.assign(new Error(error.message), { code: error.code, status: response.status })
  }
  return payload.data
}

export function commerceHealth() {
  return request<{
    service: string
    env: string
    database_bound: boolean
    media_bound: boolean
    admin_configured: boolean
    payment_provider_configured: boolean
  }>("/api/v1/health")
}

export async function createCommerceOrder(
  lines: CommerceCartLine[],
  customer: {
    email?: string
    fullName: string
    phone: string
    province: string
    address: string
    city: string
    postal: string
    note?: string
  },
  idempotencyKey: string
) {
  const cart = await request<{ id: string }>("/api/v1/carts", {
    method: "POST",
    body: JSON.stringify({ currency_code: "IRR" })
  })

  for (const line of lines) {
    const resolved = await request<{ variant_id: string; currency_code: string }>("/api/v1/compat/veloura-v2/resolve", {
      method: "POST",
      body: JSON.stringify({ product_id: line.product.id, shade_id: line.shadeId })
    })

    if (resolved.currency_code !== "IRR") {
      throw Object.assign(new Error("Resolved product currency does not match the IRR cart."), { code: "CURRENCY_MISMATCH" })
    }

    await request("/api/v1/carts/" + encodeURIComponent(cart.id) + "/items", {
      method: "POST",
      body: JSON.stringify({ variant_id: resolved.variant_id, quantity: line.qty })
    })
  }

  return request<{
    order_id: string
    order_number: number
    payment_id: string
    payment_status: string
    currency_code: string
    subtotal_minor: number
    shipping_minor: number
    total_minor: number
    payment_expires_at: string
  }>("/api/v1/checkout/" + encodeURIComponent(cart.id), {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({
      email: customer.email?.trim() || undefined,
      phone: customer.phone,
      shipping_address: {
        full_name: customer.fullName,
        phone: customer.phone,
        line1: customer.address,
        city: customer.city,
        region: customer.province,
        postal_code: customer.postal,
        country_code: "IR",
        note: customer.note || undefined
      }
    })
  })
}

export function startCommercePayment(orderId: string) {
  return request<{ redirect_url: string; authority: string }>(
    "/api/v1/payments/" + encodeURIComponent(orderId) + "/start",
    { method: "POST", body: "{}" }
  )
}

export async function checkoutFingerprint(lines: CommerceCartLine[], draft: unknown) {
  const input = JSON.stringify({ lines, draft })
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))
  return Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, "0")).join("")
}

export function checkoutIdempotencyKey(fingerprint: string) {
  const storageKey = "veloura-checkout-idempotency-v2"
  try {
    const raw = sessionStorage.getItem(storageKey)
    if (raw) {
      const saved = JSON.parse(raw) as { fingerprint?: string; key?: string }
      if (saved.fingerprint === fingerprint && saved.key) return saved.key
    }
  } catch {}

  const key = "web-" + crypto.randomUUID()
  try {
    sessionStorage.setItem(storageKey, JSON.stringify({ fingerprint, key }))
  } catch {}
  return key
}

export function clearCheckoutIdempotency() {
  try { sessionStorage.removeItem("veloura-checkout-idempotency-v2") } catch {}
}

export function irrMinorToToman(value: number) {
  return Math.trunc(value / 10)
}
