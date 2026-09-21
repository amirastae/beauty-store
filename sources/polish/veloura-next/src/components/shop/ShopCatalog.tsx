"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { categories, products } from "@/data/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

const fa = new Intl.NumberFormat("fa-IR");
const money = (value:number) => fa.format(value) + " تومان";

export default function ShopCatalog() {
  const [category, setCategory] = useState<(typeof categories)[number]>("همه");
  const [sort, setSort] = useState("popular");
  const [query, setQuery] = useState("");
  const add = useCart((state) => state.add);
  const wishlistIds = useWishlist((state) => state.ids);
  const toggleWishlist = useWishlist((state) => state.toggle);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const q = params.get("q") || "";
    if (cat && categories.includes(cat as (typeof categories)[number])) {
      setCategory(cat as (typeof categories)[number]);
    }
    setQuery(q);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (category === "همه") params.delete("category"); else params.set("category", category);
    if (query.trim()) params.set("q", query.trim()); else params.delete("q");
    const qs = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
  }, [category, query]);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("fa");
    const filtered = products.filter((product) => {
      const byCategory = category === "همه" || product.category === category;
      const haystack = (product.nameFa + " " + product.nameEn + " " + product.brand + " " + product.category).toLocaleLowerCase("fa");
      return byCategory && (!q || haystack.includes(q));
    });

    return [...filtered].sort((a, b) => {
      if (sort === "cheap") return a.price - b.price;
      if (sort === "expensive") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
  }, [category, query, sort]);

  return (
    <main className="shop-page">
      <header className="shop-nav">
        <Link href="/" className="brand">VELOURA</Link>
        <nav><Link href="/wishlist/">علاقه‌مندی‌ها</Link><Link href="/cart/">سبد خرید</Link></nav>
      </header>

      <section className="shop-hero">
        <p className="eyebrow">VELOURA SHOP</p>
        <h1>انتخاب کن،<br/><em>دقیق‌تر.</em></h1>
        <p>کالکشن‌های آرایشی، مراقبت پوست و عطر؛ با فیلتر سریع و تجربه خرید سبک.</p>
      </section>

      <section className="shop-controls" aria-label="فیلتر محصولات">
        <div className="shop-search">
          <label htmlFor="shop-search">جستجو</label>
          <input id="shop-search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="نام محصول یا برند…" />
        </div>
        <div className="shop-sort">
          <label htmlFor="sort">مرتب‌سازی</label>
          <select id="sort" value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="popular">محبوب‌ترین</option>
            <option value="rating">بالاترین امتیاز</option>
            <option value="cheap">ارزان‌ترین</option>
            <option value="expensive">گران‌ترین</option>
          </select>
        </div>
        <div className="chips">
          {categories.map((item)=>(
            <button key={item} className={category===item?"chip active":"chip"} onClick={()=>setCategory(item)}>{item}</button>
          ))}
        </div>
      </section>

      <section className="shop-results">
        <div className="shop-result-head"><span>{fa.format(visible.length)} محصول</span><small>نتایج فوراً با فیلترها به‌روز می‌شوند.</small></div>
        <div className="product-grid light-grid">
          {visible.map((product)=>(
            <article className="product-card" key={product.id}>
              <Link className="product-media" href={"/product/" + product.slug}>
                <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width:600px) 50vw,25vw" />
                {product.badge && <span className="badge">{product.badge}</span>}
              </Link>
              <div className="product-info">
                <div className="product-heading">
                  <div><h3><Link href={"/product/" + product.slug}>{product.nameFa}</Link></h3><p>{product.nameEn}</p></div>
                  <strong>{money(product.price)}</strong>
                </div>
                <div className="card-actions">
                  <button onClick={()=>add(product, product.shades?.[0]?.id)}>+ سبد</button>
                  <button className={wishlistIds.includes(product.id)?"wish active":"wish"} aria-label="علاقه‌مندی" onClick={()=>toggleWishlist(product.id)}>♡</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!visible.length && <div className="empty-state"><h2>محصولی پیدا نشد.</h2><button onClick={()=>{setQuery("");setCategory("همه")}}>پاک کردن فیلترها</button></div>}
      </section>
    </main>
  );
}
