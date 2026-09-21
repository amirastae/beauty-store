# Temporary Cloudflare runtime

This config is for unauthenticated real-network verification via modern Wrangler temporary accounts.

It intentionally binds D1 but omits R2 because temporary Cloudflare accounts do not guarantee R2 support. Media endpoints are therefore expected to report `MEDIA_NOT_BOUND` in this environment.

Use:

```bash
npx wrangler deploy --config wrangler.temporary.jsonc --temporary
```

The resulting Worker is disposable and must never be treated as production.
