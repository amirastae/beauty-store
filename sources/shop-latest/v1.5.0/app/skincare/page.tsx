import type { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import CategoryProductsGrid from '@/components/category-products-grid'

export const metadata: Metadata = {
  title: 'مراقبت پوست',
  description: 'محصولات منتخب مراقبت پوست، ترکیبات و روش مصرف در فروشگاه وِلورا.',
}

export default function Skincare(){
  return <main className="min-h-screen bg-background">
    <Header/>
    <CategoryProductsGrid category="skincare" title="کالکشن مراقبت پوست" description="منتخبی از محصولات مراقبت روزانه و روتین پوستی"/>
    <Footer/>
  </main>
}
