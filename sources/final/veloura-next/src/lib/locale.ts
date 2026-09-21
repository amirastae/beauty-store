const faDigits = "۰۱۲۳۴۵۶۷۸۹"
const arDigits = "٠١٢٣٤٥٦٧٨٩"

export function toLatinDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (d) => String(faDigits.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(arDigits.indexOf(d)))
}

export function normalizeIranianMobile(value: string) {
  let raw = toLatinDigits(value).replace(/[^0-9+]/g, "")
  if (raw.startsWith("+98")) raw = "0" + raw.slice(3)
  if (raw.startsWith("0098")) raw = "0" + raw.slice(4)
  if (raw.startsWith("98") && raw.length === 12) raw = "0" + raw.slice(2)
  return raw
}

export function isIranianMobile(value: string) {
  return /^09\d{9}$/.test(normalizeIranianMobile(value))
}

export function normalizePostalCode(value: string) {
  return toLatinDigits(value).replace(/\D/g, "")
}

export function isIranianPostalCode(value: string) {
  return /^\d{10}$/.test(normalizePostalCode(value))
}

export const formatFaNumber = (value: number) => new Intl.NumberFormat("fa-IR").format(value)
export const formatToman = (value: number) => formatFaNumber(value) + " تومان"
