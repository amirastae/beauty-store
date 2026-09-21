> **READ FIRST:** `coordination/00_READ_FIRST_FATIKHAN_GOLESTAN.md`
> All supporting workstreams must integrate into this FATIKHAN/Golestan cinematic direction; do not create a competing homepage.

# FATIKHAN Cinematic Media Handoff

- Source branch: `fatikan-cinematic-polish-v2`
- Base: `integration-staging`
- Scope: homepage cinematic media + scroll-scrub polish only
- Production branch: untouched directly

## Implemented

- Real `video.currentTime` scroll scrubbing is active on eligible desktop **and mobile** devices.
- GSAP/image/3D remains the automatic fallback.
- Mobile viewport width alone does not disable video. Fallback is reserved for Save-Data, reduced-motion, 2G/very slow network, or genuine media failure.
- Browser source order is WebM -> MP4.
- Hero waits for decoded video data before hiding the fallback, reducing blank-frame risk.
- Poster now uses `/cinematic/fatikhan-poster.jpg`.
- All six FATIKHAN scene frames are dedicated AI generations.
- Source frames are compressed WebP files under `cinematic/frames/` and are no longer shipped in `public/**`.
- Public preview master is 16.5s, 1280x720, 30fps with 0.30s cross dissolves.
- MP4: 2,717,271 bytes.
- WebM: 1,277,072 bytes.
- Poster: 52,433 bytes.
- Both video encodes use a 1-second GOP for responsive seeking.
- `npm run build` now runs `verify:cinematic` first so missing/oversized media fails CI.
- Final 1080p MP4/WebM assembly remains available through `scripts/assemble-cinematic.py`, including optional `--all-i`.

## Media status

Scenes 01-06 are now all generated specifically for the FATIKHAN cinematic sequence:
Descent -> Reveal -> Burst -> Impact -> Formula -> Ritual.

The current video is a deterministic AI-still cinematic preview, not the final Google Flow motion master.

## Remaining final-media gate

1. Generate five Start+End Frame transitions in Google Flow using the six locked source frames.
2. Assemble the five clips using the included script.
3. Replace the current preview MP4/WebM.
4. Run desktop/mobile real-device visual regression before production promotion.

## Generation constraint

Six locked scene frames are complete. Google Flow is now the approved final-motion lane; Higgsfield generations remain QA/reference candidates and must not replace the master without visual review.

## Conflict / safety

- No commerce/API/schema/payment/D1/R2 changes.
- The staging commerce workstream does not overlap these paths.
- Temporary one-shot media workflows were removed after the assets were committed.
- Promotion still goes through `integration-staging` verification only.


## Latest canonical runtime hardening

- Removed the stale mobile viewport probe from the canonical hero so the locked mobile scrub invariant is unambiguous.
- The blob-backed cinematic loader now prefers the smaller WebM master and falls back to MP4 only when needed.
- Runtime CI now locks the WebM -> MP4 source order in addition to the existing mobile/desktop scroll-scrub invariant.
- This changes transport efficiency only; the approved Descent -> Reveal -> Burst -> Impact -> Formula -> Ritual choreography is unchanged.
