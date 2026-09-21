# Handoff — Iranian Commerce UX v1

- Source branch: `iranian-commerce-ux-v1`
- Tested source commit: `27608040d27e7004882ad13d8f19a03a0031036f`
- Verification run: `35559122817`
- Base workstream: `beauty-v2-foundation@0e1c78f1dfd1a4822a74cced49cc8130b85e4b1f`
- Scope: Persian/Iran commerce UX and safety only; homepage motion/editorial and production deployment remain untouched.

## Applied

### Shop and discovery
- Persian number/Toman formatting.
- Search normalization for Persian/Arabic keyboard variants: ی/ي, ک/ك, half-space, diacritics and extra whitespace.
- Category, sale-only and price/discount sorting.
- Search/filter state reflected in query parameters.
- Persistent wishlist and product compare (maximum 4).
- Responsive compare table for price/category/brand/shades.
- Live cart counter on shop/wishlist.
- AM/PM skincare routine guide as an isolated public route.

### Cart
- Persistent Zustand cart with explicit post-mount rehydration to prevent hydration mismatch.
- Persisted cart lines are reconciled against the fresh catalog on hydration; removed products are dropped, quantities are clamped, and invalid shades fall back safely.
- Persisted wishlist/compare IDs are filtered against the current catalog, and compare remains capped at 4.
- Quantity stepper bounded to 1..99.
- Per-line shade awareness.
- Clear-cart action.
- Savings display derived only from current catalog compare-at values.
- Checkout handoff without fake fulfillment/payment success.

### Checkout
- Iranian mobile normalization/validation.
- 31-province selector, city, 10-digit postal code, full address and order note.
- Native required-field validation restored.
- Optional commerce-core verification via `NEXT_PUBLIC_COMMERCE_API_BASE`.
- Verification is read-only: resolves compatibility IDs, reads server price and inventory, and reports stale local prices or insufficient stock.
- It does not create backend carts, reserve stock, create orders, or mark payments successful.
- When API is absent/unavailable, UI explicitly states that no order/payment was created.

### Product UX
- Toman and compare-at display.
- Shade selection.
- Persistent wishlist/compare actions.
- Web Share API with clipboard fallback.
- Canonical/OpenGraph/Twitter metadata.
- Product + Breadcrumb JSON-LD.
- Removed unverified inventory assertion from Schema.
- Removed seed/demo rating, review-count and “popular/bestseller” social proof from commerce-facing UI and Product structured data.

### SEO and trust
- Canonicals on public routes.
- `noindex` for cart, checkout, wishlist and compare.
- Public sitemap excludes private/utility commerce routes.
- robots disallows cart/checkout/wishlist/compare.
- Trust copy avoids asserting live nationwide fulfillment/tracking before providers are connected.
- Routine route is public and included in sitemap.

## Automated verification gates

Workflow: `.github/workflows/iranian-commerce-ux-verify.yml`

Exact run `35558992289` on tested code commit `f4f14e9e14dfa78373341178c22e782655c0fbd9`:
- dependency preparation: PASS
- `npm ci`: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS
- `npm run seo:check`: PASS
- `npm run links:check`: PASS
- `npm run catalog:check`: PASS
- `npm run a11y:check`: PASS

The custom gates cover:
- canonical/noindex/robots/sitemap/JSON-LD expectations,
- internal broken links across static output,
- product structured-data integrity and unique canonicals,
- prohibition of unsupported inventory and aggregate-rating claims,
- lang/dir, one-H1, image alt, button accessible names, duplicate IDs and mobile zoom restrictions.

## Key added paths
- `.github/workflows/iranian-commerce-ux-verify.yml`
- `veloura-next/.env.example`
- `veloura-next/scripts/{seo-smoke,link-smoke,catalog-smoke,a11y-smoke}.mjs`
- `veloura-next/src/app/{compare,routine}/...`
- `veloura-next/src/app/iranian-commerce.css`
- `veloura-next/src/components/beauty/RoutineGuide.tsx`
- `veloura-next/src/components/commerce/{IranianTrustRail,StoreHydrator}.tsx`
- `veloura-next/src/components/compare/ComparePage.tsx`
- `veloura-next/src/lib/{locale,commerce-verify}.ts`
- `veloura-next/src/store/compare.ts`

## Commerce-core integration status

Current backend contract observed on `commerce-core-v1@cf9edc4060c4cfa5db51c725735067eca5e95268`:
- `POST /api/v1/compat/veloura-v2/resolve`
- `GET /api/v1/inventory/:variantId`
- `POST /api/v1/carts`
- `POST /api/v1/carts/:id/items`
- `POST /api/v1/checkout/:cartId`

This UI branch intentionally consumes only the two read/resolve endpoints for safe verification.

### Blocking issue before mutating checkout is enabled
The current commerce-core checkout computes shipping with a fixed rule:
`subtotal >= 7500 ? 0 : 800`
while the same engine supports multiple currencies. That rule is not currency-aware and is unsafe to promote as an IRR shipping charge without an explicit shipping policy/service.

Payment is also intentionally `requires_provider` until a real provider adapter confirms it.

Therefore:
1. do not enable frontend cart/order mutation yet;
2. fix currency-aware shipping or attach the real shipping provider first;
3. attach and verify the real payment provider/webhook flow;
4. then integrate through `integration-staging`, not directly to production.

## Non-interference / promotion rules
- Do not merge this branch wholesale into production.
- Do not overwrite current homepage/motion/design work from other chats.
- Review overlapping frontend files in integration staging.
- Commerce-core remains source of truth for final price, inventory, shipping and payment.
- Production branch `cloudflare-site` was not modified by this workstream.
- No production deploy was performed from this branch.
