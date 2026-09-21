import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('out')
const failures = []
const warnings = []

const exists = (p) => fs.existsSync(path.join(root, p.replace(/^\//, '')))
const walk = (dir, ext, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, ext, out)
    else if (!ext || full.endsWith(ext)) out.push(full)
  }
  return out
}
const routeExists = (pathname) => {
  const clean = pathname.replace(/^\//, '').replace(/\/$/, '')
  if (!clean) return exists('index.html')
  return exists(clean) || exists(clean + '.html') || exists(path.join(clean, 'index.html'))
}
const internalPath = (value) => {
  try {
    if (!value || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:')) return null
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null
    if (!value.startsWith('/')) return null
    return new URL(value, 'https://veloura.invalid').pathname
  } catch { return null }
}

if (!fs.existsSync(root)) {
  console.error('STATIC_AUDIT_FAIL: out/ does not exist')
  process.exit(1)
}

for (const required of ['index.html', 'robots.txt', 'sitemap.xml', '_headers']) {
  if (!exists(required)) failures.push(`missing required output: ${required}`)
}

const htmlFiles = walk(root, '.html')
let routeRefs = 0
let assetRefs = 0
let checkedCanonical = 0
const noIndexRoots = new Set(['account','cart','checkout','login','signup','wishlist'])

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8')
  const rel = path.relative(root, file).replaceAll(path.sep, '/')
  const route = rel === 'index.html' ? '/' : '/' + rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '/')

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const p = internalPath(match[1])
    if (!p || p.startsWith('/_next/')) continue
    routeRefs++
    if (!routeExists(p)) failures.push(`broken internal route ${p} referenced by ${route}`)
  }

  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const p = internalPath(match[1])
    if (!p) continue
    if (p.startsWith('/_next/') || /\.(?:png|jpe?g|webp|svg|gif|css|js|ico|json)$/i.test(p)) {
      assetRefs++
      if (!exists(p)) failures.push(`missing asset ${p} referenced by ${route}`)
    }
  }

  for (const img of html.match(/<img\b[^>]*>/gi) || []) {
    if (!/\balt=/.test(img)) failures.push(`image without alt on ${route}`)
  }

  for (const button of html.match(/<button\b[^>]*>[\s\S]*?<\/button>/gi) || []) {
    const open = button.match(/^<button\b([^>]*)>/i)?.[1] || ''
    const text = button.replace(/<[^>]+>/g, '').trim()
    if (!text && !/aria-label=/.test(open)) failures.push(`button without accessible name on ${route}`)
  }

  if (html.includes('#main-content') && !html.includes('id="main-content"')) {
    failures.push(`skip-link target missing on ${route}`)
  }

  const first = route.split('/').filter(Boolean)[0] || ''
  const is404 = route.includes('404') || route.includes('_not-found')
  if (!is404 && !noIndexRoots.has(first)) {
    checkedCanonical++
    if (!/<link rel="canonical" href="[^"]+"/.test(html)) failures.push(`missing canonical on ${route}`)
  }

  const forbidden = [
    /500K|Happy Customers|Verified Purchase|Founder & CEO|reviewsData/,
    /\$\{[^}]*price|\$[0-9]/
  ]
  for (const pattern of forbidden) if (pattern.test(html)) failures.push(`forbidden donor/fake residue on ${route}: ${pattern}`)
}

const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8')
for (const p of ['/checkout/','/cart/','/account/','/login/','/signup/','/wishlist/']) {
  if (!robots.includes(`Disallow: ${p}`)) failures.push(`robots.txt missing Disallow: ${p}`)
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8')
const sitemapCount = (sitemap.match(/<url>/g) || []).length
if (sitemapCount < 70) failures.push(`sitemap unexpectedly small: ${sitemapCount} URLs`)

const headers = fs.readFileSync(path.join(root, '_headers'), 'utf8')
for (const header of ['Content-Security-Policy','X-Content-Type-Options','Referrer-Policy','Permissions-Policy']) {
  if (!headers.includes(header)) failures.push(`_headers missing ${header}`)
}

console.log(JSON.stringify({
  htmlFiles: htmlFiles.length,
  routeRefs,
  assetRefs,
  canonicalPagesChecked: checkedCanonical,
  sitemapUrls: sitemapCount,
  failures: failures.length,
  warnings: warnings.length
}, null, 2))

if (failures.length) {
  for (const item of [...new Set(failures)].slice(0, 100)) console.error('FAIL:', item)
  process.exit(1)
}
console.log('STATIC_AUDIT_PASS')
