# FATIKHAN Brand Handoff

- Source branch: `brand-fatikan-20260921`
- Base: `integration-staging`
- Scope: user-visible storefront branding + metadata/PWA/product brand fields
- Production branch: untouched directly

## Renamed

- `VELOURA` -> `FATIKHAN`
- Persian visible brand mentions `ولورا` -> `FATIKHAN`

Covered:
- homepage/nav/footer
- cinematic hero
- 3D product label
- shop/product/cart/checkout/search/wishlist/compare/recent/routine pages
- About/FAQ/404/offline
- metadata/OpenGraph/product share titles
- PWA manifest
- product `brand` and image alt text
- Shade Lab visible product mark
- canonical README heading

## Intentionally preserved internal identifiers

The following are NOT user-facing brand text and were kept to avoid state/data/deployment regressions:
- source directory `veloura-next`
- package/internal project identifiers
- local-storage key `veloura-checkout-draft-v2`
- product internal id prefix `veloura-`
- deployment/worker/internal config names

No backend schema, catalog key, payment, D1/R2, or checkout contract was changed.

## Verification

Merge only through `integration-staging`; run the existing canonical frontend typecheck/build and staging smoke workflows after merge.
