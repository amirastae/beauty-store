import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout/','/cart/','/account/','/login/','/signup/','/wishlist/'],
    },
    sitemap: 'https://beauty-store.nayererohalamini.workers.dev/sitemap.xml',
    host: 'https://beauty-store.nayererohalamini.workers.dev',
  }
}
