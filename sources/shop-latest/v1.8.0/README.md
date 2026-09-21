# VELOURA Beauty Store — v1.8.0

فروشگاه فارسی و RTL محصولات زیبایی، ساخته‌شده با Next.js 16، React 19، TypeScript و Tailwind CSS 4.

## وضعیت این نسخه

این snapshot یک storefront استاتیک و Cloudflare-friendly است و شامل موارد زیر است:

- ۵۶ محصول نمونه با نام، ترکیبات و روش مصرف فارسی
- دسته‌بندی آرایش، مراقبت پوست، مو، عطر، سلامت و ست‌ها
- جست‌وجوی فارسی و انگلیسی
- سبد خرید و علاقه‌مندی پایدار با localStorage
- checkout چندمرحله‌ای
- Product Detail یکپارچه
- Hero سه‌بعدی Three.js با fallback دستگاه ضعیف و reduced-motion
- SEO metadata، robots.txt و sitemap.xml
- صفحات ارسال، مرجوعی، حریم خصوصی و شرایط استفاده
- RTL و responsive mobile/desktop
- ESLint و TypeScript quality gates

## توسعه

```bash
npm install
npm run dev
```

Quality gates:

```bash
npm run quality
```

این دستور به‌ترتیب ESLint، TypeScript، source audit، production build و static-output audit را اجرا می‌کند. خروجی static در مسیر `out/` ساخته می‌شود.

## Cloudflare Workers Static Assets

پروژه دارای `wrangler.toml` مستقل است و خروجی `out/` را به‌عنوان Static Assets منتشر می‌کند:

```bash
npm run quality
npm run deploy:cloudflare
```

تنظیمات deployment:
- `not_found_handling = "404-page"`
- `html_handling = "auto-trailing-slash"`
- security headers از `public/_headers`
- cache بلندمدت فقط برای assetهای fingerprinted داخل `/_next/static/*`

برای تست config بدون انتشار:

```bash
npx wrangler deploy --dry-run
```

## نکات production

کاتالوگ فعلی داده نمونه‌ی فروشگاهی است. قبل از فروش واقعی، اطلاعات محصول، موجودی، قیمت، آدرس و راه‌های تماس، روش پرداخت، هزینه ارسال و سیاست‌های حقوقی باید با داده واقعی کسب‌وکار جایگزین شوند.

checkout فعلی UI فروشگاهی است و پرداخت بانکی/درگاه واقعی در این snapshot متصل نشده است.

## License / Attribution

این پروژه شامل بخش‌هایی است که بر پایه پروژه متن‌باز **REHHA** از **Sujan Das** توسعه یافته‌اند. مخزن اصلی REHHA در GitHub با مجوز MIT منتشر شده است.

MIT copyright notice اصلی در فایل `LICENSE` بدون حذف نگه‌داری شده است. تغییرات اختصاصی VELOURA روی همان پایه توسعه یافته‌اند.

Three.js و سایر dependencyها تابع مجوزهای خودشان هستند.


## Self-auditing quality gate

نسخه 1.8 علاوه بر lint/typecheck/build، دو audit داخلی دارد:

```bash
npm run audit:source
npm run audit:static
```

`audit:source` کد اجرایی را برای credential patternهای رایج، donor-brand residue، لینک `#`، TODO/FIXME و قیمت دلاری بررسی می‌کند.

`audit:static` خروجی build را برای لینک داخلی شکسته، asset مفقود، alt تصویر، نام دسترس‌پذیر button، skip-link، canonical، robots، sitemap، security headers و social-proof ساختگی بررسی می‌کند.

صفحه 404 برندشده و `manifest.webmanifest` نیز در این نسخه اضافه شده‌اند.
