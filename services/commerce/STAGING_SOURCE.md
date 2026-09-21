# Commerce service staging snapshot

Source branch: `commerce-core-v1`
Source commit: `de18de948e4459f7495f2a3146ec18937ddc81e4`

Current verified state:
- migrations 0001-0007
- full VELOURA v2.1 compatibility
- Shop v1.1 compatibility
- currency-safe carts
- idempotent checkout
- per-cart checkout claim against duplicate concurrent orders
- real Cloudflare temporary Worker + D1 verification completed
- runtime DB bootstrap disabled in deployed configs

Permanent Cloudflare account authentication is still required for long-lived D1/R2 preview resources.
