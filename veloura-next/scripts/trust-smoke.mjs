import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const homePath = join(process.cwd(), "out", "index.html");
if (!existsSync(homePath)) {
  console.error("Trust smoke failed: out/index.html missing");
  process.exit(1);
}

const home = readFileSync(homePath, "utf8");
const forbidden = [
  "امتیاز جامعه",
  "بدون تست حیوانی",
  "ارسال رایگان برای سفارش‌های منتخب",
  "۲۴H",
  "24H",
  "آبرسانی سبک",
  "پرفروش"
];

const failures = forbidden.filter((value) => home.includes(value));

if (!home.includes("FATIKHAN")) failures.push("FATIKHAN missing from rendered homepage");
if (!home.includes("تجربه خرید فارسی")) failures.push("safe homepage commerce announcement missing");
if (!home.includes("درخواست عضویت")) failures.push("private-list request CTA missing");

if (failures.length) {
  console.error("Homepage trust smoke failed:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}

console.log("Homepage trust PASS: legacy seeded/social-proof claims absent from rendered homepage");
