import fs from "node:fs";
import path from "node:path";

const roots = ["src/app","src/components","src/data","src/store","src/hooks"];
const extraTargets = ["README.md","public/manifest.webmanifest"];
const failures = [];
const extensions = new Set([".ts",".tsx",".js",".jsx",".mjs",".json",".md",".webmanifest"]);
const ignored = new Set(["node_modules",".next","out"]);
let fatikhanCount = 0;

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    if (extensions.has(path.extname(dir)) || dir.endsWith(".webmanifest")) files.push(dir);
    return files;
  }
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir,entry.name);
    if (entry.isDirectory()) walk(full,files);
    else if (extensions.has(path.extname(entry.name)) || entry.name.endsWith(".webmanifest")) files.push(full);
  }
  return files;
}

const files=[
  ...new Set([
    ...roots.flatMap((root)=>walk(root)),
    ...extraTargets.filter((target)=>fs.existsSync(target))
  ])
];

const secretPatterns=[
  ["private key",/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["GitHub token",/(?:ghp_|github_pat_)[A-Za-z0-9_]{30,}/],
  ["Stripe live secret",/sk_live_[A-Za-z0-9]{16,}/],
  ["Google API key",/AIza[0-9A-Za-z_-]{30,}/],
  ["Cloudflare token assignment",/CLOUDFLARE_API_TOKEN\s*=\s*["'][^"']+["']/]
];

for (const file of files) {
  const text=fs.readFileSync(file,"utf8");
  const rel=file.replaceAll(path.sep,"/");
  fatikhanCount+=(text.match(/FATIKHAN/g)||[]).length;

  for (const [name,pattern] of secretPatterns) {
    if (pattern.test(text)) failures.push(`${name} detected in ${rel}`);
  }

  if (/href\s*=\s*["']#["']/.test(text)) failures.push(`dead href="#" in ${rel}`);
  if (/\b(?:TODO|FIXME)\b/.test(text)) failures.push(`unfinished marker in ${rel}`);
  if (/500K|Happy Customers|Verified Purchase|Founder & CEO|reviewsData/.test(text)) {
    failures.push(`unsupported social-proof residue in ${rel}`);
  }

  if (text.includes("VELOURA")) failures.push(`legacy VELOURA display brand in ${rel}`);
  if (text.includes("ولورا")) failures.push(`legacy Persian display brand in ${rel}`);
}

if (fatikhanCount < 10) failures.push("FATIKHAN display identity unexpectedly sparse");

console.log(JSON.stringify({
  filesChecked:files.length,
  fatikhanOccurrences:fatikhanCount,
  failures:failures.length
},null,2));

if (failures.length) {
  for (const item of [...new Set(failures)].slice(0,100)) console.error("FAIL:",item);
  console.error("Lowercase compatibility identifiers such as veloura-next and veloura-* storage/API keys are intentionally allowed.");
  process.exit(1);
}
console.log("FATIKHAN_SOURCE_AUDIT_PASS");
