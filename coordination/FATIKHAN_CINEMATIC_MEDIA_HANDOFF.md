# FATIKHAN Cinematic Media Handoff

- Source branch: `fatikan-cinematic-media-v1`
- Base: `integration-staging`
- Scope: homepage cinematic media + scroll-scrub implementation only
- Production branch: untouched directly

## Implemented

- Added real `video.currentTime` scroll scrubbing to `CinematicBeautyHero.tsx`.
- Keeps the existing GSAP/image/3D hero as the automatic fallback.
- Desktop video path: `/cinematic/fatikhan-hero.mp4`.
- Mobile (<768px), Save-Data, and `prefers-reduced-motion` keep the lightweight fallback.
- Added 6-frame FATIKHAN cinematic asset set under `public/cinematic/frames/`.
- Added a 16.5s, 1280x720, 30fps, muted H.264 scroll-preview master at `public/cinematic/fatikhan-hero.mp4`.
- Preview payload: 2,418,320 bytes (~2.31 MiB), GOP=30 for responsive seeking.
- Added `CINEMATIC_MEDIA_PIPELINE.md` with the six scene prompts + five motion prompts adapted from the Golestan build journal.
- Added `scripts/assemble-cinematic.py` for final 1080p MP4/WebM assembly with measured 0.30s cross dissolves and optional all-I scrub mode.

## Current frame provenance

- Scene 01: existing FATIKHAN/beauty-store serum asset used as temporary descent frame.
- Scenes 02-05: freshly generated cinematic frames.
- Scene 06: existing UGC serum asset used as temporary ritual frame.

The current preview is a working scroll-scrub proof, not the final Kling master.

## Remaining media upgrade

Final target remains:
1. Generate final Scene 01 and Scene 06 to match the same bottle exactly.
2. Animate 01→02, 02→03, 03→04, 04→05, 05→06 with Kling 3.0 Start+End Frame.
3. Replace `fatikhan-hero.mp4` and generate `fatikhan-hero.webm` with the included assembly script.
4. Real-device desktop/mobile visual regression before production promotion.

## External generation constraint encountered

The connected Higgsfield workspace is on the Free plan. Four scene generations completed, while two were blocked/failed by backend rate limiting. A full five-clip Kling 3.0 run would exceed the currently available credit balance, so the repository preview deliberately uses deterministic FFmpeg motion until the final Kling assets are available.

## Conflict / safety

- No commerce/API/schema/payment/D1/R2 changes.
- Latest integration-staging commerce change was checked and does not overlap these paths.
- One-shot media hydration workflow was removed before handoff.
- Promotion must still go through `integration-staging` verification.
