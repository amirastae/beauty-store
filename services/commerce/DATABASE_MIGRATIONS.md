# Database migration policy

Runtime request handlers do **not** create or mutate schema.

Apply D1 migrations explicitly before running integration tests or promoting a Worker:

```bash
npm run db:migrate:preview-local
npm run db:seed:preview-local
```

For remote environments use the matching Wrangler config and `--remote`.

This prevents a first user request from becoming a schema migration and removes runtime bootstrap races/failures.
