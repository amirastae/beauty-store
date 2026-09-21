# Integration contract for parallel VELOURA frontend workstreams

This file exists specifically so frontend work can continue in parallel without touching the commerce-core branch.

## Branch ownership

- `commerce-core-v1`: backend/API workstream only.
- `beauty-v2-foundation`, `veloura-v2.1-polish`, `shop-v1.1.0-work`: treated as external frontend workstreams.
- `cloudflare-site`: production/deployment branch; never modified by this backend workstream without an explicit promotion step.

## Existing frontend model observed

The current `veloura-v2.1-polish` branch uses:
- product IDs such as `lip-velvet-01`, `serum-01`, `perfume-01`, `eye-01`;
- optional `shadeId`;
- Zustand cart persisted under `veloura-cart-v1`;
- user-facing prices expressed in **toman**.

The backend stores IRR values in integer rials for these compatibility products. Example:

- frontend: `1,890,000 تومان`
- backend: `18,900,000 IRR`

Do not compare the raw integers directly. Convert backend IRR to toman by dividing by 10 for display.

## Stable adapter endpoint

`POST /api/v1/compat/veloura-v2/resolve`

Input:

```json
{ "product_id": "lip-velvet-01", "shade_id": "rose" }
```

Output contains the backend `variant_id`, server price and currency.

For products without shades, omit `shade_id`; the adapter resolves the `default` variant.

## Integration rule

Frontend workers should **not hard-code backend variant IDs**. Use the compatibility endpoint or the SDK in:

`platform/sdk/veloura-v2-client.ts`

This keeps frontend design work independent from backend catalog IDs.

## Checkout handoff

Frontend checkout should:
1. create a backend cart,
2. resolve each current Zustand line,
3. add the resolved variant with the requested quantity,
4. send customer/address data to checkout with an `Idempotency-Key`,
5. display payment as pending until a real provider confirms it.

Do not mark orders paid in frontend state.

## Non-interference guarantee

The backend branch will not edit the frontend branches. Frontend workers can cherry-pick only the SDK/contract when they are ready.
