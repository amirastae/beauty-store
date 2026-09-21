# Canonical SEO Integrity v1

> Read first: `coordination/00_READ_FIRST_FATIKHAN_GOLESTAN.md`

Branch: `canonical-seo-integrity-v1`  
Target: `integration-staging`

## Scope

Narrow SEO integrity patch for the single canonical FATIKHAN Golestan storefront.

## Changes

- remove the global root canonical `/` so child routes do not inherit a homepage canonical;
- define homepage canonical `/` explicitly;
- define shop canonical `/shop/` explicitly;
- provide complete route-specific Open Graph metadata for Home and Shop;
- mark stateful/non-indexable routes:
  - `/cart/`
  - `/wishlist/`
  - `/offline/`
  as `noindex` (checkout/search/compare/recent were already protected);
- extend static audit to enforce:
  - exact Home canonical pathname;
  - exact Shop canonical pathname;
  - noindex on all stateful routes.

## Not changed

- cinematic hero/media/timeline;
- catalog/product schema;
- commerce/payment logic;
- generated `public/**` by hand.

## Acceptance

Canonical `npm run quality`, commerce integration/payment lifecycle regression, and generated-public sync must all pass before merge.
