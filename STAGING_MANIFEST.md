# Integration Staging Manifest

This is the only pre-production assembly area for the single VELOURA site.

## Current inputs

- Canonical feature source: `veloura-v2.5-routine` under `sources/canonical/veloura-next`.
- Iran commerce hardening reference: `iranian-commerce-ux-v1` under `sources/iranian-ux/veloura-next`.
- Latest shop workstream snapshot: `shop-v1.9.0-work` under `sources/shop-latest`.
- Transaction source of truth: latest `commerce-core-v1` under `services/commerce`.

## Integration rule

Do not merge generated outputs from the workstreams. Build one canonical source, selectively port Iran-commerce validation/security/trust changes, then generate `public/**` atomically.

Checkout mutation may be enabled only after the canonical frontend uses the verified commerce API contract. Payment must remain pending until a real provider confirms it.
