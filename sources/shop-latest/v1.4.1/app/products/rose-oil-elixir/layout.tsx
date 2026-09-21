import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/product/12' },
}

export default function LegacyProductLayout({children}:{children:React.ReactNode}){
  return children
}
