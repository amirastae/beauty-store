import type { Metadata } from 'next'
import './globals.css'
import { StoreProvider } from '@/lib/store'

export const metadata: Metadata = {
  metadataBase: new URL('https://beauty-store.nayererohalamini.workers.dev'),
  title: {
    default: 'VELOURA | فروشگاه تخصصی زیبایی',
    template: '%s | VELOURA',
  },
  description: 'فروشگاه آنلاین آرایش، مراقبت پوست، مو، عطر و ست‌های زیبایی با تجربه‌ای لوکس، سریع و فارسی.',
  keywords: ['لوازم آرایشی','مراقبت پوست','عطر','مراقبت مو','فروشگاه زیبایی','VELOURA'],
  authors: [{ name: 'VELOURA' }],
  creator: 'VELOURA',
  publisher: 'VELOURA',
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'VELOURA',
    title: 'VELOURA | زیبایی، با امضای تو',
    description: 'آرایش، مراقبت پوست، مو و عطر در یک تجربه خرید لوکس و سریع.',
    images: [{ url: '/cosmetics-premium-banner.jpg', width: 1200, height: 630, alt: 'VELOURA Beauty' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VELOURA | فروشگاه تخصصی زیبایی',
    description: 'آرایش، مراقبت پوست، مو و عطر در یک تجربه خرید لوکس و سریع.',
    images: ['/cosmetics-premium-banner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: { icon: '/icon.svg' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-lg">پرش به محتوای اصلی</a>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
