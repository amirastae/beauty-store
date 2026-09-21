# DONOR RECONCILIATION — one canonical FATIKHAN site

Every side branch is a donor lane only. The canonical target is:
`integration-staging/sources/canonical/veloura-next`.

## Reconciled workstreams

| Donor branch | Capability | Canonical status |
|---|---|---|
| `canonical-checkout-privacy-v1` | checkout PII moved to session storage, legacy local draft migration/cleanup | integrated |
| `canonical-iran-ux-hardening-v2` | Persian search normalization, aria state/live result semantics | integrated |
| `canonical-seo-integrity-v1` | route-specific canonical metadata, noindex stateful routes, SEO audits | integrated |
| `fatikan-cinematic-scroll-hotfix-v2` | cinematic scroll/compositing/navigation hotfix | integrated; canonical file content matches donor hotfix |
| `golestan-support-hardening-v4-20260921` | support/recovery/trust/security gates | selectively integrated; compatible recovery and invariant checks retained |
| `commerce-core-v1` | order/cart/payment/inventory/D1 contracts | mirrored into `services/commerce` and consumed by canonical checkout |

## Deliberately not copied wholesale

- donor generated `public/**`;
- donor homepage variants;
- stale package/deployment files;
- conflicting security header values;
- duplicate verification scripts where canonical audits already cover the same invariant.

## Completion rule

A donor feature counts as complete only when:
1. the minimal compatible behavior exists in canonical or commerce;
2. canonical quality/commerce CI pass;
3. `sources/final` mirrors canonical;
4. `public/**` is rebuilt from canonical;
5. the handoff is updated.

Do not reimplement anything listed as integrated here.
