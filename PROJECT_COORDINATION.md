# Beauty Store Project Coordination

This file is the coordination source of truth for all parallel ChatGPT workstreams touching the same VELOURA website.

## Branch roles

- `cloudflare-site` — PRODUCTION DEPLOY SOURCE. Do not use as a work branch.
- `integration-staging` — ONLY integration target before production. New cross-workstream merges land here first.
- `beauty-v2-foundation` — foundation/design-system/storefront structure workstream.
- `veloura-v2.1-polish` — UI polish, motion, 404, visual refinement workstream.
- `shop-v1.1.0-work` — shop/catalog/assets snapshot workstream. Do not merge wholesale without review.
- `commerce-core-v1` — backend/API/D1/R2/cart/checkout workstream.
- `commerce-infrastructure-lab` — architecture/reference lab only. Never deploy.
- `main` — archive + coordination/control plane. Not a deployment branch.

## Mandatory workflow

1. Each chat edits ONLY its assigned branch.
2. Never force-push or rewrite another workstream branch.
3. Never deploy directly from a work branch.
4. Before integration, create/update a handoff note containing:
   - exact source branch + commit SHA
   - changed paths
   - required env/bindings
   - tests run
   - known risks
   - files likely to conflict
5. Merge/cherry-pick into `integration-staging` only after overlap review.
6. Verify staging:
   - build/typecheck
   - route smoke tests
   - mobile UI
   - cart/search/checkout
   - Cloudflare preview HTTP 200
7. Promote the verified staging commit to `cloudflare-site`.
8. Archive a production snapshot on `main` after promotion.

## Current pinned heads

- cloudflare-site: `4683bc2fdbfda6e7ded412941eab86283c45c708`
- integration-staging: created from the production commit above
- beauty-v2-foundation: `0e1c78f1dfd1a4822a74cced49cc8130b85e4b1f`
- veloura-v2.1-polish: `da691bebfd9de28094b96dac40fe73710254c2f0`
- shop-v1.1.0-work: `12dd4e0624dfb437bf2e405b8e6d6eb3594fab3d`
- commerce-core-v1: `a3b6587763466f1f171738d70d3b4fa011cac4f0`
- commerce-infrastructure-lab: `6878025abbf770a8e1deb47b3542615d8bcf814d`

## Ownership map

### Frontend foundation
Owned paths should stay inside the foundation source tree. Avoid backend files under `platform/`.

### UI polish
May modify presentation, CSS, animation, accessibility and route presentation. Avoid catalog/database/API schema changes.

### Shop/catalog work
Owns product-rich frontend/catalog assets and storefront UX experiments. Do not overwrite production output or backend schema directly.

### Commerce core
Owns:
- `platform/**`
- API contracts
- D1 migrations
- R2 bindings
- cart/checkout/inventory/admin APIs
- compatibility adapters

It must not modify the active UI branches.

### Infrastructure lab
Reference-only. No production merge unless a specific small component is intentionally extracted and license-reviewed.

## Conflict rule

If two workstreams touch the same logical feature, the newer UI must consume a stable interface instead of duplicating business logic. Example: frontend cart state may remain local for UX, but final price, inventory and checkout truth come from the commerce API.

## Promotion rule

The production branch is never the place to discover conflicts. Conflicts are resolved on `integration-staging`, verified there, then promoted as one known-good commit.
