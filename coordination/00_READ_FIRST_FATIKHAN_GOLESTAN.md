# 00 — READ FIRST: FATIKHAN / Golestan North Star

This file is the first coordination rule for every chat/workstream touching the beauty-store site.

## Authoritative product direction

- User-visible brand: **FATIKHAN**.
- The primary design/architecture North Star is the **Golestan build system** described in `golestan-build-journal.pdf` and represented by:
  `https://golestan-tea-eight.vercel.app/`
- Do **not** build a parallel homepage, alternative hero, or competing visual system.
- Every new frontend change must improve, preserve, or integrate with the FATIKHAN Golestan-style canonical experience.

## Current cinematic system

Current staging already contains the FATIKHAN six-scene cinematic pipeline:

`Descent -> Reveal -> Burst -> Impact -> Formula -> Ritual`

Current implementation:
- desktop scroll-scrub drives `video.currentTime`;
- browser source preference: WebM -> MP4;
- current preview master: 16.5s / 1280×720 / 30fps;
- MP4 ≈ 2.72 MB;
- WebM ≈ 1.28 MB;
- cross-dissolve ≈ 0.30s;
- fallback stays available for mobile, Save-Data, reduced-motion and media failure;
- poster/fallback must prevent blank hero states;
- final media gate is five Kling 3.0 Start+End Frame transitions, then final MP4/WebM assembly and real-device visual regression.

The current still-based preview is infrastructure, not permission to replace the cinematic architecture.

## Source-of-truth order

1. `sources/canonical/veloura-next` — canonical FATIKHAN frontend.
2. Golestan cinematic handoffs:
   - `coordination/FATIKHAN_CINEMATIC_MEDIA_HANDOFF.md`
   - `coordination/CINEMATIC_BEAUTY_HANDOFF.md` (older architectural history)
3. `sources/iranian-ux/veloura-next` — latest verified Iran-commerce/trust/accessibility reference snapshot.
4. `sources/shop-latest` — shop/catalog reference.
5. `services/commerce` — commerce backend source of truth.
6. `public/**` — generated integration artifact; never the design/source authority.

## How to use the Iran-commerce reference

The Iran-commerce workstream is **supporting infrastructure for the Golestan-style canonical site**, not a competing design.

Selectively port from `sources/iranian-ux/veloura-next`:
- Persian/Arabic search normalization;
- Toman formatting and Iran checkout validation;
- cart/wishlist/compare/recent state hardening;
- read-only commerce price/inventory verification;
- support/contact integration;
- accessibility fixes, inert overlays and recovery UX;
- brand/trust/security/performance/mutation-safety checks;
- removal of seeded ratings/reviews/badges and unsupported marketing claims.

When overlap exists with homepage/cinematic files, preserve the canonical Golestan hero and port only the functional/safety behavior around it.

## Locked brand compatibility rule

Visible brand is FATIKHAN.

Do not rename technical compatibility identifiers unless a separate migration is approved:
- `veloura-next` paths/package naming;
- `veloura-*` persisted storage keys;
- `/api/v1/compat/veloura-v2/resolve`;
- worker/internal deployment identifiers.

## Current commerce safety gates

Keep checkout mutation disabled until backend readiness is fully verified.

Track:
- #42 — inventory/payment regression coverage — **completed and CI verified**;
- #45 — authoritative public order/payment receipt/status lookup — **completed and Cloudflare-tested**;
- runtime production D1/R2/payment credentials and final real-provider verification.

The payment-return query string alone is never proof of successful payment.

## Integration discipline

Workstream -> isolated branch -> coordination handoff -> `integration-staging` -> canonical build -> all verification gates -> generated `public/**` -> production promotion.

Never:
- merge a workstream wholesale over canonical;
- replace the cinematic homepage with an unrelated template;
- manually patch generated `public/**` as source;
- deploy directly to `cloudflare-site` from a feature workstream.

## Latest Iran UX checkpoint transferred here

Reference source copied from `iranian-commerce-ux-v1`.
- workstream branch head: `ded01952d37df848a3533230798e73f3bb41e90b`
- latest fully tested app-code checkpoint recorded by that workstream: `0fcb9445119752fb0af933516137767ea4e6f2bb`
- latest full CI run: `35566394716`
- browser QA: 10 routes × mobile 390×844 + desktop 1440×900 PASS
- official support email: `fatmhkhan121@gmail.com`

Any future work from that workstream must first ask:
**How does this strengthen the FATIKHAN Golestan-style canonical experience?**
If it does not, do not add it.


## Latest unified execution rule

From this checkpoint onward, every workstream must optimize for the **same FATIKHAN Golestan-style canonical site**.

Before making a frontend, commerce, catalog, performance, SEO, checkout, media, or deployment change, read this file and the relevant handoff first. Do not create an alternate storefront or a separate visual direction.

Mandatory current handoffs:
1. `coordination/FATIKHAN_CINEMATIC_MEDIA_HANDOFF.md`
2. `coordination/IRANIAN_UX_TO_GOLESTAN_HANDOFF.md`
3. `coordination/COMMERCE_TO_GOLESTAN_HANDOFF.md`

The cinematic FATIKHAN experience is the presentation layer; commerce work must fit underneath it without weakening scroll-scrub performance, mobile fallbacks, accessibility, or brand consistency.

Current release checkpoints:
- production `cloudflare-site@1276b6448e470179523b8c12887ef46f30400668`
- integration `integration-staging@725624bd540bba6ab1bcca31e7e7e40bd20b8111`
- commerce `commerce-core-v1@fb1b5a18ce7c971a21a0fd73623adba82d683519`

Visible brand remains **FATIKHAN**. Technical compatibility names such as `veloura-next`, `veloura-*` storage keys and `/api/v1/compat/veloura-v2/resolve` remain internal until an explicit migration is approved.


## Canonical quality guard

Before touching canonical frontend reliability, SEO, accessibility, security headers, or generated output checks, read:

- `coordination/CANONICAL_QUALITY_HANDOFF.md`

The old `shop/v1.x` experiments are reference-only and must never become a parallel storefront or replace the FATIKHAN Golestan cinematic system.


## One-site completion rule

A workstream is **not complete** merely because its branch works. A feature is complete only after its smallest compatible patch is integrated into `sources/canonical/veloura-next` or `services/commerce`, the canonical build/quality gates pass, and the handoff is updated.

All chats must treat side branches as donor lanes only. Never keep a second visual/storefront direction alive beside FATIKHAN Golestan.
