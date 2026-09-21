"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import IranianTrustRail from "@/components/commerce/IranianTrustRail";
import type { Product } from "@/data/products";
import { discountPercent, formatFaNumber, formatToman } from "@/lib/locale";
import { useCart } from "@/store/cart";
import { useCompare } from "@/store/compare";
import { useWishlist } from "@/store/wishlist";

export default function ProductDetail({ product }: { product: Product }) {
  const [shadeId, setShadeId] = useState(product.shades?.[0]?.id);
  const [added, setAdded] = useState(false);
  const [shareLabel,setShareLabel]=useState("اشتراک‌گذاری محصول");
  const add = useCart((state) => state.add);
  const wishlistIds = useWishlist((state) => state.ids);
  const toggleWishlist = useWishlist((state) => state.toggle);
  const compareIds = useCompare((state) => state.ids);
  const toggleCompare = useCompare((state) => state.toggle);

  const shade = useMemo(
    () => product.shades?.find((item) => item.id === shadeId),
    [product.shades, shadeId]
  );
  const discount = discountPercent(product.price, product.compareAtPrice);
  const compared = compareIds.includes(product.id);
  const compareDisabled = !compared && compareIds.length >= 4;

  const addToCart = () => {
    add(product, shadeId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const shareProduct=async()=>{
    const url=window.location.href;
    try{
      if(navigator.share){
        await navigator.share({title:product.nameFa,text:product.nameEn,url});
        setShareLabel("اشتراک انجام شد ✓");
      }else if(navigator.clipboard){
        await navigator.clipboard.writeText(url);
        setShareLabel("لینک کپی شد ✓");
      }else{
        setShareLabel("امکان کپی لینک در این مرورگر نیست");
      }
    }catch(error){
      if(error instanceof DOMException && error.name==="AbortError") return;
      setShareLabel("اشتراک ناموفق بود");
    }
    window.setTimeout(()=>setShareLabel("اشتراک‌گذاری محصول"),1800);
  };

  return (
    <main className="pdp">
      <header className="pdp-nav">
        <Link href="/" className="brand">VELOURA</Link>
        <nav className="pdp-nav-links">
          <Link href="/compare/">مقایسه ({formatFaNumber(compareIds.length)})</Link>
          <Link href="/shop/">بازگشت به فروشگاه ←</Link>
        </nav>
      </header>

      <section className="pdp-hero">
        <div className="pdp-gallery">
          <div className="pdp-image">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
            />
            {product.badge && <span className="badge">{product.badge}</span>}
          </div>
          <div className="pdp-thumb-row" aria-hidden="true">
            <span className="active" />
            <span />
            <span />
          </div>
        </div>

        <aside className="pdp-buy">
          <p className="eyebrow">{product.brand} · {product.category}</p>
          <h1>{product.nameFa}</h1>
          <p className="pdp-en">{product.nameEn}</p>

          <div className="pdp-rating">★ {product.rating} <span>{formatFaNumber(product.reviewCount)} دیدگاه</span></div>

          <div className="pdp-price">
            <strong>{formatToman(product.price)}</strong>
            {product.compareAtPrice && <del>{formatToman(product.compareAtPrice)}</del>}
            {discount > 0 && <span className="sale-pill">٪{formatFaNumber(discount)} تخفیف</span>}
          </div>

          <p className="pdp-description">
            تجربه‌ای پریمیوم با تمرکز روی بافت، رنگ و استفاده روزانه؛ با اطلاعات شفاف‌تر برای خرید آنلاین فارسی.
          </p>

          {product.shades && (
            <fieldset className="pdp-shades">
              <legend>انتخاب رنگ {shade ? "· " + shade.nameFa : ""}</legend>
              <div>
                {product.shades.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    aria-label={item.nameFa}
                    title={item.nameFa}
                    className={item.id === shadeId ? "pdp-swatch active" : "pdp-swatch"}
                    style={{ backgroundColor: item.hex }}
                    onClick={() => setShadeId(item.id)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          <div className="pdp-actions pdp-actions-commerce">
            <button className="button button-dark pdp-add" onClick={addToCart}>
              {added ? "به سبد اضافه شد ✓" : "افزودن به سبد"}
            </button>
            <button
              className={wishlistIds.includes(product.id) ? "button pdp-wish active" : "button pdp-wish"}
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={wishlistIds.includes(product.id)}
            >
              {wishlistIds.includes(product.id) ? "♥ ذخیره شد" : "♡ علاقه‌مندی"}
            </button>
            <button
              className={compared ? "button compare-toggle active" : "button compare-toggle"}
              onClick={() => toggleCompare(product.id)}
              aria-pressed={compared}
              disabled={compareDisabled}
              title={compareDisabled ? "حداکثر ۴ محصول قابل مقایسه است" : "مقایسه محصول"}
            >
              {compared ? "✓ در مقایسه" : "مقایسه محصول"}
            </button>
          </div>

          <button type="button" className="pdp-share" onClick={shareProduct} aria-live="polite">{shareLabel}</button>
          <p className="pdp-commerce-note">
            هزینه و زمان نهایی ارسال در مرحله ثبت آدرس و پس از اتصال سرویس واقعی ارسال محاسبه می‌شود.
          </p>
        </aside>
      </section>

      <IranianTrustRail />

      <section className="pdp-details">
        <article><span>01</span><h2>چرا خاص است؟</h2><p>فرمول و طراحی محصول برای استفاده واقعی، با تمرکز بر راحتی، جلوه و ماندگاری متعادل.</p></article>
        <article><span>02</span><h2>روش استفاده</h2><p>محصول را به‌صورت لایه‌ای استفاده کن و شدت نتیجه را متناسب با استایل خودت تنظیم کن.</p></article>
        <article><span>03</span><h2>جزئیات فرمول</h2><p>اطلاعات کامل ترکیبات، سازگاری و نکات محصول در نسخه داده واقعی از کاتالوگ نمایش داده می‌شود.</p></article>
      </section>

      <section className="pdp-editorial">
        <div><p className="eyebrow">VELOURA OBJECTS</p><h2>محصول، بخشی از تجربه است؛ نه فقط یک کارت در فروشگاه.</h2></div>
        <span>03 / PRODUCT STORY</span>
      </section>
    </main>
  );
}
