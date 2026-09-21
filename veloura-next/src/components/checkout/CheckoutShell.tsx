"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/store/cart";

const fa=new Intl.NumberFormat("fa-IR");
const money=(v:number)=>fa.format(v)+" تومان";

type Draft={
  name:string;
  phone:string;
  email:string;
  address:string;
  city:string;
  postal:string;
  note:string;
};

const emptyDraft:Draft={name:"",phone:"",email:"",address:"",city:"",postal:"",note:""};
const storageKey="veloura-checkout-draft-v1";

export default function CheckoutShell(){
  const lines=useCart((state)=>state.lines);
  const total=lines.reduce((s,l)=>s+l.product.price*l.qty,0);
  const [draft,setDraft]=useState<Draft>(emptyDraft);
  const [saved,setSaved]=useState(false);

  useEffect(()=>{
    try{
      const raw=localStorage.getItem(storageKey);
      if(raw) setDraft({...emptyDraft,...JSON.parse(raw)});
    }catch{}
  },[]);

  const update=(key:keyof Draft,value:string)=>{
    setDraft((state)=>({...state,[key]:value}));
    setSaved(false);
  };

  const submit=(event:FormEvent)=>{
    event.preventDefault();
    try{
      localStorage.setItem(storageKey,JSON.stringify(draft));
      setSaved(true);
    }catch{
      setSaved(false);
    }
  };

  return <main className="checkout-page">
    <header className="shop-nav"><Link href="/" className="brand">VELOURA</Link><Link href="/cart/">بازگشت به سبد ←</Link></header>

    <div className="checkout-status" aria-label="مراحل سفارش">
      <span className="done">01 · سبد</span><i/><span className="active">02 · اطلاعات</span><i/><span>03 · پرداخت</span>
    </div>

    <div className="checkout-layout">
      <section>
        <p className="eyebrow">SECURE CHECKOUT · STEP 02</p>
        <h1>اطلاعات تحویل</h1>
        <p className="checkout-intro">اطلاعات این مرحله فقط روی همین مرورگر ذخیره می‌شود تا بعد از اتصال سرویس سفارش و درگاه واقعی، مسیر تکمیل خرید آماده باشد.</p>

        <form className="checkout-form" onSubmit={submit}>
          <label>نام و نام خانوادگی<input required autoComplete="name" value={draft.name} onChange={(e)=>update("name",e.target.value)}/></label>
          <label>شماره تماس<input required inputMode="tel" autoComplete="tel" value={draft.phone} onChange={(e)=>update("phone",e.target.value)}/></label>
          <label>ایمیل<input type="email" autoComplete="email" value={draft.email} onChange={(e)=>update("email",e.target.value)}/></label>
          <label>شهر<input required autoComplete="address-level2" value={draft.city} onChange={(e)=>update("city",e.target.value)}/></label>
          <label className="wide">آدرس<textarea required rows={3} autoComplete="street-address" value={draft.address} onChange={(e)=>update("address",e.target.value)}/></label>
          <label>کد پستی<input required inputMode="numeric" autoComplete="postal-code" value={draft.postal} onChange={(e)=>update("postal",e.target.value)}/></label>
          <label>توضیح سفارش<input value={draft.note} onChange={(e)=>update("note",e.target.value)} placeholder="اختیاری"/></label>
          <button className="button button-dark wide" disabled={!lines.length}>ذخیره اطلاعات برای ادامه</button>
        </form>

        <div className="checkout-safety">
          <b>پرداخت نمایشی نداریم.</b>
          <p>تا وقتی درگاه واقعی فروشگاه متصل نشده، این صفحه هیچ پرداختی را موفق اعلام نمی‌کند و شماره کارت یا اطلاعات بانکی دریافت نمی‌کند.</p>
        </div>

        <div className={saved?"checkout-note success":"checkout-note"} aria-live="polite">
          {saved ? "اطلاعات روی همین دستگاه ذخیره شد. سبد خرید و فرم برای ادامه آماده می‌مانند." : "اطلاعات بانکی در این مرحله درخواست نمی‌شود."}
        </div>
      </section>

      <aside className="order-summary">
        <h2>سفارش شما</h2>
        {lines.length ? lines.map((line)=><div key={line.product.id+"-"+(line.shadeId||"default")}><span>{line.product.nameFa} × {fa.format(line.qty)}</span><strong>{money(line.product.price*line.qty)}</strong></div>) : <p className="summary-empty">سبد خرید خالی است.</p>}
        <hr/><div><span>جمع کالاها</span><strong>{money(total)}</strong></div>
        <div><span>ارسال</span><strong>پس از اتصال سرویس ارسال</strong></div>
        <small>مبلغ نهایی ارسال و پرداخت فقط از سرویس واقعی فروشگاه دریافت خواهد شد.</small>
      </aside>
    </div>
  </main>;
}
