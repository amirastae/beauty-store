'use client'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { useState } from 'react'
import { useStore, formatToman } from '@/lib/store'
import { ALL_PRODUCTS } from '@/lib/products'
import Link from 'next/link'

export default function CheckoutPage(){
  const [step,setStep]=useState(1)
  const [done,setDone]=useState(false)
  const {cart,subtotal,clearCart}=useStore()
  if(done) return <div className="min-h-screen bg-background"><Header/>
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-5">✓</div>
      <h1 className="text-4xl font-light mb-4">سفارش با موفقیت ثبت شد</h1>
      <p className="text-muted-foreground mb-8">این نسخه نمایشی است؛ درگاه پرداخت واقعی در مرحله اتصال سرویس فروش فعال می‌شود.</p>
      <Link href="/shop-all" className="bg-primary text-primary-foreground px-7 py-3 rounded-full">بازگشت به فروشگاه</Link>
    </main><Footer/></div>

  return <div className="min-h-screen bg-background"><Header/>
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-light mb-8">تکمیل سفارش</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <section className="space-y-6">
          <div className="grid grid-cols-3 gap-3">{['نشانی','پرداخت','تأیید'].map((x,i)=><div key={x} className={`rounded-full py-3 text-center text-sm ${step===i+1?'bg-primary text-primary-foreground':'bg-muted'}`}>{x}</div>)}</div>
          {step===1&&<div className="bg-card border rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl">اطلاعات ارسال</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="px-4 py-3 bg-muted rounded-xl" placeholder="نام"/>
              <input className="px-4 py-3 bg-muted rounded-xl" placeholder="نام خانوادگی"/>
              <input className="sm:col-span-2 px-4 py-3 bg-muted rounded-xl" placeholder="شماره تماس"/>
              <input className="sm:col-span-2 px-4 py-3 bg-muted rounded-xl" placeholder="آدرس کامل"/>
              <input className="px-4 py-3 bg-muted rounded-xl" placeholder="شهر"/>
              <input className="px-4 py-3 bg-muted rounded-xl" placeholder="کد پستی"/>
            </div>
            <button onClick={()=>setStep(2)} className="w-full bg-primary text-primary-foreground py-3 rounded-full">ادامه به پرداخت</button>
          </div>}
          {step===2&&<div className="bg-card border rounded-2xl p-6 space-y-5">
            <h2 className="text-2xl">روش پرداخت</h2>
            <label className="flex gap-3 p-4 border rounded-xl"><input type="radio" defaultChecked name="pay"/><span>پرداخت آنلاین امن</span></label>
            <label className="flex gap-3 p-4 border rounded-xl"><input type="radio" name="pay"/><span>پرداخت در محل (در مناطق فعال)</span></label>
            <div className="flex gap-3"><button onClick={()=>setStep(1)} className="w-full border py-3 rounded-full">بازگشت</button><button onClick={()=>setStep(3)} className="w-full bg-primary text-primary-foreground py-3 rounded-full">بازبینی سفارش</button></div>
          </div>}
          {step===3&&<div className="bg-card border rounded-2xl p-6 space-y-5">
            <h2 className="text-2xl">تأیید نهایی</h2>
            <p className="text-muted-foreground">اطلاعات سفارش را بررسی کنید. پس از اتصال درگاه واقعی، این دکمه وارد پرداخت امن می‌شود.</p>
            <button disabled={!cart.length} onClick={()=>{clearCart();setDone(true)}} className="w-full bg-primary disabled:opacity-40 text-primary-foreground py-3 rounded-full">ثبت سفارش</button>
          </div>}
        </section>
        <aside className="bg-card border rounded-2xl p-6 h-fit">
          <h3 className="text-xl mb-5">سفارش شما</h3>
          <div className="space-y-3 max-h-80 overflow-auto">{cart.map(i=>{
            const p=ALL_PRODUCTS.find(x=>x.id===i.id)
            return p?<div key={i.id} className="flex gap-3 items-center"><img src={p.image} className="w-14 h-14 rounded-lg object-cover" alt=""/><div className="flex-1"><p className="text-sm">{p.name}</p><small className="text-muted-foreground">× {i.qty}</small></div><strong className="text-sm">{formatToman(p.price*i.qty)}</strong></div>:null
          })}</div>
          <div className="border-t mt-5 pt-5 flex justify-between"><span>مبلغ نهایی</span><strong className="text-primary">{formatToman(subtotal)}</strong></div>
        </aside>
      </div>
    </main><Footer/></div>
}
