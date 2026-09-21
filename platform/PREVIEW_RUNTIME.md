# Cloudflare commerce preview

Use `wrangler.preview.jsonc` for the isolated API preview Worker.

It intentionally has **no static asset binding** because the storefront is deployed separately. This avoids coupling the API runtime to generated frontend assets and keeps the preview Worker focused on:

- D1
- R2
- cart
- catalog
- inventory
- checkout
- admin
- compatibility adapters

Commands:

```bash
npm install
npm run dev:preview
npm run deploy:preview
```

With current Wrangler, the D1 and R2 resources may be auto-provisioned when deployed if account authentication is available. Production resources must still be explicitly named and reviewed before promotion.
