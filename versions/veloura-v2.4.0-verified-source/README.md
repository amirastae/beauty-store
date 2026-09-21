# VELOURA Next — v2.4.0

Premium Persian RTL cosmetics storefront for fast static delivery on Cloudflare.

## v2.4 highlights
- persistent recently viewed history on-device
- dedicated /recent route
- product page auto-tracking for recent views
- product sharing through Web Share API with clipboard fallback
- global compare tray so selected products are never lost in navigation
- existing three-product comparison retained
- PWA cache version bumped to v2.4.0
- all v2.3 capabilities retained: installable PWA, offline fallback, local media, advanced search/filters, rich PDP, wishlist/cart, checkout draft and accessibility fallbacks

## Release verification gate
Before production release:
- TypeScript PASS
- Next production build PASS
- static export PASS
- temporary Cloudflare preview PASS
- recent / compare / share / manifest / service worker / offline routes PASS
- all sitemap URLs and local media HTTP 200
- branded 404 PASS

## Release discipline
Stable releases are copied under `/versions/` before the next development cycle.
Do not edit archived version folders in place.
