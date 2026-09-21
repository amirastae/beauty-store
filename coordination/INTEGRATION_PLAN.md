# Integration Plan — One VELOURA Site

## Current integration topology

- Production: `cloudflare-site` @ `4683bc2fdbfda6e7ded412941eab86283c45c708`
- Staging: `integration-staging` @ `4bb73eb36d878c352a3cf9fe8725f0ecd06d6d0d`
- Foundation: `beauty-v2-foundation` @ `0e1c78f1dfd1a4822a74cced49cc8130b85e4b1f`
- UI polish: `veloura-v2.1-polish` @ `46c6612c85c902de679dcf10cb4a6be1db91434d`
- Shop/catalog: `shop-v1.1.0-work` @ `12dd4e0624dfb437bf2e405b8e6d6eb3594fab3d`
- Commerce core: `commerce-core-v1` @ `3dbd71ed196ac61ed62062a7105d33b013706fb6`

## Already staged safely

The backend has been copied into `integration-staging/services/commerce/` as an isolated snapshot. It does not override the active frontend or root Cloudflare deployment configuration.

## UI polish PR

Draft PR #30 tracks `veloura-v2.1-polish → integration-staging`.

GitHub reports that PR as not currently mergeable and it contains a very large diff. **Do not merge it wholesale.** Treat it as a discovery diff. The integration owner must selectively adopt the current source/build output after checking overlapping generated assets and routes.

## Shop/catalog integration

Do not merge `shop-v1.1.0-work` wholesale. Its 56-product JSON catalog has already been mapped into the commerce-core compatibility layer without touching that branch.

Backend coverage:
- 56 shop-v1.1 products
- 112 shop product/variant external refs
- 4 VELOURA v2 products with shade-aware variants
- 12 VELOURA v2 refs
- currency isolation: USD vs IRR

## Next integration sequence

1. Let the UI-polish workstream finish its current branch.
2. Select the canonical frontend source tree for staging.
3. Rebuild static export on staging instead of merging old generated `public/_next` artifacts from multiple branches.
4. Keep `services/commerce/` isolated while D1/R2 preview bindings are configured.
5. Wire frontend checkout through the compatibility SDK.
6. Run staging build + mobile QA + catalog/cart/search/checkout smoke tests.
7. Promote one verified staging commit to `cloudflare-site`.

## Rule for all chats

No chat should independently modify `cloudflare-site`. Work branch first; integration-staging second; production last.
