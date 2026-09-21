import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "out");
const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function read(relativePath) {
  const file = join(root, relativePath);
  check(existsSync(file), `missing output: ${relativePath}`);
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

const home = read("index.html");
check(home.includes('lang="fa"'), "home must declare lang=fa");
check(home.includes('dir="rtl"'), "home must declare dir=rtl");

const routine = read("routine/index.html");
check(routine.includes('rel="canonical"'), "routine canonical missing");
check(routine.toLowerCase().includes('name="description"'), "routine meta description missing");

const shop = read("shop/index.html");
check(shop.includes('rel="canonical"'), "shop canonical missing");
check(shop.includes("/shop/"), "shop canonical target missing");
check(shop.toLowerCase().includes('name="description"'), "shop meta description missing");

for (const route of ["cart", "checkout", "wishlist", "compare"]) {
  const html = read(`${route}/index.html`).toLowerCase();
  check(html.includes("noindex"), `${route} must be noindex`);
}

const productRoot = join(root, "product");
check(existsSync(productRoot), "product output directory missing");
const productDirs = existsSync(productRoot)
  ? readdirSync(productRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory())
  : [];

check(productDirs.length > 0, "no product pages were exported");
for (const entry of productDirs) {
  const html = read(`product/${entry.name}/index.html`);
  check(html.includes('rel="canonical"'), `canonical missing for product/${entry.name}`);
  check(html.includes('"@type":"Product"'), `Product JSON-LD missing for product/${entry.name}`);
  check(html.includes('"@type":"BreadcrumbList"'), `Breadcrumb JSON-LD missing for product/${entry.name}`);
}

const sitemap = read("sitemap.xml");
check(sitemap.includes("/shop/"), "sitemap must include shop");
for (const blocked of ["/cart/", "/checkout/", "/wishlist/", "/compare/"]) {
  check(!sitemap.includes(blocked), `sitemap must exclude ${blocked}`);
}

const robots = read("robots.txt");
for (const utility of ["/cart/", "/checkout/", "/wishlist/", "/compare/"]) {
  check(!robots.includes("Disallow: " + utility), `robots must allow crawling ${utility} so meta noindex can be seen`);
}
check(robots.includes("Allow: /"), "robots should allow normal crawling");
check(robots.includes("sitemap.xml"), "robots sitemap declaration missing");

if (failures.length) {
  console.error(`SEO smoke failed: ${failures.length}/${checks} checks failed`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO smoke PASS: ${checks} checks across ${productDirs.length} product pages`);
