import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/shop-all' },
}

export default function RouteLayout({children}:{children:React.ReactNode}){
  return children
}
