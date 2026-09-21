'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { useStore, formatToman } from '@/lib/store'
import { ALL_PRODUCTS } from '@/lib/products'

type Shipping={firstName:string;lastName:string;phone:string;address:string;city:string;postal:string}

export default function CheckoutPage(){
  const [step,setStep]=useState(1)
  const [error,setError]=useState('')
  const [shipping,setShipping]=useState<Shipping>({firstName:'',lastName:'',phone:'',address:'',city:'',postal:''})
  const {cart,subtotal}=useStore()

  const update=(key:keyof Shipping,value:string)=>setShipping(current=>({...current,[key]:value}))
  const continueToPayment=()=>{
    const complete=Object.values(shipping).every(value=>value.trim().length>0)
    if(!complete){setError('برای ادامه، تمام اطلاعات ارسال را کامل کنید.');return}
    setError('')
    setStep(2)
  }

  if(!cart.length){
    return <div className="min-h-screen bg-background"><Header/>
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-light mb-4">سبد خرید خالی است</h1>
        <p className="text-muted-foreground mb-7">برای تکمیل سفارش ابتدا محصولی به سبد اضافه کنید.</p>
        <Link href="/shop-all" className="inline-block bg-primary text-primary-foreground px-7 py-3 rounded-full">مشاهده محصولات</Link>
      </main><Footer/></div>
  }

  return <div className="min-h-screen bg-background"><Header/>
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-primary text-sm mb-2">VELOURA CHECKOUT</p>
        <h1 className="text-4xl font-light">تکمیل سفارش</h1>
      </div>
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <section className="space-y-6">
          <div className="grid grid-cols-3 gap-3">{['نشانی','روش پرداخت','تأیید'].map((label,index)=><div key={label} className={`rounded-full py-3 text-center text-sm ${step===index+1?'bg-primary text-primary-foreground':'bg-muted'}`}>{label}</div>)}</div>

          {step===1&&<div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl">اطلاعات ارسال</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input value={shipping.firstName} onChange={e=>update('firstName',e.target.value)} className="px-4 py-3 bg-muted rounded-xl" placeholder="نام" autoComplete="given-name"/>
              <input value={shipping.lastName} onChange={e=>update('lastName',e.target.value)} className="px-4 py-3 bg-muted rounded-xl" placeholder="نام خانوادگی" autoComplete="family-name"/>
              <input value={shipping.phone} onChange={e=>update('phone',e.target.value)} className="sm:col-span-2 px-4 py-3 bg-muted rounded-xl" placeholder="شماره تماس" inputMode="tel" autoComplete="tel"/>
              <input value={shipping.address} onChange={e=>update('address',e.target.value)} className="sm:col-span-2 px-4 py-3 bg-muted rounded-xl" placeholder="آدرس کامل" autoComplete="street-address"/>
              <input value={shipping.city} onChange={e=>update('city',e.target.value)} className="px-4 py-3 bg-muted rounded-xl" placeholder="شهر" autoComplete="address-level2"/>
              <input value={shipping.postal} onChange={e=>update('postal',e.target.value)} className="px-4 py-3 bg-muted rounded-xl" placeholder="کد پستی" autoComplete="postal-code"/>
            </div>
            {error&&<p className="text-sm text-destructive">{error}</p>}
            <button type="button" onClick={continueToPayment} className="w-full bg-primary text-primary-foreground py-3 rounded-full">ادامه به روش پرداخت</button>
          </div>}

          {step===2&&<div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-2xl">روش پرداخت</h2>
            <div className="border border-dashed border-border rounded-2xl p-5 flex gap-3">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0"/>
              <div><p className="font-medium">درگاه پرداخت هنوز به این snapshot متصل نشده است.</p><p className="text-sm text-muted-foreground mt-1">اتصال provider پرداخت و ایجاد سفارش واقعی باید از هسته commerce انجام شود؛ هیچ اطلاعات کارت در frontend ذخیره نمی‌شود.</p></div>
            </div>
            <div className="flex gap-3"><button type="button" onClick={()=>setStep(1)} className="w-full border border-border py-3 rounded-full">بازگشت</button><button type="button" onClick={()=>setStep(3)} className="w-full bg-primary text-primary-foreground py-3 rounded-full">بازبینی سفارش</button></div>
          </div>}

          {step===3&&<div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-2xl">بازبینی نهایی</h2>
            <div className="text-sm text-muted-foreground leading-7">
              <p>{shipping.firstName} {shipping.lastName} • {shipping.phone}</p>
              <p>{shipping.city}، {shipping.address} • کدپستی {shipping.postal}</p>
            </div>
            <p className="text-muted-foreground">سفارش هنوز ایجاد یا پرداخت نشده است. با اتصال commerce backend، این مرحله باید session پرداخت امن دریافت کند.</p>
            <button type="button" disabled className="w-full bg-muted text-muted-foreground py-3 rounded-full cursor-not-allowed">پرداخت امن پس از اتصال درگاه فعال می‌شود</button>
            <button type="button" onClick={()=>setStep(2)} className="w-full border border-border py-3 rounded-full">بازگشت</button>
          </div>}
        </section>

        <aside className="bg-card border border-border rounded-2xl p-6 h-fit">
          <h3 className="text-xl mb-5">خلاصه سفارش</h3>
          <div className="space-y-3 max-h-80 overflow-auto">{cart.map(line=>{
            const product=ALL_PRODUCTS.find(item=>item.id===line.id)
            return product?<div key={line.id} className="flex gap-3 items-center">
              <img src={product.image} className="w-14 h-14 rounded-lg object-cover" alt={product.name}/>
              <div className="flex-1"><p className="text-sm">{product.name}</p><small className="text-muted-foreground">× {line.qty}</small></div>
              <strong className="text-sm">{formatToman(product.price*line.qty)}</strong>
            </div>:null
          })}</div>
          <div className="border-t border-border mt-5 pt-5 flex justify-between"><span>جمع کالاها</span><strong className="text-primary">{formatToman(subtotal)}</strong></div>
          <p className="text-xs text-muted-foreground mt-3">هزینه ارسال و مالیات واقعی باید توسط backend و براساس مقصد محاسبه شود.</p>
        </aside>
      </div>
    </main><Footer/></div>
}
