# VELOURA Next — v2.2.0

Premium Persian RTL cosmetics storefront for fast static delivery on Cloudflare.

## v2.2 highlights
- 56 local beauty products and 56 static PDP routes
- local editorial + UGC media; no Unsplash runtime dependency
- richer PDP: benefits, localized usage guidance, ingredients, breadcrumbs and related products
- product JSON-LD + BreadcrumbList schema
- ingredient-aware catalog search
- dedicated /search route
- URL-backed category, budget, rating and shade filters
- persistent wishlist, cart quantity controls and mobile commerce dock
- checkout draft persistence on-device with no fake payment state
- global premium footer
- About + FAQ routes
- adaptive R3F hero + GSAP signature product film + Shade Lab
- reduced-motion / Save-Data / weak-device fallbacks
- branded static 404

## Verification baseline
Before production release:
- TypeScript must pass
- Next.js production build must pass
- all static routes must generate
- Cloudflare temporary preview must pass HTTP smoke
- all sitemap URLs and local media must return 200
- branded 404 must return 404 with custom content

## Release discipline
Stable releases are copied under `/versions/` before the next development cycle.
Do not edit archived version folders in place.
