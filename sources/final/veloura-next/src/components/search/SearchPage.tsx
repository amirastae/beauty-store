"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { normalizePersianSearch } from "@/lib/locale";

const fa = new Intl.NumberFormat("fa-IR");
const money = (value:number) => fa.format(value) + " تومان";
const popular = ["رتینول","Hyaluronic Acid","رژ لب","عطر","مو","ست‌ها"];

export default function SearchPage(){
  const [query,setQuery]=useState("");
  const inputRef=useRef<HTMLInputElement>(null);
  const add=useCart((state)=>state.add);
  const ids=useWishlist((state)=>state.ids);
  const toggle=useWishlist((state)=>state.toggle);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
    window.setTimeout(()=>inputRef.current?.focus(),60);
  },[]);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    if(query.trim()) params.set("q",query.trim()); else params.delete("q");
    const qs=params.toString();
    window.history.replaceState(null,"",window.location.pathname+(qs?"?"+qs:""));
  },[query]);

  const results=useMemo(()=>{
    const q=normalizePersianSearch(query);
    if(!q) return [];
    return products.filter((product)=>{
      const text=normalizePersianSearch(product.nameFa+" "+product.nameEn+" "+product.category+" "+product.ingredients.join(" "));
      return text.includes(q);
    });
  },[query]);

  return <main className="search-page">
    <header className="shop-nav">
      <Link href="/" className="brand">FATIKHAN</Link>
      <nav><Link href="/shop/">فروشگاه</Link><Link href="/cart/">سبد خرید</Link></nav>
    </header>

    <section className="search-hero">
      <p className="eyebrow">SEARCH · NAME / CATEGORY / INGREDIENT</p>
      <label htmlFor="catalog-search">چه چیزی می‌خواهی پیدا کنی؟</label>
      <div className="search-field">
        <input ref={inputRef} id="catalog-search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="نام محصول، دسته یا ترکیب…" autoComplete="off"/>
        {query && <button type="button" onClick={()=>setQuery("")} aria-label="پاک کردن جستجو">×</button>}
      </div>
      {!query && <div className="popular-searches">
        <span>جستجوهای پیشنهادی</span>
        <div>{popular.map((item)=><button type="button" key={item} onClick={()=>setQuery(item)}>{item}</button>)}</div>
      </div>}
    </section>

    <section className="search-results-page">
      {query ? <div className="search-results-head" aria-live="polite"><strong>{fa.format(results.length)} نتیجه</strong><span>برای «{query}»</span></div> : null}

      {query && results.length > 0 && <div className="search-product-list">
        {results.map((product)=>(
          <article key={product.id}>
            <Link className="search-product-image" href={"/product/"+product.slug}>
              <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width:700px) 34vw,180px"/>
            </Link>
            <div className="search-product-copy">
              <span>{product.category} · {product.brand}</span>
              <h2><Link href={"/product/"+product.slug}>{product.nameFa}</Link></h2>
              <p>{product.nameEn}</p>
              <div className="search-product-meta"><b>{product.category}</b><span>{product.ingredients.slice(0,2).join(" · ")}</span></div>
            </div>
            <div className="search-product-buy">
              <strong>{money(product.price)}</strong>
              <button type="button" onClick={()=>add(product,product.shades?.[0]?.id)}>+ سبد</button>
              <button type="button" className={ids.includes(product.id)?"active":""} onClick={()=>toggle(product.id)} aria-label={ids.includes(product.id) ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"} aria-pressed={ids.includes(product.id)}>{ids.includes(product.id)?"♥":"♡"}</button>
            </div>
          </article>
        ))}
      </div>}

      {query && !results.length && <div className="search-zero">
        <span>0 RESULTS</span>
        <h2>چیزی با این عبارت پیدا نشد.</h2>
        <p>نام کوتاه‌تر، دسته محصول یا یکی از ترکیبات را امتحان کن.</p>
        <button type="button" onClick={()=>setQuery("")}>جستجوی دوباره</button>
      </div>}

      {!query && <div className="search-explore">
        <div><span>01</span><h2>پوست</h2><Link href="/shop/?category=پوست">مشاهده ←</Link></div>
        <div><span>02</span><h2>آرایش</h2><Link href="/shop/?category=آرایش">مشاهده ←</Link></div>
        <div><span>03</span><h2>عطر</h2><Link href="/shop/?category=عطر">مشاهده ←</Link></div>
        <div><span>04</span><h2>مو</h2><Link href="/shop/?category=مو">مشاهده ←</Link></div>
      </div>}
    </section>
  </main>;
}
