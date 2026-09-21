import fs from 'node:fs'
import path from 'node:path'

const roots = ['app','components','lib','hooks']
const failures = []
const extensions = new Set(['.ts','.tsx','.js','.jsx','.mjs','.json','.css'])
const ignored = new Set(['node_modules','.next','out'])

function walk(dir, files=[]){
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    if (ignored.has(entry.name)) continue
    const full=path.join(dir,entry.name)
    if (entry.isDirectory()) walk(full,files)
    else if (extensions.has(path.extname(entry.name))) files.push(full)
  }
  return files
}

const secretPatterns = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['GitHub classic token', /ghp_[A-Za-z0-9]{30,}/],
  ['GitHub fine-grained token', /github_pat_[A-Za-z0-9_]{30,}/],
  ['Stripe live secret', /sk_live_[A-Za-z0-9]{16,}/],
  ['Google API key', /AIza[0-9A-Za-z_-]{30,}/],
  ['Cloudflare token assignment', /CLOUDFLARE_API_TOKEN\s*=\s*["'][^"']+["']/],
]

for (const file of roots.flatMap(root=>walk(root))) {
  const text=fs.readFileSync(file,'utf8')
  const rel=file.replaceAll(path.sep,'/')

  for (const [name,pattern] of secretPatterns) {
    if (pattern.test(text)) failures.push(`${name} detected in ${rel}`)
  }

  if (/href\s*=\s*["']#["']/.test(text)) failures.push(`dead href="#" in ${rel}`)
  if (/\b(?:REHHA|LUXORA|Luxora)\b/.test(text)) failures.push(`donor brand residue in executable source: ${rel}`)
  if (/\b(?:TODO|FIXME)\b/.test(text)) failures.push(`unfinished marker in ${rel}`)
  if (/\$\{[^}]*price|\$[0-9]/.test(text)) failures.push(`dollar price residue in ${rel}`)
}

console.log(JSON.stringify({filesChecked: roots.flatMap(root=>walk(root)).length, failures: failures.length},null,2))
if (failures.length) {
  for (const item of [...new Set(failures)].slice(0,100)) console.error('FAIL:',item)
  process.exit(1)
}
console.log('SOURCE_AUDIT_PASS')
