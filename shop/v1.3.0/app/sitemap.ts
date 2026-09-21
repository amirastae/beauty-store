import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'
import { ALL_PRODUCTS } from '@/lib/products'

const base='https://beauty-store.nayererohalamini.workers.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes=['','/shop-all','/skincare','/makeup','/haircare','/fragrance','/wellness','/sets','/about','/contact']
  const staticEntries=staticRoutes.map((path)=>({
    url: base+path,
    lastModified: new Date(),
    changeFrequency: path==='' ? 'daily' as const : 'weekly' as const,
    priority: path==='' ? 1 : .8,
  }))
  const productEntries=ALL_PRODUCTS.map((p)=>({
    url: base+`/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: .7,
  }))
  return [...staticEntries,...productEntries]
}
