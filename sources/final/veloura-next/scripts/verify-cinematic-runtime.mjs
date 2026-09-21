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
  ["media.currentTime = targetTime", "video currentTime scrub mapping"],
  ['<source src="/cinematic/fatikhan-hero.webm" type="video/webm" />', "WebM scrub source"],
  ['<source src="/cinematic/fatikhan-hero.mp4" type="video/mp4" />', "MP4 scrub fallback source"],
  ["if (reducedMotion || saveData) return;", "accessibility/data-saver fallback"],
];

for (const [needle, label] of required) {
  if (!hero.includes(needle)) throw new Error(`Locked cinematic invariant missing: ${label}`);
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
