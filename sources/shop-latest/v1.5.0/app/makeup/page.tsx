import type { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import CategoryProductsGrid from '@/components/category-products-grid'

export const metadata: Metadata = {
  title: 'آرایش',
  description: 'محصولات منتخب آرایشی وِلورا با قیمت و اطلاعات محصول.',
}

export default function Makeup(){
  return <main className="min-h-screen bg-background">
    <Header/>
    <CategoryProductsGrid category="makeup" title="کالکشن آرایش" description="محصولات آرایشی منتخب برای یک نتیجه تمیز و حرفه‌ای"/>
    <Footer/>
  </main>
}
