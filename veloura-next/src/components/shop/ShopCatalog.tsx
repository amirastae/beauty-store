"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import IranianTrustRail from "@/components/commerce/IranianTrustRail";
import { categories, products } from "@/data/products";
import { discountPercent, formatFaNumber, formatToman, normalizePersianSearch } from "@/lib/locale";
import { useCart } from "@/store/cart";
import { useCompare } from "@/store/compare";
import { useWishlist } from "@/store/wishlist";

export default function ShopCatalog() {
  const [category, setCategory] = useState<(typeof categories)[number]>("همه");
  const [sort, setSort] = useState("popular");
  const [query, setQuery] = useState("");
  const [saleOnly, setSaleOnly] = useState(false);
  const add = useCart((state) => state.add);
  const wishlistIds = useWishlist((state) => state.ids);
  const toggleWishlist = useWishlist((state) => state.toggle);
  const compareIds = useCompare((state) => state.ids);
  const toggleCompare = useCompare((state) => state.toggle);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const q = params.get("q") || "";
    const sale = params.get("sale") === "1";
    if (cat && categories.includes(cat as (typeof categories)[number])) {
      setCategory(cat as (typeof categories)[number]);
    }
    setQuery(q);
    setSaleOnly(sale);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (category === "همه") params.delete("category"); else params.set("category", category);
    if (query.trim()) params.set("q", query.trim()); else params.delete("q");
    if (saleOnly) params.set("sale", "1"); else params.delete("sale");
    const qs = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
  }, [category, query, saleOnly]);

  const visible = useMemo(() => {
    const q = normalizePersianSearch(query);
    const filtered = products.filter((product) => {
      const byCategory = category === "همه" || product.category === category;
      const bySale = !saleOnly || Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
      const haystack = normalizePersianSearch(product.nameFa + " " + product.nameEn + " " + product.brand + " " + product.category);
      return byCategory && bySale && (!q || haystack.includes(q));
    });

    return [...filtered].sort((a, b) => {
      if (sort === "cheap") return a.price - b.price;
      if (sort === "expensive") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "discount") return discountPercent(b.price, b.compareAtPrice) - discountPercent(a.price, a.compareAtPrice);
      return b.reviewCount - a.reviewCount;
    });
  }, [category, query, saleOnly, sort]);

  const resetFilters = () => {
    setQuery("");
    setCategory("همه");
    setSaleOnly(false);
    setSort("popular");
  };

  return (
    <main className="shop-page">
      <header className="shop-nav">
        <Link href="/" className="brand">VELOURA</Link>
        <nav>
          <Link href="/wishlist/">علاقه‌مندی‌ها</Link>
          <Link href="/compare/">مقایسه ({formatFaNumber(compareIds.length)})</Link>
          <Link href="/cart/">سبد خرید</Link>
        </nav>
      </header>

      <section className="shop-hero">
        <p className="eyebrow">VELOURA SHOP · IRAN EDIT</p>
        <h1>انتخاب کن،<br/><em>دقیق‌تر.</em></h1>
        <p>کالکشن‌های آرایشی، مراقبت پوست و عطر با جستجوی فارسی، قیمت تومان و مسیر خرید سازگار با بازار ایران.</p>
        <Link className="routine-entry" href="/routine/">راهنمای روتین پوست ←</Link>
      </section>

      <IranianTrustRail />

      <section className="shop-controls" aria-label="فیلتر محصولات">
        <div className="shop-search">
          <label htmlFor="shop-search">جستجو</label>
          <input id="shop-search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="نام محصول، برند یا دسته…" />
        </div>
        <div className="shop-sort">
          <label htmlFor="sort">مرتب‌سازی</label>
          <select id="sort" value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="popular">محبوب‌ترین</option>
            <option value="rating">بالاترین امتیاز</option>
            <option value="discount">بیشترین تخفیف</option>
            <option value="cheap">ارزان‌ترین</option>
            <option value="expensive">گران‌ترین</option>
          </select>
        </div>
        <div className="chips">
          {categories.map((item)=>(
            <button key={item} className={category===item?"chip active":"chip"} onClick={()=>setCategory(item)}>{item}</button>
          ))}
        </div>
        <div className="shop-refine-row">
          <button
            type="button"
            className={saleOnly ? "shop-toggle active" : "shop-toggle"}
            aria-pressed={saleOnly}
            onClick={() => setSaleOnly((value) => !value)}
          >
            فقط تخفیف‌دارها
          </button>
          {(saleOnly || category !== "همه" || query) && (
            <button type="button" className="shop-toggle" onClick={resetFilters}>پاک کردن فیلترها</button>
          )}
        </div>
      </section>

      <section className="shop-results">
        <div className="shop-result-head"><span>{formatFaNumber(visible.length)} محصول</span><small>نتایج فوراً با فیلترها به‌روز می‌شوند.</small></div>
        <div className="product-grid light-grid">
          {visible.map((product)=>{
            const discount = discountPercent(product.price, product.compareAtPrice);
            const compared = compareIds.includes(product.id);
            const compareDisabled = !compared && compareIds.length >= 4;
            return (
              <article className="product-card" key={product.id}>
                <Link className="product-media" href={"/product/" + product.slug}>
                  <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width:600px) 50vw,25vw" />
                  {product.badge && <span className="badge">{product.badge}</span>}
                  {discount > 0 && <span className="sale-pill">٪{formatFaNumber(discount)} تخفیف</span>}
                </Link>
                <div className="product-info">
                  <div className="product-heading">
                    <div><h3><Link href={"/product/" + product.slug}>{product.nameFa}</Link></h3><p>{product.nameEn}</p></div>
                    <div className="product-price-stack">
                      <strong>{formatToman(product.price)}</strong>
                      {product.compareAtPrice && <del>{formatToman(product.compareAtPrice)}</del>}
                    </div>
                  </div>
                  <div className="rating">★ {product.rating} <span>({formatFaNumber(product.reviewCount)})</span></div>
                  <div className="card-actions commerce-card-actions">
                    <button onClick={()=>add(product, product.shades?.[0]?.id)}>+ سبد</button>
                    <button className={wishlistIds.includes(product.id)?"wish active":"wish"} aria-label="علاقه‌مندی" onClick={()=>toggleWishlist(product.id)}>♡</button>
                    <button
                      className={compared ? "compare-toggle active" : "compare-toggle"}
                      aria-pressed={compared}
                      disabled={compareDisabled}
                      title={compareDisabled ? "حداکثر ۴ محصول قابل مقایسه است" : "مقایسه محصول"}
                      onClick={()=>toggleCompare(product.id)}
                    >
                      {compared ? "✓ مقایسه" : "مقایسه"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {!visible.length && <div className="empty-state"><h2>محصولی پیدا نشد.</h2><button onClick={resetFilters}>پاک کردن فیلترها</button></div>}
      </section>
    </main>
  );
}
