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
  ["media.currentTime = targetTime", "video currentTime scrub mapping"],
  ["setVideoEligible(!(reducedMotion || saveData || slowNetwork))", "mobile-safe eligibility rule"],
  ['["/cinematic/fatikhan-hero.webm", "/cinematic/fatikhan-hero.mp4"]', "WebM-first scrub source order"],
  ["sourceIndex + 1 < sources.length", "decode failure fallback from WebM to MP4"],
];

for (const [needle, label] of required) {
  if (!hero.includes(needle)) {
    throw new Error(`Locked cinematic invariant missing: ${label}`);
  }
}

const forbiddenCss = /@media\s*\(\s*max-width\s*:[^)]+\)[\s\S]{0,240}?\.cinematic-scrub-video\s*\{[^}]*display\s*:\s*none/i;
if (forbiddenCss.test(css)) {
  throw new Error("Locked cinematic invariant violated: mobile viewport CSS hides .cinematic-scrub-video");
}

if (!/@media\s*\(prefers-reduced-motion:reduce\)[\s\S]{0,220}?\.cinematic-scrub-video\s*\{[^}]*display\s*:\s*none/i.test(css)) {
  throw new Error("Accessibility fallback missing: reduced-motion must still disable scrub video");
}

console.log("FATIKHAN_CINEMATIC_RUNTIME_LOCK=PASS");
