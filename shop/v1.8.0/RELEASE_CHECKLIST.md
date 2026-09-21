# VELOURA v1.8 Release Checklist

این فایل gate انتشار نسخه `shop/v1.8.0` است.

## قبل از merge
- [ ] `npm ci` فقط با lockfile موفق شود.
- [ ] ESLint بدون error/warning بحرانی پاس شود.
- [ ] `tsc --noEmit` پاس شود.
- [ ] `audit:source` پاس شود.
- [ ] `next build` پاس شود.
- [ ] `audit:static` پاس شود.
- [ ] `out/index.html`, `robots.txt`, `sitemap.xml` و `_headers` وجود داشته باشند.
- [ ] هیچ secret، token یا credential داخل snapshot نباشد.
- [ ] checkout/auth نمایشی به‌عنوان backend واقعی معرفی نشوند.
- [ ] اطلاعات تماس، موجودی، قیمت و سیاست‌های production قبل از فروش واقعی جایگزین شوند.

## Cloudflare
- [ ] `wrangler.toml` فقط `out/` را به‌عنوان Static Assets منتشر کند.
- [ ] 404 handling روی `404-page` باشد.
- [ ] trailing slash policy با Next export سازگار باشد.
- [ ] CSP و security headers بعد از deploy واقعی verify شوند.
- [ ] cache immutable فقط برای fingerprinted `/_next/static/*` باشد.

## انتشار
- [ ] deploy ابتدا preview/temporary.
- [ ] smoke test: home, product, cart, wishlist, checkout, support, policies.
- [ ] production فقط بعد از preview PASS.
- [ ] rollback target نسخه قبلی ثبت شود.
