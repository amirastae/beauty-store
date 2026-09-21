# VELOURA Security Notes

## وضعیت storefront
این snapshot یک static storefront است. authentication، payment، order creation و contact submission واقعی هنوز backend متصل ندارند و UI عمداً وانمود به موفقیت نمی‌کند.

## Cloudflare headers
`public/_headers` شامل:
- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- X-Frame-Options
- Permissions-Policy
- Cross-Origin-Opener-Policy

## داده کاربر
- cart و wishlist در localStorage نگه‌داری می‌شوند.
- اطلاعات کارت بانکی نباید در frontend یا localStorage ذخیره شوند.
- اطلاعات checkout فقط زمانی باید ارسال شوند که endpoint امن commerce backend متصل باشد.

## قبل از production commerce
- session و authentication فقط با cookie امن/HttpOnly یا سازوکار معادل backend.
- CSRF/CORS/session policy متناسب با معماری backend.
- rate limiting برای auth/contact/checkout.
- webhook signature verification برای payment provider.
- validation سمت سرور برای قیمت، موجودی، تخفیف و shipping.
- هیچ secret در `NEXT_PUBLIC_*` قرار نگیرد.
- CSP بعد از اتصال providerهای واقعی فقط به originهای لازم باز شود.
