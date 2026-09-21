# Permanent commerce preview deployment

The repository now has a manual deployment workflow:

`.github/workflows/deploy-commerce-preview.yml`

It deploys only the isolated commerce Worker, never the storefront production branch.

Required GitHub environment/repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The workflow:
1. typechecks,
2. deploys `beauty-store-commerce-preview`,
3. lets Wrangler provision/bind preview D1/R2 resources,
4. applies D1 migrations,
5. loads idempotent compatibility seed data,
6. verifies health,
7. runs real-network commerce regression.

Keep production checkout disconnected until this workflow passes against the permanent account.
