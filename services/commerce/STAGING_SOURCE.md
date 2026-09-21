# Commerce service staging snapshot

Source branch: `commerce-core-v1`
Source commit: `3a5cfbaa03797ee0fb06778b5a8f8802bf1a138a`

Status:
- TypeScript typecheck: PASS
- Wrangler preview dry-run bundle: PASS
- local `wrangler dev`: blocked on this server by workerd/ProxyWorker startup failure
- production is not affected
- real Cloudflare preview still requires account-side authenticated deployment

The API-only preview config is `wrangler.preview.jsonc`.
