> **READ FIRST:** `coordination/00_READ_FIRST_FATIKHAN_GOLESTAN.md`
> FATIKHAN + Golestan cinematic canonical is the project North Star. All workstreams must optimize for it; no parallel homepage/design system.

# Integration Staging Manifest

This is the only pre-production assembly area for the single FATIKHAN site.

## Current inputs

- Canonical feature source: `veloura-v2.5-routine` under `sources/canonical/veloura-next`.
- Iran commerce hardening reference: latest verified `iranian-commerce-ux-v1` snapshot under `sources/iranian-ux/veloura-next`; port behavior/safety selectively into canonical without replacing the Golestan cinematic homepage.
- Latest shop workstream snapshot: `shop-v1.9.0-work` under `sources/shop-latest`.
- Transaction source of truth: latest `commerce-core-v1` under `services/commerce`.

## Integration rule

Do not merge generated outputs from the workstreams. Build one canonical source, selectively port Iran-commerce validation/security/trust changes, then generate `public/**` atomically.

Checkout mutation may be enabled only after the canonical frontend uses the verified commerce API contract. Payment must remain pending until a real provider confirms it.
