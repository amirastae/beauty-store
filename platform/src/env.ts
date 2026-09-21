export interface Env {
  APP_ENV: string
  AUTO_BOOTSTRAP?: string
  DB?: D1Database
  MEDIA?: R2Bucket
  ASSETS?: Fetcher
}

export type AppBindings = {
  Bindings: Env
}
