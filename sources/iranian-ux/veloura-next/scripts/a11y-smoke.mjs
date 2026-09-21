import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(process.cwd(), "out");
const failures = [];
let pages = 0;
let buttons = 0;
let images = 0;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function textContent(value) {
  return value.replace(/<[^>]*>/g, "").replace(/&[a-z#0-9]+;/gi, " ").trim();
}

const files = walk(root).filter((file) => file.endsWith(".html") && !file.includes("/404/") && !file.endsWith("/404.html"));

for (const file of files) {
  pages += 1;
  const html = readFileSync(file, "utf8");
  const name = relative(root, file);

  if (!/<html[^>]*\blang="fa"/i.test(html)) failures.push(`${name}: lang=fa missing`);
  if (!/<html[^>]*\bdir="rtl"/i.test(html)) failures.push(`${name}: dir=rtl missing`);

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) failures.push(`${name}: expected 1 h1, found ${h1Count}`);

  const viewport = html.match(/<meta[^>]*name="viewport"[^>]*content="([^"]+)"/i)?.[1] ?? "";
  if (/user-scalable\s*=\s*no/i.test(viewport) || /maximum-scale\s*=\s*1(?:\.0)?(?:,|$)/i.test(viewport)) {
    failures.push(`${name}: viewport restricts zoom`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    images += 1;
    if (!/\balt=(["']).*?\1/i.test(match[0])) failures.push(`${name}: img without alt`);
  }

  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    buttons += 1;
    const attrs = match[1];
    const label = textContent(match[2]);
    if (!label && !/\baria-label=(["']).+?\1/i.test(attrs) && !/\btitle=(["']).+?\1/i.test(attrs)) {
      failures.push(`${name}: button without accessible name`);
    }
  }

  const ids = [...html.matchAll(/\bid="([^"]+)"/gi)].map((match) => match[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) failures.push(`${name}: duplicate id "${id}"`);
    seen.add(id);
  }
}

if (!existsSync(root)) failures.push("static output directory missing");

if (failures.length) {
  console.error(`A11y smoke failed: ${failures.length} issue(s) across ${pages} pages`);
  for (const failure of [...new Set(failures)]) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`A11y smoke PASS: ${pages} pages, ${images} images, ${buttons} buttons`);
