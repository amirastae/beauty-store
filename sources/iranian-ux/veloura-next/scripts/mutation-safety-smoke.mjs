import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const targets = [
  "src/lib/commerce-verify.ts",
  "src/components/checkout/CheckoutShell.tsx"
];

const forbidden = [
  "/api/v1/carts",
  "/api/v1/checkout/",
  "/api/v1/payments/"
];

const failures = [];

for (const relative of targets) {
  const source = readFileSync(join(root, relative), "utf8");
  for (const token of forbidden) {
    if (source.includes(token)) {
      failures.push(relative + " contains forbidden mutation endpoint " + token);
    }
  }
}

const verifySource = readFileSync(join(root, "src/lib/commerce-verify.ts"), "utf8");
for (const required of [
  "/api/v1/compat/veloura-v2/resolve",
  "/api/v1/inventory/"
]) {
  if (!verifySource.includes(required)) {
    failures.push("read-only verification endpoint missing: " + required);
  }
}

if (failures.length) {
  console.error("Commerce mutation safety failed:");
  for (const failure of failures) console.error("- " + failure);
  console.error("Mutation checkout stays blocked until inventory/payment invariant issue #42 is resolved and runtime provider configuration is verified.");
  process.exit(1);
}

console.log("Commerce mutation safety PASS: frontend remains read-only against commerce-core");
