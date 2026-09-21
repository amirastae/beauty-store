'use client'

import Link from 'next/link'
import { Mail, Lock, User, ShieldCheck } from 'lucide-react'

export default function SignupPage() {
  return <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-xl border border-border">
      <div className="text-center mb-8">
        <Link href="/" className="text-4xl font-bold text-primary">VELOURA</Link>
        <h1 className="text-2xl font-semibold mt-5">ساخت حساب کاربری</h1>
        <p className="text-muted-foreground mt-2">فرم ثبت‌نام آماده است؛ ایجاد حساب پس از اتصال سرویس احراز هویت فعال می‌شود.</p>
      </div>

      <form className="space-y-5" onSubmit={(event)=>event.preventDefault()}>
        <label className="block">
          <span className="block text-sm font-semibold mb-2">نام و نام خانوادگی</span>
          <span className="relative block">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
            <input type="text" autoComplete="name" placeholder="نام شما" className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary"/>
          </span>
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-2">ایمیل</span>
          <span className="relative block">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
            <input type="email" autoComplete="email" placeholder="name@example.com" className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary"/>
          </span>
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-2">رمز عبور</span>
          <span className="relative block">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
            <input type="password" autoComplete="new-password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary"/>
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1"/>
          <span>با <Link href="/terms" className="text-primary hover:underline">شرایط استفاده</Link> و <Link href="/policies/privacy" className="text-primary hover:underline">حریم خصوصی</Link> موافقم.</span>
        </label>
        <button type="button" disabled className="w-full py-3 rounded-xl bg-muted text-muted-foreground cursor-not-allowed">اتصال سرویس حساب در حال آماده‌سازی</button>
      </form>

      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="w-4 h-4"/>اطلاعات حساب باید توسط backend امن پردازش شود.</div>
      <p className="text-center text-muted-foreground mt-6">قبلاً حساب ساخته‌اید؟ <Link href="/login" className="text-primary font-semibold hover:underline">ورود</Link></p>
      <p className="text-center mt-4"><Link href="/" className="text-sm text-muted-foreground hover:text-foreground">بازگشت به فروشگاه</Link></p>
    </div>
  </main>
}
