import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/product/2' },
}

export default function LegacyProductLayout({children}:{children:React.ReactNode}){
  return children
}
