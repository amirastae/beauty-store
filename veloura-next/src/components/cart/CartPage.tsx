"use client";

import Image from "next/image";
import Link from "next/link";
import IranianTrustRail from "@/components/commerce/IranianTrustRail";
import { formatFaNumber, formatToman } from "@/lib/locale";
import { useCart } from "@/store/cart";

export default function CartPage(){
  const lines=useCart((state)=>state.lines);
  const remove=useCart((state)=>state.remove);
  const total=lines.reduce((sum,line)=>sum+line.product.price*line.qty,0);

  return <main className="utility-page">
    <header className="shop-nav"><Link href="/" className="brand">VELOURA</Link><Link href="/shop/">ادامه خرید ←</Link></header>
    <section className="utility-head"><p className="eyebrow">YOUR BAG · IRAN EDIT</p><h1>سبد خرید</h1><p>{formatFaNumber(lines.reduce((s,l)=>s+l.qty,0))} آیتم</p></section>
    <IranianTrustRail />
    <section className="cart-page-grid">
      <div className="cart-page-lines">
        {!lines.length ? <div className="empty-state"><h2>سبدت خالی است.</h2><Link className="button button-dark" href="/shop/">شروع خرید</Link></div> :
          lines.map((line)=>{
            const shade=line.product.shades?.find((s)=>s.id===line.shadeId);
            return <article className="cart-page-line" key={line.product.id+"-"+(line.shadeId||"default")}>
              <Image src={line.product.image} alt={line.product.imageAlt} width={120} height={150}/>
              <div><Link href={"/product/"+line.product.slug}>{line.product.nameFa}</Link><span>{shade?.nameFa||line.product.category}</span><small>تعداد: {formatFaNumber(line.qty)}</small></div>
              <strong>{formatToman(line.product.price*line.qty)}</strong>
              <button onClick={()=>remove(line.product.id,line.shadeId)}>حذف</button>
            </article>
          })
        }
      </div>
      <aside className="order-summary">
        <h2>خلاصه سفارش</h2>
        <div><span>جمع کالاها</span><strong>{formatToman(total)}</strong></div>
        <div><span>ارسال</span><strong>{total?"پس از ثبت مقصد":"—"}</strong></div>
        <hr/>
        <div><span>جمع فعلی</span><strong>{formatToman(total)}</strong></div>
        <small className="pdp-commerce-note">هزینه نهایی ارسال در checkout و پس از اتصال سرویس واقعی ارسال مشخص می‌شود.</small>
        {lines.length ? <Link className="button button-dark" href="/checkout/">ادامه به ثبت سفارش</Link> : <button className="button button-dark" disabled>ادامه به ثبت سفارش</button>}
      </aside>
    </section>
  </main>;
}
