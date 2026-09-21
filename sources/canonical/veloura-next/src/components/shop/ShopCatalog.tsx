"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { categories, products } from "@/data/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useCompare } from "@/store/compare";

const fa = new Intl.NumberFormat("fa-IR");
const money = (value:number) => fa.format(value) + " تومان";

type PriceBand = "all" | "under2" | "2to4" | "over4";

export default function ShopCatalog() {
  const [category, setCategory] = useState<(typeof categories)[number]>("همه");
  const [sort, setSort] = useState("catalog");
  const [query, setQuery] = useState("");
  const [priceBand, setPriceBand] = useState<PriceBand>("all");
  const [shadeOnly, setShadeOnly] = useState(false);
  const add = useCart((state) => state.add);
  const wishlistIds = useWishlist((state) => state.ids);
  const toggleWishlist = useWishlist((state) => state.toggle);
  const compareIds = useCompare((state) => state.ids);
  const toggleCompare = useCompare((state) => state.toggle);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const q = params.get("q") || "";
    const price = params.get("price") as PriceBand | null;
    if (cat && categories.includes(cat as (typeof categories)[number])) {
      setCategory(cat as (typeof categories)[number]);
    }
    setQuery(q);
    if (price && ["all","under2","2to4","over4"].includes(price)) setPriceBand(price);
    setShadeOnly(params.get("shade") === "1");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (category === "همه") params.delete("category"); else params.set("category", category);
    if (query.trim()) params.set("q", query.trim()); else params.delete("q");
    if (priceBand === "all") params.delete("price"); else params.set("price", priceBand);
    if (shadeOnly) params.set("shade", "1"); else params.delete("shade");
    const qs = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
  }, [category, query, priceBand, shadeOnly]);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("fa");
    const filtered = products.filter((product) => {
      const byCategory = category === "همه" || product.category === category;
      const haystack = (
        product.nameFa + " " +
        product.nameEn + " " +
        product.brand + " " +
        product.category + " " +
        product.ingredients.join(" ")
      ).toLocaleLowerCase("fa");
      const byQuery = !q || haystack.includes(q);
      const byShade = !shadeOnly || Boolean(product.shades?.length);
      const byPrice =
        priceBand === "all" ||
        (priceBand === "under2" && product.price < 2000000) ||
        (priceBand === "2to4" && product.price >= 2000000 && product.price <= 4000000) ||
        (priceBand === "over4" && product.price > 4000000);

      return byCategory && byQuery && byShade && byPrice;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "cheap") return a.price - b.price;
      if (sort === "expensive") return b.price - a.price;
      if (sort === "new") return Number(b.id.split("-")[1]) - Number(a.id.split("-")[1]);
      return 0;
    });
  }, [category, query, sort, priceBand, shadeOnly]);

  const reset = () => {
    setCategory("همه");
    setQuery("");
    setPriceBand("all");
    setShadeOnly(false);
    setSort("catalog");
  };

  const activeCount =
    Number(category !== "همه") +
    Number(Boolean(query.trim())) +
    Number(priceBand !== "all") +
    Number(shadeOnly);

  return (
    <main className="shop-page">
      <header className="shop-nav">
        <Link href="/" className="brand">FATIKHAN</Link>
        <nav><Link href="/wishlist/">علاقه‌مندی‌ها</Link><Link href="/cart/">سبد خرید</Link></nav>
      </header>

      <section className="shop-hero">
        <p className="eyebrow">FATIKHAN SHOP · 56 OBJECTS</p>
        <h1>انتخاب کن،<br/><em>دقیق‌تر.</em></h1>
        <p>آرایش، مراقبت پوست، عطر، مو و ست‌های منتخب؛ با فیلترهایی که واقعاً به انتخاب کمک می‌کنند.</p>
      </section>

      <section className="shop-controls" aria-label="فیلتر محصولات">
        <div className="shop-search">
          <label htmlFor="shop-search">جستجو در نام، دسته و ترکیبات</label>
          <input id="shop-search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="مثلاً رتینول، رژ لب یا عطر…" />
        </div>

        <div className="shop-sort">
          <label htmlFor="sort">مرتب‌سازی</label>
          <select id="sort" value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="catalog">ترتیب کاتالوگ</option>
            <option value="new">جدیدترین کاتالوگ</option>
            <option value="cheap">ارزان‌ترین</option>
            <option value="expensive">گران‌ترین</option>
          </select>
        </div>

        <div className="shop-filter-row">
          <label>
            <span>بودجه</span>
            <select value={priceBand} onChange={(e)=>setPriceBand(e.target.value as PriceBand)}>
              <option value="all">همه قیمت‌ها</option>
              <option value="under2">زیر ۲ میلیون</option>
              <option value="2to4">۲ تا ۴ میلیون</option>
              <option value="over4">بیشتر از ۴ میلیون</option>
            </select>
          </label>
          <label className="toggle-filter">
            <input type="checkbox" checked={shadeOnly} onChange={(e)=>setShadeOnly(e.target.checked)} />
            <span>فقط محصولات دارای انتخاب رنگ</span>
          </label>
          {activeCount > 0 && <button className="reset-filters" onClick={reset}>پاک کردن {fa.format(activeCount)} فیلتر</button>}
        </div>

        <div className="chips">
          {categories.map((item)=>(
            <button key={item} className={category===item?"chip active":"chip"} onClick={()=>setCategory(item)}>{item}</button>
          ))}
        </div>
      </section>

      <section className="shop-results">
        <div className="shop-result-head">
          <span>{fa.format(visible.length)} محصول</span>
          <small>{activeCount ? fa.format(activeCount) + " فیلتر فعال" : "کل کاتالوگ FATIKHAN"}</small>
        </div>

        <div className="product-grid light-grid">
          {visible.map((product)=>(
            <article className="product-card" key={product.id}>
              <Link className="product-media" href={"/product/" + product.slug}>
                <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width:600px) 50vw,25vw" />
              </Link>
              <div className="product-info">
                <div className="product-heading">
                  <div><h3><Link href={"/product/" + product.slug}>{product.nameFa}</Link></h3><p>{product.nameEn}</p></div>
                  <strong>{money(product.price)}</strong>
                </div>
                <div className="product-mini-meta">
                  <span>{product.category}</span>
                  {product.ingredients[0] && <span>{product.ingredients[0]}</span>}
                </div>
                <div className="card-actions">
                  <button onClick={()=>add(product, product.shades?.[0]?.id)}>+ سبد</button>
                  <button className={wishlistIds.includes(product.id)?"wish active":"wish"} aria-label="علاقه‌مندی" onClick={()=>toggleWishlist(product.id)}>♡</button>
                  <button className={compareIds.includes(product.id)?"compare-toggle active":"compare-toggle"} onClick={()=>toggleCompare(product.id)}>{compareIds.includes(product.id)?"مقایسه ✓":"مقایسه"}</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!visible.length && (
          <div className="empty-state">
            <h2>ترکیب این فیلترها نتیجه‌ای ندارد.</h2>
            <p>یکی از محدودیت‌ها را بردار یا کل فیلترها را پاک کن.</p>
            <button onClick={reset}>پاک کردن فیلترها</button>
          </div>
        )}
      </section>
    </main>
  );
}
