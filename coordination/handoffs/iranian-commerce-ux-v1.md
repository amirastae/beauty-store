# Handoff — Iranian Commerce UX v1

- Source branch: `iranian-commerce-ux-v1`
- Tested code commit: `89cd3662add4ec936a8d12255af05d04b3a3a376`
- Verification run: `35564644984`
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
- Payment return UI safely handles backend callback redirects for `success`, `failed`, and `cancelled`, including sanitized order-number display; it does not itself mutate payment/order state.

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
- Control labels/state are explicit for wishlist, compare, add-to-cart and visual shade swatches.
- Compare/wishlist controls expose `aria-pressed` and accessible action names without visual changes.
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

GitHub Actions verification on tested code commit `89cd3662add4ec936a8d12255af05d04b3a3a376`:
- `npm ci`: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS
- `npm run seo:check`: PASS — 56 checks / 4 product pages
- `npm run links:check`: PASS — 77 internal links / 15 pages
- `npm run catalog:check`: PASS — 4 products / 4 unique canonicals
- `npm run a11y:check`: PASS — 13 pages / 20 images / 77 buttons
- `npm run security:check`: PASS
- `npm run performance:check`: PASS — baseline guard for total output, JS, largest JS chunk, CSS and HTML page size
- `npm run mutation-safety:check`: PASS — frontend cannot call cart/order/payment mutation endpoints while blocker #42 remains open

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

### Current backend readiness and blocker before mutating checkout is enabled
Rechecked parallel backend branch:
- `commerce-core-v1@f5a748a6eea499b531668f0e5146327fd07fec20`

Resolved since the earlier handoff:
- Shipping policy is now currency-aware and reads per-currency flat/free-threshold configuration.
- Checkout now accepts email **or** phone, so the Iran mobile-first frontend contract is compatible.
- A Zarinpal start + callback + verify adapter exists in code.

Still required before frontend mutation checkout is enabled:
1. **Inventory/payment invariant — BLOCKER:** checkout currently decrements stock before payment is verified, while cancelled/failed payment callbacks do not restore that stock. Coordination issue: https://github.com/amirastae/beauty-store/issues/42
2. Runtime shipping variables must actually be configured for IRR in the deployed commerce worker; repo config does not prove runtime values.
3. Runtime payment provider configuration must be verified (`PAYMENT_PROVIDER`, merchant secret, callback base and storefront base). Secrets/runtime bindings are intentionally not inspected or modified by this frontend workstream.
4. Add regression coverage for paid, cancelled, failed, duplicate callback and unpaid-expiry inventory behavior.

Therefore:
- keep frontend checkout mutation disabled;
- retain current read-only server price/inventory verification;
- enable order/payment mutation only after #42 is fixed and runtime provider/config verification passes;
- integrate through the designated staging process, not direct production.

## Remaining non-blocking caveats
- Product imagery still comes from `images.unsplash.com`; for maximum Iran resilience/performance, local/R2-owned product media should replace runtime third-party image dependency in the asset workstream.
- `veloura-next/package-lock.json` is now committed (lockfile v3), and CI runs `npm ci` directly from the committed dependency graph.
- Catalog values are still the current project catalog/seed until the final production merchandising source is approved.

## Non-interference / promotion rules
- Do not merge this branch wholesale into production.
- Do not overwrite homepage/motion/design work from other chats.
- Review overlapping frontend files in `integration-staging`.
- Commerce-core remains source of truth for final price, inventory, shipping and payment.
- Production branch `cloudflare-site` was not modified by this workstream.
- No production deploy was performed from this branch.
