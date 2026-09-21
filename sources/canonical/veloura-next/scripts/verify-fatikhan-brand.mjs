import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root=process.cwd();
const targets=[join(root,"src"),join(root,"README.md"),join(root,"public","manifest.webmanifest")];
const failures=[];
let fatikhanCount=0;

function filesUnder(path){
  if(!existsSync(path)) return [];
  if(statSync(path).isFile()) return [path];
  return readdirSync(path,{withFileTypes:true}).flatMap((entry)=>filesUnder(join(path,entry.name)));
}

for(const file of targets.flatMap(filesUnder)){
  if(!/\.(?:ts|tsx|js|mjs|md|webmanifest)$/.test(file)) continue;
  const source=readFileSync(file,"utf8");
  if(source.includes("VELOURA")) failures.push(file+" contains legacy VELOURA display brand");
  if(source.includes("ولورا")) failures.push(file+" contains legacy Persian display brand");
  fatikhanCount+=(source.match(/FATIKHAN/g)||[]).length;
}

if(fatikhanCount<10) failures.push("FATIKHAN display identity unexpectedly sparse");
if(failures.length){
  console.error("FATIKHAN brand invariant failed:");
  failures.forEach((f)=>console.error("- "+f));
  console.error("Lowercase compatibility identifiers such as veloura-next and veloura-* storage/API keys are intentionally allowed.");
  process.exit(1);
}
console.log("FATIKHAN_BRAND=PASS occurrences="+fatikhanCount);
