import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import { User, Heart, ShoppingBag, ShieldCheck } from 'lucide-react'

export default function AccountPage() {
  return <div className="min-h-screen bg-background flex flex-col"><Header/>
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <User className="w-12 h-12 mx-auto text-primary mb-4"/>
        <h1 className="text-4xl md:text-5xl font-light mb-4">حساب کاربری</h1>
        <p className="text-muted-foreground leading-8">بخش حساب برای سفارش‌ها، علاقه‌مندی‌ها و اطلاعات کاربر آماده شده است. سرویس احراز هویت باید از هسته امن فروشگاه متصل شود.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Link href="/cart" className="border border-border rounded-2xl p-6 text-center hover:border-primary transition">
          <ShoppingBag className="w-7 h-7 mx-auto mb-3 text-primary"/><span className="font-medium">سبد خرید</span>
        </Link>
        <Link href="/wishlist" className="border border-border rounded-2xl p-6 text-center hover:border-primary transition">
          <Heart className="w-7 h-7 mx-auto mb-3 text-primary"/><span className="font-medium">علاقه‌مندی‌ها</span>
        </Link>
        <Link href="/support" className="border border-border rounded-2xl p-6 text-center hover:border-primary transition">
          <ShieldCheck className="w-7 h-7 mx-auto mb-3 text-primary"/><span className="font-medium">پشتیبانی</span>
        </Link>
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        <Link href="/login" className="px-7 py-3 bg-primary text-primary-foreground rounded-full">ورود</Link>
        <Link href="/signup" className="px-7 py-3 border border-border rounded-full">ثبت‌نام</Link>
      </div>
    </main><Footer/></div>
}
