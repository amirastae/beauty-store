# Commerce service staging snapshot

Source branch: `commerce-core-v1`
Source commit: `a2a752eb4df43d04310505efb36db19346b635de`

This snapshot supports the single FATIKHAN Golestan-style canonical site.

Verified latest capabilities:
- reservation-first inventory and abandoned-order cleanup
- Iranian phone + IRR shipping checkout
- disabled-by-default Zarinpal provider adapter
- opaque non-PII order/payment receipt-status lookup
- no-store response policy
- optional Cloudflare Rate Limiting binding for receipt lookup
- real Cloudflare temporary Worker + D1 integration: PASS
- TypeScript + Wrangler preview dry-run with D1/R2/rate-limit bindings: PASS

Production still requires authenticated account D1/R2/payment credentials before mutation checkout is enabled.
