# Handoff — Iranian Commerce UX v1

- Source branch: `iranian-commerce-ux-v1`
- Tested source commit: `d08b8aeaf95df3846c46ecc127923cb4d62f0e82`
- Base workstream: `beauty-v2-foundation@0e1c78f1dfd1a4822a74cced49cc8130b85e4b1f`
- Scope: commerce UX only; homepage motion/editorial untouched.

## Applied
- Central Persian number/Toman formatting and Iranian mobile/postal validation.
- Persian shop refinement with sale-only filter, discount sorting and compare-at pricing.
- Product-page discount display and commerce readiness rail.
- Iranian checkout fields: mobile, province, city, 10-digit postal code, full address and order note.
- No fake payment success: checkout stops before the real gateway boundary.
- Cart and wishlist aligned with the same pricing/locale layer.
- Responsive commerce-specific styles isolated in `iranian-commerce.css`.

## Changed paths
- `.github/workflows/iranian-commerce-ux-verify.yml`
- `veloura-next/src/app/iranian-commerce.css`
- `veloura-next/src/app/layout.tsx`
- `veloura-next/src/components/cart/CartPage.tsx`
- `veloura-next/src/components/checkout/CheckoutShell.tsx`
- `veloura-next/src/components/commerce/IranianTrustRail.tsx`
- `veloura-next/src/components/product/ProductDetail.tsx`
- `veloura-next/src/components/shop/ShopCatalog.tsx`
- `veloura-next/src/components/wishlist/WishlistPage.tsx`
- `veloura-next/src/lib/locale.ts`

## Verification
GitHub Actions run `35554939051` on the exact tested commit:
- npm install lock preparation: PASS
- npm ci: PASS
- npm run typecheck: PASS
- npm run build: PASS

## Integration constraints
- Do not merge wholesale into production.
- Review overlap with foundation/UI workstreams first.
- Commerce-core remains source of truth for inventory, final price, shipping and payment.
- Real payment gateway and shipping provider are intentionally not faked in this branch.
- Promote only through `integration-staging` after overlap review and preview verification.
