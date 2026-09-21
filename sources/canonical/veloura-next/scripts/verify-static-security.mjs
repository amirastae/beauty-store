import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const path=join(process.cwd(),"public","_headers");
if(!existsSync(path)){
  console.error("STATIC_SECURITY=FAIL public/_headers missing");
  process.exit(1);
}
const source=readFileSync(path,"utf8");
const required=[
  "X-Content-Type-Options: nosniff",
  "X-Frame-Options: DENY",
  "Referrer-Policy: strict-origin-when-cross-origin",
  "Permissions-Policy: camera=(), microphone=(), geolocation=()",
  "Cache-Control: public, max-age=31536000, immutable"
];
const missing=required.filter((value)=>!source.includes(value));
if(missing.length){
  console.error("STATIC_SECURITY=FAIL");
  missing.forEach((value)=>console.error("- missing "+value));
  process.exit(1);
}
console.log("STATIC_SECURITY=PASS");
