# Handoff — Iranian Commerce UX v1

- Source branch: `iranian-commerce-ux-v1`
- Tested code commit: `59c77a3e0cf3025b31b72e0eb58d8eb60940ddf1`
- Verification run: `35561513257`
- Base workstream: `beauty-v2-foundation@0e1c78f1dfd1a4822a74cced49cc8130b85e4b1f`
- Scope: Persian/Iran commerce UX, trust, SEO, accessibility, static-response security and low-risk performance hardening. Homepage motion/editorial and production deployment remain untouched.

## Official store contact

- Support email: `fatmhkhan121@gmail.com`
- Published on `/contact/`, linked from shop and checkout support.
- Published in Organization JSON-LD as customer-support contact.
- Explicitly not used as customer checkout identity/fallback.

## Applied

### Shop and discovery
- Persian number/Toman formatting.
- Search normalization for Persian/Arabic keyboard variants: ی/ي, ک/ك, half-space, diacritics and extra whitespace.
- Category, sale-only, price and discount sorting.
- Search/filter state reflected in query parameters.
- Persistent wishlist and product compare, capped at 4.
- Responsive compare table for price/category/brand/shades.
- Live reactive cart counters on shop, wishlist, product and compare routes.
- AM/PM skincare routine guide as an isolated public route.
- Recently viewed products are persisted locally, reconciled against the current catalog and shown only on product pages.
- Unified commerce footer provides shop/routine/contact navigation and the official support email across commerce routes without touching the homepage.

### Cart/state
- Zustand cart/wishlist/compare hydration is explicitly deferred until mount to avoid SSR hydration mismatch.
- Persisted cart lines are reconciled against the current catalog on hydration.
- Removed products are dropped.
- Quantities are clamped to 1..99.
- Invalid/removed shades fall back safely.
- Wishlist/compare IDs are filtered against the current catalog.
- Quantity stepper and clear-cart action.
- Savings display is derived only from current local compare-at values.

### Checkout
- Iranian mobile normalization/validation.
- 31-province selector, city, 10-digit postal code, full address and order note.
- Native required-field validation restored.
- Payment wording explicitly states that the real gateway is not connected yet.
- Optional commerce-core verification through `NEXT_PUBLIC_COMMERCE_API_BASE`.
- Verification is read-only: resolve compatibility ID -> read server price -> read available inventory.
- Server-verified line totals and subtotal replace stale local values in the summary after verification.
- Insufficient stock, stale price, missing mapping and backend-unavailable states are surfaced without creating an order.
- No backend cart creation, reservation, order creation or payment mutation is enabled from this branch.
- If Commerce API is absent, UI explicitly states that no order/payment was created.

### Product/trust
- Toman and compare-at display.
- Shade selection.
- Persistent wishlist/compare actions.
- Web Share API with clipboard fallback.
- Canonical/OpenGraph/Twitter metadata.
- Product + Breadcrumb JSON-LD.
- JSON-LD script payloads escape `<` as `\\u003c`.
- Removed unverified `InStock` assertion.
- Removed seed/demo ratings, review counts and bestseller/popularity social proof from commerce-facing UI and Product structured data.
- Trust copy does not claim live nationwide fulfillment/tracking before providers exist.

### SEO
- Canonicals on public routes.
- `noindex` for cart, checkout, wishlist and compare.
- Utility routes are excluded from sitemap.
- robots allows those pages to be crawled so crawlers can actually observe their meta `noindex` directives; they are not blocked with `Disallow`.
- Routine route is public and included in sitemap.

### Accessibility
- Skip navigation link to the main content target on every rendered route.
- Visible `:focus-visible` treatment for keyboard navigation.
- Accessibility smoke gate verifies skip target plus existing lang/dir/H1/alt/button/ID/zoom invariants.

### Security / performance
- Measured static baseline before budget enforcement: total ~2.21MB, JS ~1.74MB, largest JS chunk ~0.89MB, CSS ~0.04MB, largest HTML ~0.02MB.
- Performance CI budgets: total <= 4MB, JS total <= 3MB, largest JS chunk <= 1.2MB, CSS <= 150KB, largest HTML <= 100KB.
- Next.js pinned to stable `16.3.5` instead of a floating `^16.0.0` range.
- Cloudflare static response headers in `public/_headers`:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `X-Permitted-Cross-Domain-Policies: none`
- Hashed `/_next/static/*` assets use `Cache-Control: public, max-age=31536000, immutable`.
- CSP and HSTS are intentionally not guessed in this workstream; those should be finalized with the production domain/runtime policy.

