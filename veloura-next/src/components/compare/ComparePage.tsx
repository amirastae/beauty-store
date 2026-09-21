"use client";

import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { useCart } from "@/store/cart";
import { useCompare } from "@/store/compare";

const fa=new Intl.NumberFormat("fa-IR");
const money=(value:number)=>fa.format(value)+" تومان";

export default function ComparePage(){
  const ids=useCompare((state)=>state.ids);
  const remove=useCompare((state)=>state.remove);
  const clear=useCompare((state)=>state.clear);
  const add=useCart((state)=>state.add);
  const selected=ids.map((id)=>products.find((product)=>product.id===id)).filter(Boolean);

  return <main className="compare-page">
    <header className="shop-nav">
      <Link href="/" className="brand">VELOURA</Link>
      <nav><Link href="/shop/">فروشگاه</Link><Link href="/wishlist/">علاقه‌مندی‌ها</Link></nav>
    </header>

    <section className="compare-hero">
      <p className="eyebrow">COMPARE · MAX 3</p>
      <h1>کنار هم،<br/><em>واضح‌تر.</em></h1>
      <p>تا سه محصول را بر اساس قیمت، امتیاز، رنگ و ترکیبات شاخص کنار هم ببین.</p>
    </section>

    <section className="compare-content">
      {!selected.length ? (
        <div className="empty-state">
          <h2>هنوز محصولی برای مقایسه انتخاب نکردی.</h2>
          <p>در فروشگاه یا صفحه محصول، گزینه «مقایسه» را بزن.</p>
          <Link className="button button-dark" href="/shop/">رفتن به فروشگاه</Link>
        </div>
      ) : (
        <>
          <div className="compare-topbar">
            <span>{fa.format(selected.length)} از ۳ محصول</span>
            <button onClick={clear}>پاک کردن همه</button>
          </div>

          <div className={"compare-grid count-"+selected.length}>
            {selected.map((product)=>product && (
              <article key={product.id} className="compare-card">
                <button className="compare-remove" onClick={()=>remove(product.id)} aria-label={"حذف "+product.nameFa}>×</button>
                <Link className="compare-image" href={"/product/"+product.slug}>
                  <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width:700px) 80vw,33vw"/>
                </Link>
                <div className="compare-card-copy">
                  <span>{product.category}</span>
                  <h2><Link href={"/product/"+product.slug}>{product.nameFa}</Link></h2>
                  <p>{product.nameEn}</p>
                  <strong>{money(product.price)}</strong>
                  <button className="button button-dark" onClick={()=>add(product,product.shades?.[0]?.id)}>افزودن به سبد</button>
                </div>
              </article>
            ))}
            {selected.length<3 && (
              <Link className="compare-add-slot" href="/shop/">
                <b>+</b><span>افزودن محصول دیگر</span>
              </Link>
            )}
          </div>

          <div className="compare-table" role="table" aria-label="مقایسه جزئیات محصولات">
            <div className="compare-row" role="row">
              <strong role="rowheader">امتیاز</strong>
              {selected.map((product)=>product&&<span role="cell" key={product.id}>★ {product.rating} · {fa.format(product.reviewCount)}</span>)}
            </div>
            <div className="compare-row" role="row">
              <strong role="rowheader">رنگ‌ها</strong>
              {selected.map((product)=>product&&<span role="cell" key={product.id}>{product.shades?.length ? fa.format(product.shades.length)+" انتخاب" : "—"}</span>)}
            </div>
            <div className="compare-row" role="row">
              <strong role="rowheader">ترکیبات شاخص</strong>
              {selected.map((product)=>product&&<span role="cell" key={product.id}>{product.ingredients.slice(0,4).join(" · ")}</span>)}
            </div>
            <div className="compare-row" role="row">
              <strong role="rowheader">مزیت‌ها</strong>
              {selected.map((product)=>product&&<span role="cell" key={product.id}>{product.benefitsFa.join(" · ")}</span>)}
            </div>
            <div className="compare-row" role="row">
              <strong role="rowheader">روش استفاده</strong>
              {selected.map((product)=>product&&<span role="cell" key={product.id}>{product.usageFa}</span>)}
            </div>
          </div>
        </>
      )}
    </section>
  </main>;
}
