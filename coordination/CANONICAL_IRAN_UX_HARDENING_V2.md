# Canonical Iran UX Hardening v2

> Read first: `coordination/00_READ_FIRST_FATIKHAN_GOLESTAN.md`

Branch: `canonical-iran-ux-hardening-v2`  
Target: `integration-staging`

## Scope

This is a narrow functional/accessibility patch for the **single canonical FATIKHAN Golestan storefront**.

It does not replace or edit:
- `CinematicBeautyHero`;
- six-scene Descent -> Reveal -> Burst -> Impact -> Formula -> Ritual timeline;
- scroll-scrub video architecture;
- cinematic MP4/WebM/poster assets;
- commerce schema/payment logic.

## Changes

- Port `normalizePersianSearch` into canonical `src/lib/locale.ts`.
- Use the same normalization in:
  - homepage search overlay;
  - dedicated search route;
  - shop catalog.
- Normalize Persian/Arabic Yeh and Kaf, diacritics, ZWNJ/spacing and Persian/Arabic digits.
- Add stateful accessibility:
  - `aria-pressed` for category filters;
  - `aria-pressed` for wishlist/compare controls;
  - `aria-pressed` for shade selection;
  - live result counts.
- Make hidden cart/search overlays inert while closed.
- Add explicit non-submit button semantics to interactive controls.
- Remove a literal escaped newline residue immediately after the cinematic hero component.

## Acceptance

Canonical `npm run quality` must pass before integration.

The visual/cinematic system remains authoritative and unchanged.
