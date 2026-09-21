# Commerce service staging snapshot

Source branch: `commerce-core-v1`
Source commit: `ffccdebd769b5a77ac32800b1f2e09952ae3e6e7`

Verified gates:
- TypeScript: PASS
- Wrangler preview dry-run: PASS
- D1 real temporary Cloudflare checkout flow: PASS
- inventory is reserved at checkout, finalized only after verified payment
- unpaid orders expire after 30 minutes
- scheduled cleanup configured every 5 minutes
- migrations 0001-0009 present

External production gates still required:
- authenticated Cloudflare production D1/R2 bindings
- real Zarinpal merchant credential
- storefront build must receive NEXT_PUBLIC_COMMERCE_API_BASE
