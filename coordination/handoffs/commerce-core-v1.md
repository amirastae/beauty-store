# Commerce core handoff

Source branch: `commerce-core-v1`
Current commit: `3dbd71ed196ac61ed62062a7105d33b013706fb6`
Role: backend/API/D1/R2/cart/checkout integration layer.

## Current compatibility coverage

### VELOURA v2.1 UI
- namespace: `veloura-v2.1`
- frontend currency: toman
- backend currency: IRR
- 12 stable external references
- shade-aware mapping supported

### Shop v1.1 catalog
- namespace: `shop-v1.1.0`
- frontend/backend currency: USD
- 56 source products
- 112 product + variant references
- exact JSON catalog snapshot mapped without editing the shop branch

## Backend verified state
- 68 products
- 72 variants
- 8 IRR variants
- 64 USD variants
- migrations 0001-0005 apply cleanly in SQLite
- TypeScript typecheck PASS
- foreign-key verification PASS

## Stable integration rules
1. Frontend workstreams keep their existing UI/cart state for UX.
2. At checkout, resolve frontend IDs through compatibility endpoints.
3. Create cart with the correct currency.
4. Server recalculates line prices.
5. Mixed-currency lines are rejected.
6. Payment remains pending until a real provider confirms it.

## Integration endpoints
- `POST /api/v1/compat/veloura-v2/resolve`
- `POST /api/v1/compat/shop-v1/resolve`
- `POST /api/v1/carts`
- `POST /api/v1/carts/:id/items`
- `POST /api/v1/checkout/:cartId`

## Integration gate
Do not merge this branch wholesale into production. First wire it into `integration-staging`, attach Cloudflare D1/R2, run full preview tests, then promote.
