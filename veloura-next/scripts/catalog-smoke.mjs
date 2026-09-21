import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "out", "product");
const failures = [];
const canonicals = new Set();
let checked = 0;

function check(condition, message) {
  if (!condition) failures.push(message);
}

check(existsSync(root), "product export directory is missing");

const dirs = existsSync(root)
  ? readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory())
  : [];

for (const entry of dirs) {
  const file = join(root, entry.name, "index.html");
  check(existsSync(file), `missing product HTML: ${entry.name}`);
  if (!existsSync(file)) continue;

  checked += 1;
  const html = readFileSync(file, "utf8");
  const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
  check(Boolean(canonicalMatch), `canonical missing: ${entry.name}`);
  if (canonicalMatch) {
    check(!canonicals.has(canonicalMatch[1]), `duplicate canonical: ${canonicalMatch[1]}`);
    canonicals.add(canonicalMatch[1]);
  }

  const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const parsed = [];
  for (const match of scripts) {
    try { parsed.push(JSON.parse(match[1])); }
    catch { failures.push(`invalid JSON-LD: ${entry.name}`); }
  }

  const product = parsed.find((item) => item?.["@type"] === "Product");
  check(Boolean(product), `Product JSON-LD missing: ${entry.name}`);
  if (!product) continue;

  check(typeof product.name === "string" && product.name.length > 0, `product name missing: ${entry.name}`);
  check(product.offers?.priceCurrency === "IRR", `currency must be IRR: ${entry.name}`);
  check(Number(product.offers?.price) > 0, `price must be positive: ${entry.name}`);
  check(product.offers?.availability === undefined, `availability must not be asserted without inventory truth: ${entry.name}`);

  const rating = Number(product.aggregateRating?.ratingValue);
  const reviews = Number(product.aggregateRating?.reviewCount);
  check(Number.isFinite(rating) && rating >= 0 && rating <= 5, `rating out of range: ${entry.name}`);
  check(Number.isInteger(reviews) && reviews >= 0, `reviewCount invalid: ${entry.name}`);
}

check(checked > 0, "no product pages checked");

if (failures.length) {
  console.error(`Catalog smoke failed: ${failures.length} issue(s)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Catalog smoke PASS: ${checked} product pages, ${canonicals.size} unique canonicals`);
