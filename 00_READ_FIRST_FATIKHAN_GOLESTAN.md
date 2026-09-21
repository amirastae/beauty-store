# READ FIRST — FATIKHAN / Golestan — ONE SITE ONLY

این مخزن فقط **یک سایت اصلی** دارد: **FATIKHAN** با معماری/حس گلستانی.

## قبل از هر کار
هر چت/ورکر باید اول این‌ها را بخواند:
1. `coordination/00_READ_FIRST_FATIKHAN_GOLESTAN.md`
2. `coordination/ACTIVE_WORKSTREAMS.md`
3. handoff همان حوزه

## تنها Source of Truth
- Frontend اصلی: `integration-staging/sources/canonical/veloura-next`
- Backend اصلی همان سایت: `integration-staging/services/commerce`
- خروجی build: `integration-staging/public/**`
- Production: `cloudflare-site`

branchهای دیگر **سایت جدا نیستند**؛ فقط donor/reference/work lane هستند.

## قانون اجباری برای همه چت‌ها
- قبل از تغییر، آخرین head `integration-staging` و فایل هدف را دوباره بخوان.
- اگر قابلیت در canonical هست، دوباره نساز؛ همان را تکمیل/دیباگ کن.
- هیچ branchی را wholesale روی canonical نریز.
- هیچ homepage/storefront دوم نساز.
- `public/**` را دستی به‌عنوان source تغییر نده؛ از canonical build کن.
- Hero/scroll/video گلستانی را حفظ کن؛ Commerce/SEO/Shop زیر آن ادغام می‌شوند.
- برند نمایشی فقط **FATIKHAN** است.
- شناسه‌های فنی `veloura-*` و compat API تا migration مستقل داخلی می‌مانند.
- هر قابلیت نهایی باید در همین canonical سایت ادغام شود، نه اینکه فقط روی branch خودش بماند.

## وضعیت فعلی
- integration-staging: `725624bd540bba6ab1bcca31e7e7e40bd20b8111`
- commerce-core-v1: `fb1b5a18ce7c971a21a0fd73623adba82d683519`
- cloudflare-site: `1276b6448e470179523b8c12887ef46f30400668`

آخرین قاعده: **هر کاری که انجام می‌شود باید همین سایت اصلی را بهتر کند؛ اگر خروجی فقط روی branch جانبی بماند، کار تمام‌شده محسوب نمی‌شود.**
