# FATIKHAN — Google Flow Final Cinematic Handoff

This package is the final media handoff for the canonical FATIKHAN homepage cinematic.

The website runtime is already finished:
- eligible desktop **and mobile** scroll progress drives `video.currentTime`;
- WebM -> MP4 source fallback;\n- mobile viewport width alone must never disable cinematic scrub;
- image/3D fallback remains for Save-Data, reduced-motion, 2G/very slow network and genuine media failure; mobile viewport width alone never disables the scrub;
- the public site expects the final files at:
  - `public/cinematic/fatikhan-hero.mp4`
  - `public/cinematic/fatikhan-hero.webm`
  - `public/cinematic/fatikhan-poster.jpg`

Only the final motion media needs to be replaced.

## Source frames

Use these exact six source images as the visual anchors:

1. `cinematic/frames/scene-01-descent.webp`
2. `cinematic/frames/scene-02-reveal.webp`
3. `cinematic/frames/scene-03-burst.webp`
4. `cinematic/frames/scene-04-impact.webp`
5. `cinematic/frames/scene-05-formula.webp`
6. `cinematic/frames/scene-06-ritual.webp`

Do not redesign the bottle between shots. Bottle geometry, glass tint, cap, label zone, proportions and lighting language should remain visually continuous.

## Global Flow settings

- Aspect ratio: **16:9**
- Target: **1920x1080**
- Motion: cinematic slow motion
- Camera: mostly locked, no random orbit, no handheld shake
- Audio: off / not needed
- Shot length: **4 seconds each** if Flow allows
- Keep start and end frames visually faithful
- Avoid prompt-generated readable packaging text
- Avoid logos other than FATIKHAN if text appears at all
- Avoid scene cuts inside a transition
- Avoid morphing the bottle geometry
- Avoid hands appearing before Clip 05
- Avoid new objects not present in the start/end frames
- Preserve black -> oxblood/crimson -> champagne-gold visual language

## Clip 01 — DESCENT -> REVEAL

Start frame:
`scene-01-descent.webp`

End frame:
`scene-02-reveal.webp`

Prompt:

> The exact same FATIKHAN serum bottle continues a slow controlled vertical descent through a deep black and oxblood-crimson void and eases into a centered upright stop. Fine cosmetic powder, microscopic droplets and tiny rose-petal fragments drift naturally in the air. The narrow champagne-gold top light remains consistent. Near the end of the shot the cap subtly lifts only a few millimeters and one luminous serum droplet forms above the bottle neck. Preserve the bottle shape, glass tint, cap shape, label zone and proportions exactly from start to end. Locked camera, luxury skincare commercial, realistic glass physics, smooth ease-out, no sudden zoom, no cuts, no extra objects, no readable text.

Suggested filename:
`clip-01.mp4`

## Clip 02 — REVEAL -> BURST

Start frame:
`scene-02-reveal.webp`

End frame:
`scene-03-burst.webp`

Prompt:

> Preserve the exact same FATIKHAN serum bottle and locked centered composition. The luminous droplet above the neck stretches gently and releases a restrained radial bloom of formula elements: rose petals, pearl spheres, translucent hyaluronic gel ribbons, tiny saffron threads, micro water droplets and fine mineral shimmer. Motion should feel premium and slow, not explosive or chaotic. The bottle must not rotate, morph, change scale unexpectedly or change materials. Deep black and oxblood-crimson background, champagne-gold rim light, realistic fluid motion, smooth ease-out into the final burst arrangement, no cuts, no text.

Suggested filename:
`clip-02.mp4`

## Clip 03 — BURST -> IMPACT

Start frame:
`scene-03-burst.webp`

End frame:
`scene-04-impact.webp`

Prompt:

> Keep the same FATIKHAN bottle centered and visually unchanged. The suspended formula elements gradually lose outward momentum and begin falling under natural gravity. A shallow crystal serum dish enters subtly into the lower frame without changing the camera position. One glossy serum droplet falls into the dish and creates a clean controlled crown splash. Rose petals and pearl micro-spheres continue drifting downward. Maintain the black/crimson environment and warm champagne-gold edge light. High-speed macro beauty physics, realistic liquid behavior, no camera shake, no bottle deformation, no cut.

Suggested filename:
`clip-03.mp4`

## Clip 04 — IMPACT -> FORMULA

Start frame:
`scene-04-impact.webp`

End frame:
`scene-05-formula.webp`

Prompt:

> The crown splash collapses naturally back into the crystal serum dish and transforms into translucent serum ribbons that curl upward around the exact same FATIKHAN bottle. Pearl spheres and rose petals begin a slow elegant orbit. Fine champagne mineral shimmer catches the rim light. The background deepens gradually toward richer oxblood crimson while the warm gold highlights intensify slightly. Keep the bottle geometry, scale and central position unchanged. Locked camera, continuous premium skincare motion, physically plausible liquid refractions, no cuts, no sudden zoom, no text.

Suggested filename:
`clip-04.mp4`

## Clip 05 — FORMULA -> RITUAL

Start frame:
`scene-05-formula.webp`

End frame:
`scene-06-ritual.webp`

Prompt:

> The translucent formula vortex around the exact same FATIKHAN bottle gradually slows and settles. Two elegant feminine hands with warm olive-toned skin enter gently from the sides, preserving the bottle design exactly, then softly cradle and lift it a small amount. Delicate gold jewelry catches the champagne rim light. One glossy serum drop remains visible on the back of one hand. Rose petals settle below. No face enters frame. Intimate final luxury beauty ritual, soft warm final glow, realistic hands and glass, locked camera, smooth ease-out, no morphing, no cut, no readable text.

Suggested filename:
`clip-05.mp4`

## Negative prompt / continuity checklist

Paste or preserve these constraints in every Flow generation where possible:

> no bottle redesign, no label text changes, no duplicate bottle, no extra hands, no face, no camera shake, no random orbit, no hard cut, no fast zoom, no object teleporting, no melted geometry, no cap shape change, no glass color change, no watermark, no unrelated brand logo, no readable AI packaging text

## Export and return package

Return these exact five files:

```
clip-01.mp4
clip-02.mp4
clip-03.mp4
clip-04.mp4
clip-05.mp4
```

Place them under:

```
cinematic/source/
```

Then run:

```bash
python scripts/assemble-cinematic.py
```

The script creates the final deploy assets:
- `public/cinematic/fatikhan-hero.mp4`
- `public/cinematic/fatikhan-hero.webm`
- `public/cinematic/fatikhan-poster.jpg`

If real-device scroll seeking still stutters, use:

```bash
python scripts/assemble-cinematic.py --all-i
```

## Acceptance gate before production

The final Flow master is accepted only if all of these are true:

- bottle identity stays consistent through all 5 transitions;
- no visible morphing in cap/label/glass proportions;
- no abrupt camera movement;
- hands only appear in Clip 05;
- no accidental readable fake packaging text;
- transition boundaries feel continuous;
- MP4/WebM remain practical for web delivery;
- desktop scroll scrub feels responsive;
- mobile keeps the lightweight fallback unless a later mobile video is deliberately approved.

Do not replace the current live cinematic media until the Flow master passes this visual review.