## Automated verification gates

Workflow: `.github/workflows/iranian-commerce-ux-verify.yml`

GitHub Actions verification on tested code commit `59c77a3e0cf3025b31b72e0eb58d8eb60940ddf1`:
- `npm ci`: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS
- `npm run seo:check`: PASS — 56 checks / 4 product pages
- `npm run links:check`: PASS — 77 internal links / 15 pages
- `npm run catalog:check`: PASS — 4 products / 4 unique canonicals
- `npm run a11y:check`: PASS — 13 pages / 20 images / 77 buttons
- `npm run security:check`: PASS
- `npm run performance:check`: PASS — baseline guard for total output, JS, largest JS chunk, CSS and HTML page size

CI itself is bounded with a 10-minute timeout, read-only repository permission and concurrency cancellation for stale runs. Manual `workflow_dispatch` verification is also available.

The custom gates cover:
- canonical/noindex/robots/sitemap/JSON-LD expectations,
- internal broken links across static output,
- product structured-data integrity and unique canonicals,
- prohibition of unsupported inventory/aggregate-rating claims,
- lang/dir, exactly one H1, image alt, button accessible names, duplicate IDs and mobile zoom restrictions,
- presence of Cloudflare response security headers,
- presence of immutable caching for hashed Next static assets.

## Key paths
- `.github/workflows/iranian-commerce-ux-verify.yml`
- `veloura-next/.env.example`
- `veloura-next/public/_headers`
- `veloura-next/scripts/{seo-smoke,link-smoke,catalog-smoke,a11y-smoke,security-smoke}.mjs`
- `veloura-next/src/app/{compare,routine}/...`
- `veloura-next/src/app/iranian-commerce.css`
- `veloura-next/src/components/beauty/RoutineGuide.tsx`
- `veloura-next/src/components/commerce/{IranianTrustRail,StoreHydrator}.tsx`
- `veloura-next/src/components/compare/ComparePage.tsx`
- `veloura-next/src/lib/{locale,commerce-verify}.ts`
- `veloura-next/src/store/compare.ts`

## Current commerce-core integration status

Rechecked parallel backend branch:
- `commerce-core-v1@cecea343cd17ab75e237eb573db3d0533c36efa7`

Relevant endpoints still present:
- `POST /api/v1/compat/veloura-v2/resolve`
- `GET /api/v1/inventory/:variantId`
- `POST /api/v1/carts`
- `POST /api/v1/carts/:id/items`
- `POST /api/v1/checkout/:cartId`

This UI branch intentionally consumes only the read/resolve path for safe verification.

### Blockers before mutating checkout is enabled
1. Shipping is still computed in commerce-core with a currency-agnostic fixed rule:
   `subtotal >= 7500 ? 0 : 800`
   while carts may be USD or IRR. This must become currency-aware or be replaced by the real shipping service/policy.
2. Backend checkout currently requires a valid email, while this Iran-focused UI treats email as optional and mobile as the primary contact. The contract must be aligned before mutation checkout is enabled.
3. Payment remains `requires_provider` / unconfigured until a real provider adapter and verified webhook flow exist.

Therefore:
- do not enable frontend cart/order mutation yet;
- fix the shipping policy/service;
- decide the email-vs-mobile checkout contract;
- attach and verify the real payment provider/webhook;
- integrate only through `integration-staging`, not directly to production.

## Remaining non-blocking caveats
- Product imagery still comes from `images.unsplash.com`; for maximum Iran resilience/performance, local/R2-owned product media should replace runtime third-party image dependency in the asset workstream.
- There is no committed npm lockfile in `veloura-next`; CI deliberately generates one before `npm ci`, and Next itself is pinned, but a committed lockfile would improve total dependency reproducibility.
- Catalog values are still the current project catalog/seed until the final production merchandising source is approved.

## Non-interference / promotion rules
- Do not merge this branch wholesale into production.
- Do not overwrite homepage/motion/design work from other chats.
- Review overlapping frontend files in `integration-staging`.
- Commerce-core remains source of truth for final price, inventory, shipping and payment.
- Production branch `cloudflare-site` was not modified by this workstream.
- No production deploy was performed from this branch.
