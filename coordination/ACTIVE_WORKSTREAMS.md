# ACTIVE WORKSTREAMS — one FATIKHAN site

## هدف مشترک
همه چت‌ها روی **همان سایت اصلی FATIKHAN Golestan-style** کار می‌کنند. هیچ branchی محصول جدا نیست.

| حوزه | منبع/branch | وضعیت |
|---|---|---|
| Canonical site | `integration-staging/sources/canonical/veloura-next` | **تنها frontend source of truth** |
| Final source mirror | `integration-staging/sources/final/veloura-next` | باید دقیقاً mirror canonical باشد |
| Generated site | `integration-staging/public/**` | فقط build artifact |
| Commerce | `commerce-core-v1` → `services/commerce` | backend همان سایت؛ payment/inventory/order source of truth |
| Iran UX donor | `iranian-commerce-ux-v1` | donor/reference؛ wholesale merge ممنوع |
| v2.5 donor | `veloura-v2.5-routine` | donor/reference؛ قابلیت‌های مفید باید selectively وارد canonical شوند |
| Production | `cloudflare-site` | live baseline؛ feature chat مستقیم ویرایش نکند |

## قفل‌شده / تکرار نکن
- storefront یا homepage دوم.
- Hero سینمایی جایگزین.
- بازسازی Flow/Kling plan از صفر.
- checkout/payment نمایشی یا اعتماد به client price/stock.
- اعتماد به `?payment=success` بدون status معتبر backend.
- ذخیره persistent PII فرم checkout.
- merge کامل donor branch.
- patch دستی generated `public/**`.

## قبل از هر patch
1. آخرین `integration-staging` را بخوان.
2. فایل هدف canonical را با branch donor مقایسه کن.
3. فقط capability گمشده را انتقال بده.
4. canonical برنده‌ی conflict است.
5. تست scope + quality gates.
6. final/public را فقط از canonical sync/build کن.
7. handoff را همان لحظه به‌روز کن تا چت بعدی کار را تکرار نکند.

## معماری نمایشی قفل‌شده
`Descent → Reveal → Burst → Impact → Formula → Ritual`

Commerce/SEO/Search نباید render اولیه Hero را block کند.

## وضعیت backend
- #42: بسته؛ payment/inventory lifecycle regression PASS.
- #45: بسته؛ opaque authoritative receipt/status lookup + no-store + rate limiting PASS.
- رزرو موجودی تا payment verify حفظ می‌شود.
- موفقیت URL به‌تنهایی proof پرداخت نیست.

## تعریف Done
Done یعنی قابلیت روی **همین canonical سایت** ادغام شده، build/test شده و handoff دارد. branch جانبیِ سالم به‌تنهایی Done نیست.

## Donor reconciliation
Before starting overlapping work, read `coordination/DONOR_RECONCILIATION.md`.
It records which parallel-chat patches are already integrated so they are not rebuilt or merged wholesale.
