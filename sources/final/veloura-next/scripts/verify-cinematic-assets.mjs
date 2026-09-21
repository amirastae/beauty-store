import { stat } from "node:fs/promises";
import { join } from "node:path";

const root = join(process.cwd(), "public", "cinematic");
const checks = [
  ["fatikhan-hero.mp4", 500_000, 25 * 1024 * 1024],
  ["fatikhan-hero.webm", 300_000, 25 * 1024 * 1024],
  ["fatikhan-poster.jpg", 10_000, 2 * 1024 * 1024],
];

for (const [name, min, max] of checks) {
  const path = join(root, name);
  const info = await stat(path);
  if (!info.isFile()) throw new Error(`${name} is not a file`);
  if (info.size < min) throw new Error(`${name} is unexpectedly small: ${info.size} bytes`);
  if (info.size > max) throw new Error(`${name} exceeds cinematic budget: ${info.size} bytes`);
  console.log(`cinematic asset OK: ${name} ${info.size} bytes`);
}

console.log("FATIKHAN_CINEMATIC_ASSETS=PASS");
