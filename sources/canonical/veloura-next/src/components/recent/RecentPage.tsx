"use client";

import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { useCart } from "@/store/cart";
import { useRecent } from "@/store/recent";

const fa=new Intl.NumberFormat("fa-IR");
const money=(value:number)=>fa.format(value)+" تومان";

export default function RecentPage(){
  const ids=useRecent((state)=>state.ids);
  const clear=useRecent((state)=>state.clear);
  const add=useCart((state)=>state.add);
  const items=ids.map((id)=>products.find((product)=>product.id===id)).filter(Boolean);

  return <main className="recent-page">
    <header className="shop-nav">
      <Link href="/" className="brand">FATIKHAN</Link>
      <nav><Link href="/shop/">فروشگاه</Link><Link href="/wishlist/">علاقه‌مندی‌ها</Link></nav>
    </header>

    <section className="recent-hero">
      <p className="eyebrow">RECENTLY VIEWED</p>
      <h1>دوباره ببین،<br/><em>سریع‌تر انتخاب کن.</em></h1>
      <p>محصولاتی که روی همین دستگاه دیده‌ای اینجا نگه داشته می‌شوند.</p>
    </section>

    <section className="recent-content">
      {!items.length ? (
        <div className="empty-state">
          <h2>هنوز محصولی ندیده‌ای.</h2>
          <p>وقتی صفحه یک محصول را باز کنی، اینجا ظاهر می‌شود.</p>
          <Link className="button button-dark" href="/shop/">شروع مرور محصولات</Link>
        </div>
      ) : (
        <>
          <div className="recent-topbar">
            <span>{fa.format(items.length)} محصول اخیر</span>
            <button onClick={clear}>پاک کردن تاریخچه</button>
          </div>
          <div className="recent-grid">
            {items.map((product)=>product&&(
              <article key={product.id}>
                <Link className="recent-image" href={"/product/"+product.slug}>
                  <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width:700px) 50vw,25vw"/>
                </Link>
                <div className="recent-copy">
                  <span>{product.category}</span>
                  <h2><Link href={"/product/"+product.slug}>{product.nameFa}</Link></h2>
                  <p>{product.nameEn}</p>
                  <div><strong>{money(product.price)}</strong><button onClick={()=>add(product,product.shades?.[0]?.id)}>+ سبد</button></div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  </main>;
}
