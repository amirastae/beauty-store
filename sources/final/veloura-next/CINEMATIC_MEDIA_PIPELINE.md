# FATIKHAN Scroll Cinematic Media Pipeline

This is the production media contract for the homepage hero. It adapts the six-scene workflow from the Golestan build journal to FATIKHAN cosmetics while keeping the current GSAP fallback intact until final media exists.

## Locked visual identity

- Brand: **FATIKHAN**
- Desktop master: 16:9, 1920x1080
- Background: deep black -> oxblood / dark crimson
- Light: warm champagne-gold rim light + controlled rose highlights
- Product: the same signature serum bottle in all six scenes
- Bottle: translucent smoked-blush glass, rounded cylindrical shoulders, dark espresso metallic cap, warm rose-gold accents, blank cream label zone
- No other brand names, no watermark, no generated readable packaging text
- Keep camera framing and bottle geometry consistent across every scene

## Scene frames

### 01 — Descent

Luxury cinematic skincare campaign for FATIKHAN. The signature smoked-blush serum bottle descends slowly through a deep black and oxblood-crimson void. A narrow champagne-gold spotlight falls from above. Fine cosmetic powder, microscopic droplets, and tiny rose-petal fragments drift in suspended air. Large negative space, premium editorial product photography, shallow depth of field, locked camera, 16:9.

### 02 — Reveal

The exact same FATIKHAN serum bottle, upright and closer. The cap subtly lifts and one luminous serum droplet hovers above the neck. Pearl particles and translucent gel beads emerge around it in controlled symmetry. Science-meets-beauty, premium, elegant, dark crimson haze, warm gold rim light, 16:9, locked camera.

### 03 — Burst

The exact same bottle centered while signature formula elements burst radially in elegant slow motion: rose petals, pearl spheres, clear hyaluronic gel ribbons, tiny saffron threads, glossy water droplets, fine mineral shimmer. Controlled spacing, no clutter, deep black/crimson background, cinematic gold light, 16:9.

### 04 — Impact

The same bottle behind a shallow crystal serum dish. A single glossy serum droplet hits the dish and creates a precise crown splash. Rose petals and pearl micro-spheres fall through frame. High-speed macro beauty photography, black/crimson background, champagne-gold rim light, locked camera, 16:9.

### 05 — Formula

The exact same bottle at eye level, surrounded by a slow vortex of translucent serum ribbons, pearl spheres, rose petals and fine champagne shimmer. Physically plausible liquid refractions, luxurious skincare laboratory mood, rich crimson haze, warm gold edge lighting, locked camera, 16:9.

### 06 — Ritual

Two elegant feminine hands with warm olive-toned skin gently cradle the exact same FATIKHAN bottle. Subtle delicate gold jewelry. One glossy serum drop rests on the back of one hand. Rose petals below, warm gold spotlight, intimate final beauty ritual, no face visible, deep crimson-to-black background, 16:9.

## Current staging preview

The current staging media is now built from **six dedicated FATIKHAN AI scene frames** rather than legacy storefront stills.

Source frames are archived outside the public bundle:

```
cinematic/frames/scene-01-descent.webp
cinematic/frames/scene-02-reveal.webp
cinematic/frames/scene-03-burst.webp
cinematic/frames/scene-04-impact.webp
cinematic/frames/scene-05-formula.webp
cinematic/frames/scene-06-ritual.webp
```

Current public scrub media:

- `fatikhan-hero.mp4`: 2,717,271 bytes
- `fatikhan-hero.webm`: 1,277,072 bytes
- `fatikhan-poster.jpg`: 52,433 bytes
- 16.5 seconds, 1280x720, 30fps preview master
- 1-second GOP for practical scroll seeking
- six scenes connected with 0.30s cross dissolves

This is the deterministic staging preview. The final production-media upgrade is still the five Kling 3.0 Start+End Frame transitions described below.

## Kling 3.0 motion prompts

Use Start + End Frame mode. Each transition should be 3-5 seconds, 30fps feel, muted, locked camera unless explicitly noted.

### Clip 01 — Scene 01 -> Scene 02

The bottle continues its slow controlled descent and eases to a centered upright stop. Micro dust and rose fragments drift naturally. The cap lifts a few millimeters and a luminous serum droplet forms above the bottle neck. Camera remains locked. Smooth ease-out, luxury slow-motion, no sudden zoom, no geometry changes to the bottle.

### Clip 02 — Scene 02 -> Scene 03

The hovering droplet stretches and releases a restrained radial bloom of formula elements. Rose petals, pearl spheres, translucent gel ribbons, saffron threads and micro water droplets expand outward in elegant slow motion. The bottle remains the exact same shape and position. Locked camera, smooth ease-out, premium editorial motion.

### Clip 03 — Scene 03 -> Scene 04

The suspended formula elements lose outward momentum and begin falling under gravity. The bottle stays centered while a shallow crystal serum dish rises subtly into the lower frame. One serum droplet falls into the dish and creates a clean crown splash. Rose petals and pearl micro-spheres continue falling. Locked camera, realistic fluid motion.

### Clip 04 — Scene 04 -> Scene 05

The crown splash collapses back into the serum dish and dissolves into translucent ribbons that curl upward around the bottle. Pearl spheres and petals begin a slow orbit. The background deepens from black-crimson to richer oxblood. Warm gold highlights intensify. Locked camera, smooth continuous motion, no cuts.

### Clip 05 — Scene 05 -> Scene 06

The formula vortex slows and settles. Two elegant feminine hands enter gently from the sides, wrap around the bottle and lift it slightly. Delicate gold jewelry catches the rim light. One serum drop remains visible on the back of the hand. Rose petals settle below. Camera stays locked and intimate, soft final glow, smooth ease-out.

## Assembly

Place the five generated clips here:

```
cinematic/source/clip-01.mp4
cinematic/source/clip-02.mp4
cinematic/source/clip-03.mp4
cinematic/source/clip-04.mp4
cinematic/source/clip-05.mp4
```

Then run:

```bash
python scripts/assemble-cinematic.py
```

Outputs:

```
public/cinematic/fatikhan-hero.mp4
public/cinematic/fatikhan-hero.webm
public/cinematic/fatikhan-poster.jpg
```

The homepage already checks these exact paths. When valid desktop media loads, the hero automatically switches from the current image/3D fallback to true video `currentTime` scroll scrubbing.

## Encoding policy

The journal contains two scrub recommendations: a 1-second keyframe interval in the assembly chapter, and an all-I-frame `keyint=1` fallback later for stutter. Production default here uses a 1-second GOP at 30fps to control file size. If real-device seeking still stutters, run:

```bash
python scripts/assemble-cinematic.py --all-i
```

That creates all-I-frame H.264/VP9 output and should only be promoted if the final payload remains acceptable.

## Performance gates

- Desktop hero video target: ideally under 25 MB.
- Mobile below 768px: keep the current lightweight cinematic fallback rather than forcing the desktop video.
- `prefers-reduced-motion: reduce`: no video scrub.
- Save-Data users: no video scrub.
- Video is muted + playsInline.
- Poster prevents a blank first paint.
- Real mobile testing is mandatory; DevTools-only validation is not enough.
