# ONE SITE RULE — FATIKHAN Golestan

این سند برای جلوگیری از تکرار و خرابکاری بین چت‌های موازی است.

**Canonical application**
`sources/canonical/veloura-next`

**Canonical commerce service**
`services/commerce`

هر چت قبل از شروع:
- آخرین integration head را بخواند؛
- handoffهای مربوط را بخواند؛
- قابلیت موجود را دوباره نسازد؛
- فقط gap واقعی را patch کند؛
- خروجی نهایی را به canonical منتقل کند.

Donor branches محل آزمایش/تحویل هستند، نه سایت دوم.

اولویت conflict:
1. FATIKHAN Golestan cinematic architecture
2. canonical UX/accessibility/security
3. verified commerce truth
4. donor implementation details

اگر donor با cinematic اصلی تداخل دارد، فقط رفتار مفیدش منتقل می‌شود؛ UI جایگزین نمی‌شود.
