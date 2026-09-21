# Integration source snapshots

These directories mirror the current source trees from parallel workstreams without merging their histories or generated assets into the live storefront.

- `sources/foundation/veloura-next` — baseline frontend source.
- `sources/polish/veloura-next` — current visual/polish candidate.
- `sources/shop` — shop/catalog source snapshot.
- `services/commerce` — commerce backend snapshot.

The source snapshots are immutable integration inputs. A final staging build should select one canonical frontend source and import specific catalog/backend contracts rather than combining multiple generated outputs.
