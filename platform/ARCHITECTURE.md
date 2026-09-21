# VELOURA Commerce Core v1

This branch turns the visual storefront into an edge-first commerce foundation while keeping production isolated.

## Design basis

The architecture was informed by the pinned infrastructure lab, especially:
- Medusa: modular commerce domains and workflow separation.
- Saleor: API-first catalog/order boundaries.
- Vercel Commerce: storefront/backend separation and cache-aware data access.
- Hono: lightweight edge-native routing.
- Cloudflare Workers SDK: Worker-native deployment model.
- Better Auth: isolated authentication boundary.
- Meilisearch: dedicated search/index boundary.
- Payload/Strapi: CMS separated from transaction state.

No third-party application code is copied into this platform scaffold. This is an original implementation shaped by those architecture patterns.

## Runtime

- Storefront: existing static VELOURA frontend.
- API: Cloudflare Workers + Hono.
- Primary transactional DB: Cloudflare D1.
- Product/media blobs: Cloudflare R2.
- Cache / ephemeral data: Cloudflare Cache API or KV where justified.
- Async jobs: Cloudflare Queues.
- Stateful concurrency where required: Durable Objects.
- Search: adapter boundary; Meilisearch-compatible later.
- Authentication: adapter boundary; Better Auth-compatible later.

## Domain boundaries

1. Catalog
   - products
   - variants
   - collections
   - categories
   - pricing
2. Inventory
   - inventory items
   - reservations
   - stock movements
3. Cart
   - carts
   - line items
   - totals
4. Checkout
   - checkout sessions
   - idempotency
   - payment intent lifecycle
5. Orders
   - immutable order snapshot
   - fulfillment state
   - refunds
6. Customer
   - account
   - addresses
   - wishlist
7. Content
   - editorial pages
   - homepage sections
8. Search
   - index projection only; never source of truth

## Core invariants

- D1 is the source of truth for transactional state.
- Search indexes, KV and cache are derived state.
- Money is stored as integer minor units.
- Every checkout mutation supports idempotency.
- Inventory decrements occur through reservation/finalization flows, not direct client writes.
- Order lines store snapshots so future catalog edits do not alter old orders.
- Client requests never choose final prices; pricing is recomputed server-side.
- Admin endpoints are separated from public storefront endpoints.
- No payment secrets are exposed to the storefront.
- Every webhook must be signature-verified and idempotent.
- Production remains on `cloudflare-site` until bindings and tests are complete.

## API shape

Public:
- GET /api/v1/health
- GET /api/v1/products
- GET /api/v1/products/:slug
- GET /api/v1/collections
- POST /api/v1/carts
- GET /api/v1/carts/:id
- POST /api/v1/carts/:id/items
- PATCH /api/v1/carts/:id/items/:itemId
- DELETE /api/v1/carts/:id/items/:itemId
- POST /api/v1/checkout/:cartId

Future authenticated:
- GET /api/v1/me
- GET /api/v1/me/orders
- GET /api/v1/me/wishlist

Admin:
- /api/v1/admin/* behind dedicated authorization middleware.

## Next deployment gate

Do not point Cloudflare production to this branch until:
1. D1 database exists.
2. R2 bucket exists.
3. secrets are configured.
4. migrations pass.
5. catalog/cart regression passes.
6. production Worker remains HTTP 200 after staged preview verification.
