import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(process.cwd(), "out");
const failures = [];
let linksChecked = 0;
let pagesChecked = 0;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function targetExists(pathname) {
  const clean = decodeURIComponent(pathname);
  if (clean === "/") return existsSync(join(root, "index.html"));
  const rel = clean.replace(/^\/+/, "");
  const candidates = clean.endsWith("/")
    ? [join(root, rel, "index.html")]
    : [join(root, rel), join(root, rel + ".html"), join(root, rel, "index.html")];
  return candidates.some((file) => existsSync(file) && statSync(file).isFile());
}

const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));

for (const file of htmlFiles) {
  pagesChecked += 1;
  const html = readFileSync(file, "utf8");
  const hrefs = [...html.matchAll(/\bhref=(["'])(.*?)\1/gi)].map((match) =>
    match[2].replaceAll("&amp;", "&")
  );

  for (const href of hrefs) {
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:") ||
      href.startsWith("data:")
    ) continue;

    if (/^https?:\/\//i.test(href) || href.startsWith("//")) continue;

    let url;
    try {
      url = new URL(href, "https://veloura.local");
    } catch {
      failures.push(`${relative(root, file)} has invalid href: ${href}`);
      continue;
    }

    if (url.origin !== "https://veloura.local") continue;
    if (url.pathname.startsWith("/_next/")) continue;

    linksChecked += 1;
    if (!targetExists(url.pathname)) {
      failures.push(`${relative(root, file)} -> missing ${url.pathname}`);
    }
  }
}

if (failures.length) {
  console.error(`Link smoke failed: ${failures.length} broken links across ${pagesChecked} pages`);
  for (const failure of [...new Set(failures)]) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Link smoke PASS: ${linksChecked} internal links across ${pagesChecked} pages`);
