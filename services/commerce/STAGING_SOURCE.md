# Commerce service staging snapshot

Source branch: `commerce-core-v1`
Source commit: `3dbd71ed196ac61ed62062a7105d33b013706fb6`

This directory is a read-only integration snapshot of the commerce backend for staging coordination.

It is intentionally namespaced under `services/commerce/` so it cannot overwrite the active storefront, root Cloudflare configuration, or files owned by the parallel frontend workstreams.

Before activation on staging:
- provision/bind D1 and R2,
- set admin secret,
- run migrations,
- wire the selected frontend SDK,
- perform preview checkout and inventory tests.

Do not deploy this directory as production merely because it exists in staging.
