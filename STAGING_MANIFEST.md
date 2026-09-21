# Integration Staging Manifest

This branch is the only pre-production assembly area for the VELOURA site.

## Active layers

- Live-shaped static storefront: `public/**`
- Foundation source snapshot: `sources/foundation/veloura-next/**`
- UI polish source snapshot: `sources/polish/veloura-next/**`
- Shop/catalog snapshot: `sources/shop/**`
- Commerce service snapshot: `services/commerce/**`

## Source of truth by concern

- Visual/UI candidate: `sources/polish/veloura-next`
- Baseline comparison: `sources/foundation/veloura-next`
- Catalog compatibility input: `sources/shop`
- Transaction/data source of truth: `services/commerce`
- Deployment output: `public` only after a verified staging build

## Merge policy

Generated Next.js output from multiple branches must never be merged together. Rebuild the selected canonical frontend source and replace `public/**` atomically after verification.

Commerce code remains namespaced until Cloudflare D1/R2 bindings are proven on a preview Worker.
