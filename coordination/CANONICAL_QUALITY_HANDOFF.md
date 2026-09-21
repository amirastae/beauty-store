# Canonical Quality Handoff — FATIKHAN / Golestan

> READ FIRST: `coordination/00_READ_FIRST_FATIKHAN_GOLESTAN.md`

## Decision

The versioned `shop/v1.x` storefront experiments are no longer a product direction.

**All future work must strengthen the single canonical FATIKHAN Golestan-style site under `sources/canonical/veloura-next`.**

Do not merge or transplant an old storefront homepage over the cinematic canonical frontend.

## What this workstream transferred into canonical

Only non-competing reliability/safety behavior was ported:

- source integrity audit;
- static-output link/asset/accessibility audit;
- rendered FATIKHAN visible-brand gate;
- cinematic media presence gate remains mandatory;
- hardened robots rules for stateful/non-indexable routes;
- safe Cloudflare response headers;
- immutable cache for fingerprinted Next static assets;
- bounded cache for cinematic media;
- integration PR workflow now runs canonical `npm run quality`.

## Canonical quality command

From `sources/canonical/veloura-next`:

```bash
npm run quality
```

Current sequence:

1. TypeScript
2. source integrity audit
3. cinematic asset verification + Next production build
4. static output audit

## Static audit protects

- required canonical routes;
- internal links;
- referenced assets;
- image alt attributes;
- accessible names for buttons;
- skip-navigation target;
- rendered FATIKHAN visible brand;
- no visible legacy-brand regression on homepage;
- robots rules;
- sitemap coverage;
- Cloudflare security headers;
- required cinematic MP4/WebM/poster assets.

## Source audit protects

- common credential/token patterns;
- dead `href="#"` controls;
- TODO/FIXME residue;
- unsupported seeded social-proof residue.

Technical compatibility identifiers such as `veloura-next`, `veloura-*` storage keys and compatibility API names are intentionally allowed and must not be renamed by this workstream.

## What was intentionally NOT ported

- no alternate homepage;
- no VELOURA visual branding;
- no shop/v1.x component tree;
- no replacement hero;
- no replacement 3D scene;
- no cinematic timeline changes;
- no media replacement;
- no commerce schema/payment mutation;
- no direct production deploy.

## Cinema remains authoritative

Preserve:

`Descent -> Reveal -> Burst -> Impact -> Formula -> Ritual`

and the desktop `video.currentTime` scroll-scrub architecture with WebM -> MP4 preference plus mobile / Save-Data / reduced-motion fallback.

## Integration

Branch: `canonical-quality-hardening-v1`

Target: `integration-staging`

This branch is safe to review as a non-visual reliability patch. It should be integrated only after the canonical quality workflow passes.
