# Real Cloudflare temporary preview verification

Verified on 2026-09-21 using Wrangler 4.135.0 temporary account support.

## Runtime

- Worker: `veloura-commerce-temp`
- Real Cloudflare Workers runtime: PASS
- Worker startup: 3 ms
- D1 auto-provisioning: PASS
- D1 binding: PASS
- R2 intentionally omitted from the temporary config
- `AUTO_BOOTSTRAP=0` after migration-policy hardening

## Database

Remote D1 migrations 0001-0007 were applied successfully and seed data was loaded.

## Real-network checks

- health endpoint: PASS
- catalog endpoint: PASS
- VELOURA v2 compatibility: PASS
- Shop v1 compatibility: PASS
- USD cart: PASS
- IRR cart: PASS
- currency mismatch rejection: PASS
- checkout: PASS
- idempotent replay: PASS
- idempotency payload-reuse rejection: PASS
- inventory decrement: PASS
- admin-disabled safety gate: PASS
- media-unbound safety gate: PASS
- search: PASS

## Defect found during real-network testing

Two simultaneous checkouts of one cart using different idempotency keys could both create orders.

Fix: migration `0007_checkout_claims.sql` plus atomic per-cart checkout claim in the checkout route.

The claim is retained after successful checkout, preventing a stale concurrent request from completing after the first order commits. Failed checkout paths release the claim for retry.

## Remaining permanent-account gate

Temporary preview proves D1 + Worker behavior on Cloudflare infrastructure. Permanent preview still requires account authentication so R2 and long-lived resources can be bound and verified.
