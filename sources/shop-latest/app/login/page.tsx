'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [showPassword,setShowPassword]=useState(false)

  return <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-md bg-card rounded-3xl p-8 shadow-xl border border-border">
      <div className="text-center mb-8">
        <Link href="/" className="text-4xl font-bold text-primary">VELOURA</Link>
        <h1 className="text-2xl font-semibold mt-5">ورود به حساب کاربری</h1>
        <p className="text-muted-foreground mt-2">رابط ورود آماده است؛ سرویس احراز هویت باید از هسته فروشگاه متصل شود.</p>
      </div>

      <form className="space-y-5" onSubmit={(event)=>event.preventDefault()}>
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
            <input type={showPassword?'text':'password'} autoComplete="current-password" placeholder="••••••••" className="w-full pl-12 pr-12 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary"/>
            <button type="button" aria-label={showPassword?'مخفی کردن رمز عبور':'نمایش رمز عبور'} onClick={()=>setShowPassword(v=>!v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}
            </button>
          </span>
        </label>

        <div className="flex items-center justify-between gap-4 text-sm">
          <Link href="/support" className="text-primary hover:underline">بازیابی دسترسی</Link>
          <span className="flex items-center gap-1 text-muted-foreground"><ShieldCheck className="w-4 h-4"/>ورود امن</span>
        </div>

        <button type="button" disabled className="w-full py-3 rounded-xl bg-muted text-muted-foreground cursor-not-allowed">اتصال سرویس حساب در حال آماده‌سازی</button>
      </form>

      <p className="text-center text-muted-foreground mt-6">حساب ندارید؟ <Link href="/signup" className="text-primary font-semibold hover:underline">ثبت‌نام</Link></p>
      <p className="text-center mt-4"><Link href="/" className="text-sm text-muted-foreground hover:text-foreground">بازگشت به فروشگاه</Link></p>
    </div>
  </main>
}
