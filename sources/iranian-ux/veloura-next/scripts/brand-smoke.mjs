import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const targets = [join(root, "src"), join(root, "README.md")];
const failures = [];
let fatikhanCount = 0;

function filesUnder(path) {
  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return [path];
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) =>
    filesUnder(join(path, entry.name))
  );
}

for (const file of targets.flatMap(filesUnder)) {
  if (!/\.(?:ts|tsx|js|mjs|md)$/.test(file)) continue;
  const source = readFileSync(file, "utf8");
  if (source.includes("VELOURA")) failures.push(file + " contains legacy VELOURA display brand");
  if (source.includes("ولورا")) failures.push(file + " contains legacy Persian display brand");
  fatikhanCount += (source.match(/FATIKHAN/g) || []).length;
}

if (fatikhanCount < 10) failures.push("FATIKHAN display brand unexpectedly missing or too sparse");

if (failures.length) {
  console.error("Brand identity check failed:");
  for (const failure of failures) console.error("- " + failure);
  console.error("Technical lowercase identifiers such as veloura-next, veloura-* storage keys and /compat/veloura-v2 are intentionally allowed.");
  process.exit(1);
}

console.log(`Brand identity PASS: FATIKHAN occurrences=${fatikhanCount}; legacy display brand absent`);
