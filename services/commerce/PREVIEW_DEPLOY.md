# Preview deployment

This branch is intentionally configured to deploy as a separate Worker named `beauty-store-core-preview`.

Cloudflare Wrangler 4.45+ can automatically provision draft D1 and R2 bindings when a binding is declared without a resource ID. The preview Worker therefore declares:

- `DB` — D1
- `MEDIA` — R2

The Worker also has an idempotent preview-only bootstrap guard (`AUTO_BOOTSTRAP=1`) so a newly provisioned empty D1 database can initialize the schema and demo catalog on the first API request.

Production remains on the separate `cloudflare-site` branch and is not changed by this preview configuration.

Before production promotion:
1. create named production resources explicitly,
2. disable runtime bootstrap,
3. apply migrations through CI/CD,
4. bind payment secrets,
5. run checkout and stock concurrency tests,
6. only then merge the selected code into the production branch.
