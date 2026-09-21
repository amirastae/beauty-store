# Commerce service staging snapshot

Source branch: `commerce-core-v1`
Source commit: `d44ece0c5ead0fa1717ff9f831ad9407faa4f66e`

Latest status:
- checkout claim migration present
- contact/mobile + currency-aware shipping contract present
- Zarinpal provider adapter + callback verification present
- D1 real Cloudflare temporary preview checkout integration: PASS
- full temporary R2 preview: blocked by temporary-account R2 provisioning/auth limitation
- production R2 still requires authenticated account token/binding

Do not deploy this snapshot directly to production until account-side D1/R2/payment secrets are bound.
