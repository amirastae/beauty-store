import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "out");
const failures = [];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + "MB";
}

const files = walk(root).filter((file) => statSync(file).isFile());
const js = files.filter((file) => file.endsWith(".js"));
const css = files.filter((file) => file.endsWith(".css"));
const html = files.filter((file) => file.endsWith(".html"));

const total = files.reduce((sum, file) => sum + statSync(file).size, 0);
const jsTotal = js.reduce((sum, file) => sum + statSync(file).size, 0);
const jsMax = Math.max(0, ...js.map((file) => statSync(file).size));
const cssTotal = css.reduce((sum, file) => sum + statSync(file).size, 0);
const htmlMax = Math.max(0, ...html.map((file) => statSync(file).size));

const limits = {
  total: 4 * 1024 * 1024,
  jsTotal: 3 * 1024 * 1024,
  jsMax: 1.2 * 1024 * 1024,
  cssTotal: 150 * 1024,
  htmlMax: 100 * 1024
};

if (total > limits.total) failures.push(`static output ${mb(total)} exceeds ${mb(limits.total)}`);
if (jsTotal > limits.jsTotal) failures.push(`JS total ${mb(jsTotal)} exceeds ${mb(limits.jsTotal)}`);
if (jsMax > limits.jsMax) failures.push(`largest JS chunk ${mb(jsMax)} exceeds ${mb(limits.jsMax)}`);
if (cssTotal > limits.cssTotal) failures.push(`CSS total ${mb(cssTotal)} exceeds ${mb(limits.cssTotal)}`);
if (htmlMax > limits.htmlMax) failures.push(`largest HTML page ${mb(htmlMax)} exceeds ${mb(limits.htmlMax)}`);

if (failures.length) {
  console.error("Performance budget failed:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}

console.log(
  `Performance budget PASS: total=${mb(total)} js=${mb(jsTotal)} maxChunk=${mb(jsMax)} css=${mb(cssTotal)} maxHtml=${mb(htmlMax)}`
);
