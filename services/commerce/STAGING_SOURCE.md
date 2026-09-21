# Commerce service staging snapshot

Source branch: `commerce-core-v1`
Source commit: `829bfe37e104e5298ef3d581f0296cf53dba3cc4`

Latest production-readiness changes:
- monotonic database-backed order number sequence;
- successful checkout claims are removed after idempotent response persistence;
- expired opaque order receipts are cleaned during scheduled maintenance;
- reservation-first payment lifecycle remains unchanged;
- authoritative receipt-based payment status remains no-store and rate-limited.

Verification before staging sync:
- TypeScript PASS
- 11 migrations apply cleanly
- SQLite foreign-key check PASS
- order sequence returned 100000000 then 100000001

FATIKHAN/Golestan remains the only canonical storefront. This service is backend support only.
