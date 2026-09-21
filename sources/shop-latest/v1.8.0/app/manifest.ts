import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VELOURA Beauty Store',
    short_name: 'VELOURA',
    description: 'فروشگاه فارسی محصولات زیبایی وِلورا',
    start_url: '/',
    display: 'standalone',
    background_color: '#160f15',
    theme_color: '#160f15',
    lang: 'fa',
    dir: 'rtl',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
