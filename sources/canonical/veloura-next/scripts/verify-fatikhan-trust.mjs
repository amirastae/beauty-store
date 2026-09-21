import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root=process.cwd();
const homePath=join(root,"out","index.html");
const checkoutSource=readFileSync(join(root,"src","components","checkout","CheckoutShell.tsx"),"utf8");
const failures=[];

if(!existsSync(homePath)){
  failures.push("out/index.html missing");
}else{
  const home=readFileSync(homePath,"utf8");
  for(const claim of [
    "امتیاز جامعه",
    "بدون تست حیوانی",
    "ارسال رایگان برای سفارش‌های منتخب",
    "★ 4.",
    "★ 5.",
    "پرفروش"
  ]){
    if(home.includes(claim)) failures.push("rendered homepage contains unsupported claim: "+claim);
  }
  if(!home.includes("FATIKHAN")) failures.push("FATIKHAN missing from rendered homepage");
}

if(/payment===["']success["'][\s\S]{0,220}clearCart\s*\(/.test(checkoutSource)){
  failures.push("checkout clears cart based only on payment=success query state");
}
if(checkoutSource.includes("پرداخت با موفقیت تأیید شد.")){
  failures.push("checkout overstates query-string payment return as authoritative verification");
}

if(failures.length){
  console.error("FATIKHAN trust invariant failed:");
  failures.forEach((f)=>console.error("- "+f));
  process.exit(1);
}
console.log("FATIKHAN_TRUST=PASS");
