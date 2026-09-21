import fs from "node:fs";
import path from "node:path";

const root=path.resolve("out");
const failures=[];
const exists=(p)=>fs.existsSync(path.join(root,p.replace(/^\//,"")));
const walk=(dir,ext,out=[])=>{
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(full,ext,out);
    else if(!ext||full.endsWith(ext)) out.push(full);
  }
  return out;
};
const routeExists=(pathname)=>{
  const clean=pathname.replace(/^\//,"").replace(/\/$/,"");
  if(!clean) return exists("index.html");
  return exists(clean)||exists(clean+".html")||exists(path.join(clean,"index.html"));
};
const internalPath=(value)=>{
  try{
    if(!value||value.startsWith("#")||value.startsWith("mailto:")||value.startsWith("tel:")) return null;
    if(/^[a-z][a-z0-9+.-]*:/i.test(value)) return null;
    if(!value.startsWith("/")) return null;
    return new URL(value,"https://fatikhan.invalid").pathname;
  }catch{return null;}
};

if(!fs.existsSync(root)){
  console.error("FATIKHAN_STATIC_AUDIT_FAIL: out/ missing");
  process.exit(1);
}

for(const required of [
  "index.html","shop/index.html","cart/index.html","checkout/index.html",
  "wishlist/index.html","robots.txt","sitemap.xml","manifest.webmanifest","_headers",
  "cinematic/fatikhan-cinematic.mp4","cinematic/fatikhan-cinematic.webm","cinematic/fatikhan-poster.jpg"
]){
  if(!exists(required)) failures.push(`missing required output: ${required}`);
}

const htmlFiles=walk(root,".html");
let routeRefs=0,assetRefs=0;
for(const file of htmlFiles){
  const html=fs.readFileSync(file,"utf8");
  const rel=path.relative(root,file).replaceAll(path.sep,"/");
  const route=rel==="index.html"?"/":"/"+rel.replace(/\/index\.html$/,"/").replace(/\.html$/,"/");

  for(const m of html.matchAll(/href="([^"]+)"/g)){
    const p=internalPath(m[1]);
    if(!p||p.startsWith("/_next/")) continue;
    routeRefs++;
    if(!routeExists(p)) failures.push(`broken internal route ${p} referenced by ${route}`);
  }

  for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    const p=internalPath(m[1]);
    if(!p) continue;
    if(p.startsWith("/_next/")||/\.(?:png|jpe?g|webp|svg|gif|css|js|ico|json|mp4|webm)$/i.test(p)){
      assetRefs++;
      if(!exists(p)) failures.push(`missing asset ${p} referenced by ${route}`);
    }
  }

  for(const img of html.match(/<img\b[^>]*>/gi)||[]){
    if(!/\balt=/.test(img)) failures.push(`image without alt on ${route}`);
  }

  for(const button of html.match(/<button\b[^>]*>[\s\S]*?<\/button>/gi)||[]){
    const open=button.match(/^<button\b([^>]*)>/i)?.[1]||"";
    const text=button.replace(/<[^>]+>/g,"").trim();
    if(!text&&!/aria-label=/.test(open)) failures.push(`button without accessible name on ${route}`);
  }

  if(html.includes("#site-content")&&!html.includes('id="site-content"')){
    failures.push(`skip-link target missing on ${route}`);
  }
}

const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
if(!home.includes("FATIKHAN")) failures.push("visible FATIKHAN brand missing from rendered home");
if(/>\s*(?:VELOURA|REHHA|LUXORA)\s*</i.test(home)) failures.push("legacy visible brand detected on rendered home");

const robots=fs.readFileSync(path.join(root,"robots.txt"),"utf8");
for(const p of ["/cart/","/checkout/","/wishlist/","/compare/","/recent/","/search/","/offline/"]){
  if(!robots.includes(`Disallow: ${p}`)) failures.push(`robots.txt missing Disallow: ${p}`);
}

const sitemap=fs.readFileSync(path.join(root,"sitemap.xml"),"utf8");
const sitemapUrls=(sitemap.match(/<url>/g)||[]).length;
if(sitemapUrls<10) failures.push(`sitemap unexpectedly small: ${sitemapUrls}`);

const headers=fs.readFileSync(path.join(root,"_headers"),"utf8");
for(const name of ["X-Content-Type-Options","Referrer-Policy","X-Frame-Options","Permissions-Policy","Cross-Origin-Opener-Policy"]){
  if(!headers.includes(name)) failures.push(`_headers missing ${name}`);
}

console.log(JSON.stringify({
  htmlFiles:htmlFiles.length,
  routeRefs,
  assetRefs,
  sitemapUrls,
  failures:failures.length
},null,2));

if(failures.length){
  for(const item of [...new Set(failures)].slice(0,100)) console.error("FAIL:",item);
  process.exit(1);
}
console.log("FATIKHAN_STATIC_AUDIT_PASS");
