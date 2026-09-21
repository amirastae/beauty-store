import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/fragrance' },
}

export default function RouteLayout({children}:{children:React.ReactNode}){
  return children
}
