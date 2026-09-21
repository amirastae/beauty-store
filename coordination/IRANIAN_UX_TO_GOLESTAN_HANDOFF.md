# Iran UX -> FATIKHAN Golestan Integration Handoff

This document tells the FATIKHAN/Golestan workstream what to reuse from the Iran-commerce workstream without replacing the cinematic design system.

## Mandatory reading order

1. `coordination/00_READ_FIRST_FATIKHAN_GOLESTAN.md`
2. `coordination/FATIKHAN_CINEMATIC_MEDIA_HANDOFF.md`
3. this handoff
4. `sources/iranian-ux/veloura-next` only as a functional/reference source

## Reference checkpoint

The reference snapshot under `sources/iranian-ux/veloura-next` is synchronized from:
- branch: `iranian-commerce-ux-v1`
- source head: `ded01952d37df848a3533230798e73f3bb41e90b`
- latest fully tested app code: `0fcb9445119752fb0af933516137767ea4e6f2bb`
- full CI run: `35566394716`
- browser QA: 10 routes × mobile 390×844 + desktop 1440×900 PASS

## Port these into the canonical Golestan site

### Commerce / Iran UX
- Persian/Arabic digit and keyboard normalization.
- Toman formatting.
- Iranian mobile + postal validation.
- province/city/address checkout UX.
- cart quantity bounds and persisted-state reconciliation.
- wishlist / compare / recently-viewed state behavior.
- read-only server price/inventory verification.
- support/contact email: `fatmhkhan121@gmail.com`.

### Trust
- Do not show seeded ratings/review counts/badges as real social proof.
- Do not show unsupported shipping, cruelty-free, duration, stock, tracking or fulfillment claims.
- Payment-return query parameters are UX state only, never payment proof.
- Use factual storefront capability copy when product/fulfillment evidence is unavailable.

### Accessibility / recovery
- skip navigation and visible focus handling;
- explicit `aria-pressed` for toggle/selection controls;
- hidden cart/search overlays should be inert;
- one meaningful H1 per route;
- custom 404 recovery;
- client error recovery;
- accessible names for icon-only controls.

### Reliability gates worth preserving
- committed lockfile + `npm ci`;
- SEO/link/catalog/a11y/security/performance checks;
- mutation-safety gate while checkout mutation is not production-ready;
- FATIKHAN visible-brand gate;
- rendered-homepage trust gate.

## Do NOT port these over the cinematic canonical homepage

The Iran UX reference contains older homepage implementations and assets.

Do not replace:
- `CinematicBeautyHero`;
- the six-scene Descent -> Reveal -> Burst -> Impact -> Formula -> Ritual system;
- scroll-scrub video.currentTime architecture;
- canonical cinematic CSS/timeline;
- media fallback architecture;
- current FATIKHAN cinematic poster/video assets.

When a reference file overlaps a homepage/cinematic file, manually port only the safety/functional behavior.

## Current backend coordination

- #42 — inventory/payment implementation is reservation-first now, but callback/expiry regression coverage is still required before treating it as fully closed.
- #45 — add authoritative abuse-resistant payment/order status lookup for post-provider return.
- Runtime IRR shipping/payment provider config still requires deployment verification.

## Current integration coordination

- #44 — canonical FATIKHAN source and generated final/public branding must remain in sync.
- `public/**` is generated output, not source of truth.
- Never manually redesign or patch public output as the canonical fix.

## Acceptance rule for any future Iran-UX change

Before adding a feature, answer:

1. Does it strengthen the FATIKHAN Golestan experience?
2. Can it be integrated without replacing cinematic architecture?
3. Is it factual/verified rather than decorative fake commerce?
4. Does it keep performance/mobile/reduced-motion fallbacks healthy?

If any answer is no, do not integrate it.
