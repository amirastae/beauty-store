# Commerce core handoff

Source branch: `commerce-core-v1`
Current commit: `a3b6587763466f1f171738d70d3b4fa011cac4f0`
Role: backend commerce core

## Scope
Edge-first commerce backend: D1 schema/migrations, inventory, cart, checkout idempotency, admin, media, search, compatibility adapter for the current VELOURA v2 frontend.

## Owned paths
- `platform/**`
- root preview deployment configuration on this branch only

## Frontend compatibility
The backend maps current `veloura-v2.1-polish` product/shade identifiers through:
`POST /api/v1/compat/veloura-v2/resolve`

Frontend branches should consume the adapter/SDK instead of hard-coding backend variant IDs.

## Verification completed
- TypeScript PASS
- migrations 0001-0004 PASS in SQLite verification
- foreign key check PASS
- compatibility references PASS

## Do not merge yet
The backend needs a real Cloudflare preview with D1/R2 bindings before promotion into integration-staging.
