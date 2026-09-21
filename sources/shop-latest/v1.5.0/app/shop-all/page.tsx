import type { Metadata } from 'next'
import Header from '@/components/header'
import Footer from '@/components/footer'
import CategoryProductsGrid from '@/components/category-products-grid'

export const metadata: Metadata = {
  title: 'همه محصولات',
  description: 'تمام محصولات زیبایی وِلورا را در یک صفحه مرور کنید.',
}

export default function ShopAll(){
  return <main className="min-h-screen bg-background">
    <Header/>
    <CategoryProductsGrid title="همه محصولات" description="تمام کالکشن زیبایی وِلورا را یک‌جا ببینید"/>
    <Footer/>
  </main>
}
