import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const source = join(process.cwd(), "public", "_headers");
const built = join(process.cwd(), "out", "_headers");
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

check(existsSync(source), "public/_headers missing");
check(existsSync(built), "out/_headers missing after static export");

const text = existsSync(built) ? readFileSync(built, "utf8") : "";
for (const header of [
  "X-Content-Type-Options: nosniff",
  "X-Frame-Options: DENY",
  "Referrer-Policy: strict-origin-when-cross-origin",
  "Permissions-Policy: camera=(), microphone=(), geolocation=()",
  "X-Permitted-Cross-Domain-Policies: none"
]) {
  check(text.includes(header), "missing security header: " + header);
}

check(text.includes("/_next/static/*"), "immutable cache rule path missing");
check(text.includes("Cache-Control: public, max-age=31536000, immutable"), "immutable cache header missing");

if (failures.length) {
  console.error("Security smoke failed:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}

console.log("Security smoke PASS: Cloudflare security and immutable asset headers present");
