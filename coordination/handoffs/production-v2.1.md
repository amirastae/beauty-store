# Production v2.1 baseline handoff

Production branch: `cloudflare-site`
Current observed commit: `a535a06b7a96595a10c9d0b06b4f4e800757932c`

A parallel workstream promoted VELOURA v2.1.0 with the full local catalog directly to production before the integration rules had fully propagated.

The coordinator accepted that deployment as the **new production baseline** rather than overwriting it.

## Verification from server

- `/` → 200
- `/shop/` → 200
- `/cart/` → 200
- `/checkout/` → 200
- `/wishlist/` → 200
- `/product/scalp-therapy-shampoo/` → 200
- `/robots.txt` → 200
- `/sitemap.xml` → 200

## Staging action

`integration-staging` was content-synced to the new production public tree, while preserving namespaced:
- frontend source snapshots
- shop snapshot
- commerce backend
- integration CI

Future work must return to the single release train through draft PR #31.
