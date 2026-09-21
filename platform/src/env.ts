export interface Env {
  APP_ENV: string
  DB?: D1Database
  MEDIA?: R2Bucket
}

export type AppBindings = {
  Bindings: Env
}
