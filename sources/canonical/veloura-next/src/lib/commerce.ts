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
  if (!configuredBase) throw new Error("COMMERCE_NOT_CONFIGURED")

  const response = await fetch(configuredBase + path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {})
    }
  })

  const payload = await response.json() as Envelope<T>
  if (!response.ok || !payload.ok) {
    const error = !payload.ok ? payload.error : { code: "REQUEST_FAILED", message: "Commerce request failed." }
    throw Object.assign(new Error(error.message), { code: error.code, status: response.status })
  }
  return payload.data
}

export async function createCommerceOrder(
  lines: CommerceCartLine[],
  customer: {
    email: string
    fullName: string
    phone: string
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
    const resolved = await request<{ variant_id: string }>("/api/v1/compat/veloura-v2/resolve", {
      method: "POST",
      body: JSON.stringify({ product_id: line.product.id, shade_id: line.shadeId })
    })
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
  }>("/api/v1/checkout/" + encodeURIComponent(cart.id), {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({
      email: customer.email,
      shipping_address: {
        full_name: customer.fullName,
        phone: customer.phone,
        line1: customer.address,
        city: customer.city,
        postal_code: customer.postal,
        country_code: "IR",
        note: customer.note || undefined
      }
    })
  })
}

export async function checkoutFingerprint(lines: CommerceCartLine[], draft: unknown) {
  const input = JSON.stringify({ lines, draft })
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))
  return Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, "0")).join("")
}

export function checkoutIdempotencyKey(fingerprint: string) {
  const storageKey = "veloura-checkout-idempotency-v1"
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
  try { sessionStorage.removeItem("veloura-checkout-idempotency-v1") } catch {}
}
