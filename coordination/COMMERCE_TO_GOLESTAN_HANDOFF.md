# Commerce -> FATIKHAN Golestan Handoff

> Read first: `coordination/00_READ_FIRST_FATIKHAN_GOLESTAN.md`

This document transfers the commerce/backend work into the FATIKHAN Golestan-style canonical site. The backend is a supporting layer for that one site, not a separate storefront.

## Current source checkpoint

- Commerce branch: `commerce-core-v1`
- Current head: `a2a752eb4df43d04310505efb36db19346b635de`
- Integration branch: `integration-staging`
- Production branch: `cloudflare-site`
- Visible brand: **FATIKHAN**
- Support email: `fatmhkhan121@gmail.com`

## Backend capabilities already implemented

- D1 catalog/cart/order/payment schema.
- Full VELOURA/FATIKHAN compatibility catalog mapping.
- IRR + USD currency isolation.
- Iranian phone-compatible checkout contract.
- Currency-aware shipping configuration.
- Idempotent checkout.
- Reservation-first inventory flow.
- Abandoned-order reservation cleanup scheduling.
- Zarinpal adapter wired but disabled unless real merchant/runtime credentials exist.
- Payment callbacks verify with the provider before accepting success.
- Payment-return query parameters are presentation state only; they are never proof of payment.
- Checkout now receives a server-issued opaque receipt token and re-fetches minimal authoritative order/payment status after provider return.

## Mandatory integration direction

All future frontend commerce work must be integrated into the existing FATIKHAN Golestan cinematic frontend.

Do not:
- create a second checkout visual system;
- replace the six-scene cinematic homepage;
- ship a separate commerce homepage;
- rename internal compatibility IDs just for branding;
- trust client price, stock, payment status or success query strings;
- decrement final stock before verified payment.

Do:
- keep the cinematic layer fast and independent from backend latency;
- let DOM/UI stay responsible for checkout/accessibility/SEO;
- let Commerce API remain source of truth for price, stock, shipping, order and payment;
- preserve mobile, Save-Data and reduced-motion fallbacks;
- use FATIKHAN in all user-visible UI/SEO/schema text;
- integrate only through `integration-staging`.

## Frontend checkout target

The canonical FATIKHAN checkout should use this sequence:

1. Resolve each frontend product/shade through the compatibility endpoint.
2. Create an IRR cart.
3. Add server-resolved variants.
4. Submit Iranian contact/address data to checkout.
5. Receive an order with temporary inventory reservation.
6. Start the configured payment provider.
7. Redirect to the real provider.
8. On return, display only the state returned by the verified backend/provider flow.
9. Successful payment finalizes stock; failed/cancelled/expired payment releases reservations.

## Cinematic performance rule

No checkout/catalog request may block the FATIKHAN cinematic hero from rendering. Network-backed commerce should activate only when the user enters commerce actions, while the homepage keeps its Golestan-style scroll/video pipeline responsive.

## Current remaining production gates

- authenticated production Cloudflare D1 binding;
- authenticated production R2 binding;
- real payment merchant credentials;
- production callback URL and provider verification;
- final browser end-to-end checkout on production-like preview;
- edge rate-limit policy for the public receipt-status endpoint;
- final mobile visual regression after commerce wiring.

These are runtime/provider gates, not reasons to redesign the cinematic storefront.


## Verified receipt-status checkpoint

- Opaque 256-bit receipt tokens are issued with checkout responses.
- Only the SHA-256 receipt hash is used for public lookup.
- `POST /api/v1/orders/status` returns minimal non-PII order/payment state.
- Response uses `Cache-Control: private, no-store`.
- Preview config includes Cloudflare Workers Rate Limiting binding at 60 requests/minute for the lookup route.
- Real Cloudflare temporary Worker + D1 integration test: **PASS**.
- Canonical FATIKHAN checkout re-fetches this authoritative state after payment return and no longer trusts `?payment=success` as proof.
