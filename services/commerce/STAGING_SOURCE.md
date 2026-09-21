# Commerce service staging snapshot

Source branch: `commerce-core-v1`
Source commit: `cecea343cd17ab75e237eb573db3d0533c36efa7`

Verified capabilities include D1 migrations 0001-0007, full VELOURA and Shop compatibility mappings, currency-safe carts, idempotent checkout, per-cart checkout claims, restricted browser CORS origins, and real Cloudflare temporary D1 verification.

Permanent D1/R2 deployment remains gated behind account-authenticated Cloudflare credentials.
