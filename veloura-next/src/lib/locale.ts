const faNumber = new Intl.NumberFormat("fa-IR");

export function formatFaNumber(value: number) {
  return faNumber.format(value);
}

export function formatToman(value: number) {
  return `${faNumber.format(value)} تومان`;
}

export function discountPercent(price: number, compareAtPrice?: number) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function normalizeIranianDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export function isIranianMobile(value: string) {
  const normalized = normalizeIranianDigits(value).replace(/[\s-]/g, "");
  return /^(?:\+98|0098|98|0)?9\d{9}$/.test(normalized);
}

export function isIranianPostalCode(value: string) {
  const normalized = normalizeIranianDigits(value).replace(/\D/g, "");
  return /^\d{10}$/.test(normalized);
}
