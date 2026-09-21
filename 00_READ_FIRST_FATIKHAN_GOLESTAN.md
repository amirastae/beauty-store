# READ FIRST — FATIKHAN / Golestan

این مخزن فقط **یک سایت اصلی** دارد: FATIKHAN با معماری/حس گلستانی.

قبل از هر تغییر، حتماً این ترتیب را بخوان:
1. `coordination/00_READ_FIRST_FATIKHAN_GOLESTAN.md`
2. `coordination/ACTIVE_WORKSTREAMS.md`
3. handoff مربوط به حوزه‌ای که می‌خواهی تغییر بدهی.

## Source of truth
- Frontend اصلی: `sources/canonical/veloura-next`
- Backend اصلی سایت: `services/commerce`
- خروجی build: `public/**`
- محل ادغام همه چت‌ها: `integration-staging`
- Production: `cloudflare-site`

## قانون کار موازی
- قبل از ویرایش فایل مشترک، آخرین head از `integration-staging` را دوباره بخوان.
- branchهای دیگر فقط workstream/donor هستند؛ storefront دوم نساز.
- تغییر branch دیگر را wholesale روی canonical نریز.
- اگر قابلیت قبلاً در canonical وجود دارد، دوباره نساز؛ فقط همان را تکمیل/دیباگ کن.
- `public/**` را دستی به‌عنوان source ویرایش نکن؛ از canonical build کن.
- Hero/scroll/video گلستانی یک dependency مشترک است؛ Backend/Shop/SEO نباید آن را جایگزین کند.
- اسم نمایشی فقط **FATIKHAN** است. نام‌های فنی veloura تا migration مستقل، داخلی می‌مانند.

وضعیت فعال و مالکیت کارها: `coordination/ACTIVE_WORKSTREAMS.md`
