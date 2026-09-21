# VELOURA Cinematic Beauty Handoff

- Source branch: `cinematic-beauty-v1-20260921`
- Base: `integration-staging`
- Scope: homepage visual experience only
- Production branch: untouched

## Changed paths

- `sources/canonical/veloura-next/src/components/motion/CinematicBeautyHero.tsx`
- `sources/canonical/veloura-next/src/components/storefront/Storefront.tsx`
- `sources/canonical/veloura-next/src/app/globals.css`

## What changed

- Added a 4-chapter, sticky Scroll Cinematic hero inspired by the Golestan build pattern.
- Reused existing VELOURA assets and the current adaptive 3D serum stage; no new backend/API/catalog schema.
- Added GSAP + ScrollTrigger scrub timeline, chapter transitions, film grain/vignette, progress rail, responsive mobile tuning and prefers-reduced-motion fallback.
- Storefront commerce/cart/search/product sections remain intact below the hero.

## Env / bindings

None.

## Verification

- Reference Golestan live site inspected at https://golestan-tea-eight.vercel.app/
- Source files re-read after mutation.
- Local container build was attempted but network DNS in the execution container could not resolve github.com, so npm/typecheck/build were not falsely marked PASS.
- Branch must pass canonical typecheck/build before integration.

## Known risks

- Hero is intentionally asset-based + WebGL rather than shipping a new generated MP4, so there is no new large media payload.
- Main likely overlap point is `Storefront.tsx` and appended hero CSS if another UI workstream changes the homepage before merge.
- Do not merge directly to `cloudflare-site`; integrate through `integration-staging` and run the existing canonical build pipeline.
