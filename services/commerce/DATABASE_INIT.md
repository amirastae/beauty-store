# Database initialization policy

Runtime schema bootstrap is disabled in deployed preview/production-style configurations.

Reason: migrations are deployment operations, not request-path work. A request must never be responsible for creating or upgrading the commerce database.

## Disposable temporary preview

1. Deploy and let Wrangler provision the temporary D1 binding:
   `npx wrangler deploy --config wrangler.temporary.jsonc --temporary`
2. Apply migrations + seed:
   `npm run db:apply:temporary`
3. Run the real-network regression suite:
   `./tests/integration.sh <temporary-worker-url>`

## Permanent Cloudflare preview / production

Use authenticated CI with explicit migration commands before traffic promotion. Keep `AUTO_BOOTSTRAP=0`.

The old bootstrap helper remains only as a guarded development fallback; deployed configs do not enable it.
