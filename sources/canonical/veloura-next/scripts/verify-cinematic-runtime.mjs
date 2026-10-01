import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const heroPath = join(root, "src", "components", "motion", "CinematicBeautyHero.tsx");
const cssPath = join(root, "src", "app", "globals.css");

const [hero, css] = await Promise.all([
  readFile(heroPath, "utf8"),
  readFile(cssPath, "utf8"),
]);

const required = [
  ["ScrollTrigger.create(", "ScrollTrigger scrub driver"],
  ["window.requestAnimationFrame(", "frame-synced scrub scheduling"],
  ["15–25%, 02: 35–45%, 03: 60–70%, 04: 85–100%", "Golestan overlay timing contract"],
  ["media.currentTime = targetTime", "video currentTime scrub mapping"],
  ['<source src="/cinematic/fatikhan-hero.webm" type="video/webm" />', "WebM scrub source"],
  ['<source src="/cinematic/fatikhan-hero.mp4" type="video/mp4" />', "MP4 scrub fallback source"],
  ["if (reducedMotion || saveData) return;", "accessibility/data-saver fallback"],
  ['data-cinematic-runtime="golestan-scroll-cinematic-v2"', "healthy runtime release marker"],
  ['data-cinematic-fallback="figma-six-frame-v1"', "Figma six-frame fallback marker"],
  ['scene-01-descent.webp', "canonical fallback frame 01"],
  ['scene-02-reveal.webp', "canonical fallback frame 02"],
  ['scene-03-burst.webp', "canonical fallback frame 03"],
  ['scene-04-impact.webp', "canonical fallback frame 04"],
  ['scene-05-formula.webp', "canonical fallback frame 05"],
  ['scene-06-ritual.webp', "canonical fallback frame 06"],
  ['cinematic-stage-five', "fifth fallback stage"],
  ['cinematic-stage-six', "sixth fallback stage"],
];

for (const [needle, label] of required) {
  if (!hero.includes(needle)) throw new Error(`Locked cinematic invariant missing: ${label}`);
}

const forbiddenFallbackAssets = [
  "/editorial-hero.jpg",
  "/date-night-makeup-set.jpg",
  "/signature-collection-set.jpg",
];
for (const asset of forbiddenFallbackAssets) {
  if (hero.includes(asset)) {
    throw new Error(`Locked cinematic invariant violated: legacy fallback asset returned: ${asset}`);
  }
}

if (hero.includes("compactViewport") || /max-width:\s*767px/.test(hero)) {
  throw new Error("Locked cinematic invariant violated: viewport width disables scrub video");
}

const forbiddenCss = /@media\s*\(\s*max-width\s*:[^)]+\)[\s\S]{0,240}?\.cinematic-scrub-video\s*\{[^}]*display\s*:\s*none/i;
if (forbiddenCss.test(css)) {
  throw new Error("Locked cinematic invariant violated: mobile viewport CSS hides .cinematic-scrub-video");
}

if (!/@media\s*\(prefers-reduced-motion:reduce\)[\s\S]{0,220}?\.cinematic-scrub-video\s*\{[^}]*display\s*:\s*none/i.test(css)) {
  throw new Error("Accessibility fallback missing: reduced-motion must still disable scrub video");
}

console.log("FATIKHAN_CINEMATIC_RUNTIME_LOCK=PASS");
