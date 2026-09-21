import type { MetadataRoute } from 'next'
import { ALL_PRODUCTS } from '@/lib/products'

export const dynamic = 'force-static'
const base='https://beauty-store.nayererohalamini.workers.dev'
const categories=['skincare-essentials','luxury-collections','trending-skincare','makeup-must-haves','best-sellers','sale-items','gift-sets']

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes=[
    '','/shop-all','/shop','/skincare','/makeup','/haircare','/fragrance','/wellness','/sets',
    '/about','/contact','/support','/terms','/policies/shipping','/policies/returns','/policies/privacy'
  ]
  const staticEntries=staticRoutes.map(path=>({
    url:base+path,
    changeFrequency:(path===''?'daily':'weekly') as 'daily'|'weekly',
    priority:path===''?1:.8,
  }))
  const categoryEntries=categories.map(slug=>({
    url:base+`/categories/${slug}`,
    changeFrequency:'weekly' as const,
    priority:.75,
  }))
  const productEntries=ALL_PRODUCTS.map(product=>({
    url:base+`/product/${product.id}`,
    changeFrequency:'weekly' as const,
    priority:.7,
  }))
  return [...staticEntries,...categoryEntries,...productEntries]
}
