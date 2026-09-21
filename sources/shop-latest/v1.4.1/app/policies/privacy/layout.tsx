import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/policies/privacy' },
}

export default function RouteLayout({children}:{children:React.ReactNode}){
  return children
}
