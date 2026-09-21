# VELOURA Next — v2.3.0

Premium Persian RTL cosmetics storefront for fast static delivery on Cloudflare.

## v2.3 highlights
- persistent three-product comparison flow
- compare page for price, rating, shades, ingredients, benefits and usage
- compare controls on catalog cards and PDP
- installable PWA manifest + custom Veloura icons
- lightweight bounded service worker with versioned cache cleanup
- offline fallback page
- global skip navigation and stronger focus-visible states
- all v2.2 capabilities retained: 56 local products, advanced filters, dedicated search, rich PDP, local media, About/FAQ, cart/wishlist and checkout draft

## Release verification gate
Before production release:
- TypeScript PASS
- Next production build PASS
- static export PASS
- temporary Cloudflare preview PASS
- compare / manifest / service worker / offline routes PASS
- all sitemap URLs and local media HTTP 200
- branded 404 PASS
- no remote Unsplash dependency

## Release discipline
Stable releases are copied under `/versions/` before the next development cycle.
Do not edit archived version folders in place.
