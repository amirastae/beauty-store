# Commerce service staging snapshot

Source branch: `commerce-core-v1`
Source commit: `cf9edc4060c4cfa5db51c725735067eca5e95268`

Current compatibility coverage:
- full VELOURA v2.1 production catalog: 56 products, shade-aware
- shop-v1.1.0 catalog: 56 products
- legacy VELOURA compatibility preserved
- currency-safe USD/IRR cart boundaries

Verified locally:
- TypeScript PASS
- migrations 0001-0006 PASS
- foreign-key check PASS
- 120 products / 129 variants in aggregate compatibility database
- VELOURA v2.1 refs: 133
- Shop v1.1 refs: 112
- Wrangler API preview dry-run PASS

Local workerd startup remains an environment-level blocker on this server; do not treat it as an application regression.
