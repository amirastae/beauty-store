# VELOURA Dependency Policy

## هدف
وابستگی‌های نسخه `shop/v1.8.0` باید قابل‌تکرار، قابل‌بررسی و حداقل‌ریسک باشند.

## قواعد
- نصب CI فقط با `npm ci` و `package-lock.json`.
- هیچ dependency جدیدی بدون دلیل کاربردی و بررسی مجوز اضافه نشود.
- dependencyهای runtime باید در `dependencies` و ابزارهای build/lint در `devDependencies` بمانند.
- ارتقای major نسخه‌های Next.js، React، Three.js، Tailwind یا Radix باید در branch نسخه‌ای جدا انجام شود.
- تغییر dependency همراه با lockfile همان commit انجام شود.
- قبل از deploy production، `npm run quality` باید پاس شود.
- package install scriptهای غیرضروری در CI اجرا نشوند؛ workflow از `npm ci --ignore-scripts` استفاده می‌کند.
- هر dependency که دیگر import نمی‌شود در یک patch مستقل حذف شود؛ حذف bulk بدون build ممنوع است.

## وابستگی‌های حساس معماری
- `next` / `react` / `react-dom`: هسته rendering.
- `three`: Hero سه‌بعدی و فقط به‌صورت dynamic load.
- `embla-carousel-react`: carouselها.
- `lucide-react`: icon system.
- Radix UI packages: primitiveهای UI.
- `zod` / `react-hook-form`: برای فرم‌های آینده و اتصال commerce backend.

## مجوز
فایل `LICENSE` و attribution پروژه REHHA باید حفظ شود. مجوز dependencyها نیز تابع بسته‌های اصلی است.
