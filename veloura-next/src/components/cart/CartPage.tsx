"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";

const fa = new Intl.NumberFormat("fa-IR");
const money=(v:number)=>fa.format(v)+" تومان";

export default function CartPage(){
  const lines=useCart((state)=>state.lines);
  const remove=useCart((state)=>state.remove);
  const total=lines.reduce((sum,line)=>sum+line.product.price*line.qty,0);

  return <main className="utility-page">
    <header className="shop-nav"><Link href="/" className="brand">VELOURA</Link><Link href="/shop/">ادامه خرید ←</Link></header>
    <section className="utility-head"><p className="eyebrow">YOUR BAG</p><h1>سبد خرید</h1><p>{fa.format(lines.reduce((s,l)=>s+l.qty,0))} آیتم</p></section>
    <section className="cart-page-grid">
      <div className="cart-page-lines">
        {!lines.length ? <div className="empty-state"><h2>سبدت خالی است.</h2><Link className="button button-dark" href="/shop/">شروع خرید</Link></div> :
          lines.map((line)=>{
            const shade=line.product.shades?.find((s)=>s.id===line.shadeId);
            return <article className="cart-page-line" key={line.product.id+"-"+(line.shadeId||"default")}>
              <Image src={line.product.image} alt={line.product.imageAlt} width={120} height={150}/>
              <div><Link href={"/product/"+line.product.slug}>{line.product.nameFa}</Link><span>{shade?.nameFa||line.product.category}</span><small>تعداد: {fa.format(line.qty)}</small></div>
              <strong>{money(line.product.price*line.qty)}</strong>
              <button onClick={()=>remove(line.product.id,line.shadeId)}>حذف</button>
            </article>
          })
        }
      </div>
      <aside className="order-summary">
        <h2>خلاصه سفارش</h2>
        <div><span>جمع کالاها</span><strong>{money(total)}</strong></div>
        <div><span>ارسال</span><strong>{total?"در مرحله بعد":"—"}</strong></div>
        <hr/>
        <div><span>جمع</span><strong>{money(total)}</strong></div>
        {lines.length ? <Link className="button button-dark" href="/checkout/">ادامه به پرداخت</Link> : <button className="button button-dark" disabled>ادامه به پرداخت</button>}
      </aside>
    </section>
  </main>;
}
