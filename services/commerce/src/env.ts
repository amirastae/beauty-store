export interface Env {
  APP_ENV: string
  AUTO_BOOTSTRAP?: string
  ALLOWED_ORIGINS?: string
  ADMIN_API_KEY?: string
  SHIPPING_FLAT_MINOR_USD?: string
  SHIPPING_FREE_THRESHOLD_MINOR_USD?: string
  SHIPPING_FLAT_MINOR_IRR?: string
  SHIPPING_FREE_THRESHOLD_MINOR_IRR?: string
  PAYMENT_PROVIDER?: string
  ZARINPAL_MERCHANT_ID?: string
  PAYMENT_CALLBACK_BASE_URL?: string
  ZARINPAL_API_BASE?: string
  ZARINPAL_STARTPAY_BASE?: string
  STOREFRONT_BASE_URL?: string
  DB?: D1Database
  MEDIA?: R2Bucket
  ASSETS?: Fetcher
}

export type AppBindings = {
  Bindings: Env
}
