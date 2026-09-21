# Canonical Runtime Release Guard v1

> Read first: `coordination/00_READ_FIRST_FATIKHAN_GOLESTAN.md`

Branch: `canonical-runtime-release-guard-v1`  
Target: `integration-staging`

## Scope

Runtime/release reliability for the single canonical FATIKHAN Golestan storefront.

## Changes

### Reproducible CI
- canonical frontend CI now uses `npm ci --ignore-scripts`;
- commerce verification uses locked `npm ci --ignore-scripts`;
- canonical staging build uses locked `npm ci --ignore-scripts`.

### Cloudflare readiness
- canonical `quality` now includes:
  - TypeScript;
  - source audit;
  - cinematic verification;
  - production static build;
  - static output audit;
  - `wrangler deploy --dry-run`.
- staging public sync now runs full `npm run quality` before replacing/committing generated `public/**`.

This closes the race where generated public could have been synced before a later quality/dry-run failure.

### PWA update integrity
- service-worker cache key advances to `veloura-v2.6.0`;
- offline core cache includes FATIKHAN cinematic poster and maskable icon;
- service worker registers with `updateViaCache: "none"`;
- `/sw.js` is served no-cache/no-store;
- manifest is forced to revalidate;
- static audit verifies:
  - manifest FATIKHAN identity/start URL/display;
  - manifest icon existence;
  - current service-worker cache version;
  - offline route and cinematic poster core caching;
  - PWA revalidation headers.

### Production deploy verification
Future production deploys verify:
- manifest, service worker, headers, robots and sitemap exist;
- offline route serves;
- cinematic MP4/WebM remain live;
- manifest identifies FATIKHAN;
- service worker contains current cache version;
- service worker and manifest return no-cache headers.

## Not changed
- cinematic hero/timeline/media;
- catalog/product UX;
- checkout/commerce behavior;
- payment provider logic;
- D1/R2 schema;
- production branch contents directly.

## Acceptance
PR must pass canonical quality, static smoke, commerce integration and payment lifecycle regression before merge. Generated public must only sync after full canonical quality succeeds.
