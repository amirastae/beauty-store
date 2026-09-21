# ACTIVE WORKSTREAMS — one FATIKHAN site

Reconciled after canonical integration commit:
`36535f6e5b342be1ae6a14b708021bb00eb0aa1f`

## هدف مشترک
همه چت‌ها روی **همان سایت اصلی FATIKHAN Golestan-style** کار می‌کنند. هیچ branchی محصول جدا نیست.

## کارهای شناخته‌شده

| حوزه | منبع/branch | وضعیت |
|---|---|---|
| Canonical site | `integration-staging/sources/canonical/veloura-next` | **source of truth** |
| Cinematic scroll hotfix | `fatikan-cinematic-scroll-hotfix-v1@529ddab9983e34148cf0876abc3536f070fdd21e` | بخش مفید throttle + trailing catch-up به canonical منتقل شد؛ WebM→MP4 preference حفظ شد |
| Google Flow / final cinematic media | `fatikan-google-flow-handoff-v1@91efe7ae9c19e3f86b6988d85f6885d8f3a5ed84` | handoff داخل canonical موجود است؛ prompt/transition plan را دوباره نساز |
| Checkout privacy | `canonical-checkout-privacy-v1@fce7bbd73089a30f4ee0fd2045a449235c75771b` | داخل canonical موجود؛ PII draft فقط session-scoped |
| Iran UX hardening | `canonical-iran-ux-hardening-v2@00afdba80bf1e73fac95bb37d1338c4b61459114` | donor/reference؛ روی overlap همیشه canonical جدیدتر برنده است |
| Support/trust | `golestan-support-hardening-v4-20260921@70fee63cedeb80200d1ec6923858f9b5fca08ef1` | contact route + footer support به canonical منتقل شد؛ wholesale merge ممنوع |
| Commerce core | `commerce-core-v1@fb1b5a18ce7c971a21a0fd73623adba82d683519` | در `services/commerce` همگام؛ price/stock/shipping/order/payment source of truth |
| Production | `cloudflare-site@1276b6448e470179523b8c12887ef46f30400668` | live baseline؛ feature chat مستقیم ویرایش نکند |

## کارهای قفل‌شده / تکرار نکن
- ساخت storefront دوم یا homepage جایگزین.
- بازنویسی Hero گلستانی از صفر.
- بازسازی دوباره‌ی Flow prompt/transition plan.
- checkout/payment نمایشی.
- اعتماد به client price/stock یا `?payment=success`.
- ذخیره persistent اطلاعات شخصی checkout.
- merge کامل branchهای donor روی canonical.
- تغییر دستی generated `public/**`.

## قبل از شروع هر کار
1. آخرین `integration-staging` را بخوان.
2. فایل هدف را با branch خودت مقایسه کن.
3. اگر فایل از آخرین مشاهده عوض شده، تغییر جدید را اول بفهم.
4. فقط smallest compatible patch را منتقل کن.
5. تست همان scope + canonical quality gates.
6. handoff را به‌روز کن تا چت بعدی کار را تکرار نکند.

## معماری نمایشی قفل‌شده
`Descent → Reveal → Burst → Impact → Formula → Ritual`

Scroll/video cinematic باید مستقل از latency Commerce بماند. درخواست‌های API فقط هنگام تعامل تجاری فعال شوند، نه برای blocking اولین render Hero.

## آخرین انتقال بین چت‌ها
- scroll hotfix به canonical منتقل شد.
- support/contact به canonical منتقل شد.
- `sources/final/veloura-next` با همان tree canonical همگام شد.
- Commerce receipt verification، reservation-first inventory، payment lifecycle regression و checkout privacy قبلاً در canonical/backend ادغام شده‌اند.
