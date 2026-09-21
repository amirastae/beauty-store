import type { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import CategoryProductsGrid from '@/components/category-products-grid'

export const metadata: Metadata = {
  title: 'فروشگاه',
  description: 'مرور کامل محصولات آرایشی، مراقبت پوست، مو، عطر و ست‌های زیبایی وِلورا.',
}

export default function Shop(){
  return <main className="min-h-screen bg-background">
    <Header/>
    <CategoryProductsGrid title="فروشگاه وِلورا" description="محصولات را مرور کنید و جزئیات هر محصول را ببینید"/>
    <Footer/>
  </main>
}
