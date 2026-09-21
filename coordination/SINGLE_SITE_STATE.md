# SINGLE SITE STATE — FATIKHAN Golestan

این پروژه فقط یک سایت اصلی دارد.

- Frontend: `integration-staging/sources/canonical/veloura-next`
- Final mirror: `integration-staging/sources/final/veloura-next`
- Generated public: `integration-staging/public/**`
- Commerce backend: `integration-staging/services/commerce`
- Production: `cloudflare-site`

## Parallel chats
تمام branchهای دیگر donor/work lane هستند، نه سایت جدا.
قبل از هر patch، head زنده‌ی `integration-staging` را دوباره از GitHub بخوان.
بعد `coordination/DONOR_RECONCILIATION.md` را بخوان و فقط قابلیت گمشده را منتقل کن.

## Already reconciled
- checkout privacy/session-only delivery draft
- Persian search normalization + accessibility states
- SEO canonical/noindex integrity
- cinematic scroll/compositing hotfixes
- support/contact/recovery hardening
- commerce cart/order/inventory/payment lifecycle
- authoritative payment-return verification
- PWA/runtime release guards

## Done
کار فقط وقتی Done است که روی canonical یا commerce اصلی ادغام شده، تست شده، final با canonical همگام شده و public از canonical build شده باشد.
