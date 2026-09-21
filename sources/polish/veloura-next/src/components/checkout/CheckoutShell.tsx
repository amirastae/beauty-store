"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/store/cart";

const fa=new Intl.NumberFormat("fa-IR");
const money=(v:number)=>fa.format(v)+" تومان";

export default function CheckoutShell(){
  const lines=useCart((state)=>state.lines);
  const total=lines.reduce((s,l)=>s+l.product.price*l.qty,0);
  const [done,setDone]=useState(false);

  return <main className="checkout-page">
    <header className="shop-nav"><Link href="/" className="brand">VELOURA</Link><Link href="/cart/">بازگشت به سبد ←</Link></header>
    <div className="checkout-layout">
      <section>
        <p className="eyebrow">SECURE CHECKOUT</p>
        <h1>تکمیل سفارش</h1>
        <form className="checkout-form" onSubmit={(e)=>{e.preventDefault();setDone(true)}}>
          <label>نام و نام خانوادگی<input required autoComplete="name"/></label>
          <label>شماره تماس<input required inputMode="tel" autoComplete="tel"/></label>
          <label>ایمیل<input type="email" autoComplete="email"/></label>
          <label className="wide">آدرس<textarea required rows={3} autoComplete="street-address"/></label>
          <label>شهر<input required autoComplete="address-level2"/></label>
          <label>کد پستی<input required inputMode="numeric" autoComplete="postal-code"/></label>
          <button className="button button-dark wide" disabled={!lines.length}>ثبت اطلاعات سفارش</button>
        </form>
        {done && <div className="checkout-note">اطلاعات سفارش آماده است. اتصال درگاه پرداخت باید با ارائه‌دهنده واقعی فروشگاه انجام شود؛ پرداخت جعلی یا نمایشی ثبت نمی‌شود.</div>}
      </section>
      <aside className="order-summary">
        <h2>سفارش شما</h2>
        {lines.map((line)=><div key={line.product.id+"-"+(line.shadeId||"default")}><span>{line.product.nameFa} × {fa.format(line.qty)}</span><strong>{money(line.product.price*line.qty)}</strong></div>)}
        <hr/><div><span>جمع کالاها</span><strong>{money(total)}</strong></div>
      </aside>
    </div>
  </main>;
}
