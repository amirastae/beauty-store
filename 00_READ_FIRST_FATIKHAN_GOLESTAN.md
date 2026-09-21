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

## وضعیت زنده
SHAها را از پیام‌های قدیمی کپی نکن. درست قبل از هر write، head زنده‌ی `integration-staging`، branch donor و فایل هدف را از GitHub دوباره بخوان.

## جلوگیری از کار تکراری
قبل از شروع هر قابلیت، `coordination/DONOR_RECONCILIATION.md` و `coordination/SINGLE_SITE_STATE.md` را بخوان. اگر قابلیت قبلاً روی canonical آمده، دوباره ساخته نشود.

آخرین قاعده: **هر کاری که انجام می‌شود باید همین سایت اصلی را بهتر کند؛ اگر خروجی فقط روی branch جانبی بماند، کار تمام‌شده محسوب نمی‌شود.**
