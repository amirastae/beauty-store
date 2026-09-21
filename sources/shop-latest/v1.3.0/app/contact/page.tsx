'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import { Mail, Send, ShieldCheck } from 'lucide-react'

export default function ContactPage() {
  const [formData,setFormData]=useState({name:'',email:'',message:''})

  return <div className="min-h-screen bg-background"><Header/>
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-3xl mb-12">
        <p className="text-primary text-sm mb-3">VELOURA SUPPORT</p>
        <h1 className="text-4xl md:text-5xl font-light mb-5">با ما در ارتباط باشید</h1>
        <p className="text-muted-foreground leading-8">فرم تماس و رابط پشتیبانی آماده است. endpoint ارسال پیام باید از backend فروشگاه متصل شود تا پیام‌ها واقعاً ثبت و پیگیری شوند.</p>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-8">
        <section className="bg-card border border-border rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6">پیام جدید</h2>
          <form className="space-y-4" onSubmit={event=>event.preventDefault()}>
            <label className="block">
              <span className="block text-sm font-medium mb-2">نام</span>
              <input value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} type="text" autoComplete="name" placeholder="نام شما" className="w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary"/>
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-2">ایمیل</span>
              <input value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} type="email" autoComplete="email" placeholder="name@example.com" className="w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary"/>
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-2">پیام</span>
              <textarea value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})} rows={6} placeholder="موضوع سوال یا درخواست خود را بنویسید..." className="w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary"/>
            </label>
            <button type="button" disabled className="w-full bg-muted text-muted-foreground py-3 rounded-full flex items-center justify-center gap-2 cursor-not-allowed">
              <Send className="w-4 h-4"/>ارسال پس از اتصال سرویس پشتیبانی فعال می‌شود
            </button>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="bg-card border border-border rounded-3xl p-6">
            <Mail className="w-7 h-7 text-primary mb-4"/>
            <h2 className="text-xl font-semibold mb-2">مسیر رسمی تماس</h2>
            <p className="text-muted-foreground leading-7">تا قبل از ثبت اطلاعات تجاری واقعی، شماره تلفن، ایمیل و آدرس ساختگی نمایش داده نمی‌شود.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-6">
            <ShieldCheck className="w-7 h-7 text-primary mb-4"/>
            <h2 className="text-xl font-semibold mb-2">راهنما و سیاست‌ها</h2>
            <div className="flex flex-col gap-3 mt-4 text-primary">
              <Link href="/support">مرکز راهنما</Link>
              <Link href="/policies/shipping">شرایط ارسال</Link>
              <Link href="/policies/returns">شرایط مرجوعی</Link>
              <Link href="/policies/privacy">حریم خصوصی</Link>
            </div>
          </div>
        </aside>
      </div>
    </main><Footer/></div>
}
