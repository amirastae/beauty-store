import type { CartLine } from "@/store/cart";

type ApiEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

type ResolvedVariant = {
  variant_id: string;
  price_minor: number;
  compare_at_minor: number | null;
  currency_code: string;
  sku: string;
};

type Inventory = {
  variant_id: string;
  stock_on_hand: number;
  reserved: number;
  available: number;
};

export type CommerceVerificationIssue = {
  code: "OUT_OF_STOCK" | "CURRENCY_MISMATCH";
  productId: string;
  message: string;
};

export type CommerceVerification = {
  configured: true;
  serverSubtotalToman: number;
  stalePriceLines: number;
  issues: CommerceVerificationIssue[];
  lines: Array<{
    productId: string;
    shadeId?: string;
    qty: number;
    variantId: string;
    available: number;
    serverUnitToman: number;
    localUnitToman: number;
  }>;
};

const apiBase = (process.env.NEXT_PUBLIC_COMMERCE_API_BASE ?? "").trim().replace(/\/$/, "");

export const commerceVerificationConfigured = Boolean(apiBase);

export class CommerceVerificationError extends Error {
  constructor(
    message: string,
    public readonly code = "REQUEST_FAILED",
    public readonly status = 0
  ) {
    super(message);
    this.name = "CommerceVerificationError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiBase) throw new CommerceVerificationError("Commerce API is not configured.", "API_NOT_CONFIGURED");

  const response = await fetch(apiBase + path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!response.ok || !payload?.ok) {
    const error = payload && !payload.ok
      ? payload.error
      : { code: "REQUEST_FAILED", message: "Commerce verification failed." };
    throw new CommerceVerificationError(error.message, error.code, response.status);
  }
  return payload.data;
}

async function resolveLine(line: CartLine) {
  const resolved = await request<ResolvedVariant>("/api/v1/compat/veloura-v2/resolve", {
    method: "POST",
    body: JSON.stringify({
      product_id: line.product.id,
      ...(line.shadeId ? { shade_id: line.shadeId } : {})
    })
  });

  const inventory = await request<Inventory>(
    "/api/v1/inventory/" + encodeURIComponent(resolved.variant_id)
  );

  const serverUnitToman = Math.trunc(Number(resolved.price_minor) / 10);
  const available = Math.max(0, Number(inventory.available) || 0);

  return {
    productId: line.product.id,
    shadeId: line.shadeId,
    qty: line.qty,
    variantId: resolved.variant_id,
    currencyCode: resolved.currency_code,
    available,
    serverUnitToman,
    localUnitToman: line.product.price
  };
}

export async function verifyCommerceCart(lines: CartLine[]): Promise<CommerceVerification> {
  if (!commerceVerificationConfigured) {
    throw new CommerceVerificationError("Commerce API is not configured.", "API_NOT_CONFIGURED");
  }

  const verified = await Promise.all(lines.map(resolveLine));
  const issues: CommerceVerificationIssue[] = [];

  for (const line of verified) {
    if (line.currencyCode !== "IRR") {
      issues.push({
        code: "CURRENCY_MISMATCH",
        productId: line.productId,
        message: "واحد پول این محصول با سبد ولورا هماهنگ نیست."
      });
    }
    if (line.available < line.qty) {
      issues.push({
        code: "OUT_OF_STOCK",
        productId: line.productId,
        message: "موجودی قابل‌فروش این محصول برای تعداد انتخاب‌شده کافی نیست."
      });
    }
  }

  return {
    configured: true,
    serverSubtotalToman: verified.reduce((sum, line) => sum + line.serverUnitToman * line.qty, 0),
    stalePriceLines: verified.filter((line) => line.serverUnitToman !== line.localUnitToman).length,
    issues,
    lines: verified.map(({ currencyCode: _currencyCode, ...line }) => line)
  };
}
