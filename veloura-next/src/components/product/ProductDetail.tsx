"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

const fa = new Intl.NumberFormat("fa-IR");
const money = (value:number) => fa.format(value) + " تومان";

export default function ProductDetail({ product }: { product: Product }) {
  const [shadeId, setShadeId] = useState(product.shades?.[0]?.id);
  const [added, setAdded] = useState(false);
  const add = useCart((state) => state.add);
  const wishlistIds = useWishlist((state) => state.ids);
  const toggleWishlist = useWishlist((state) => state.toggle);

  const shade = useMemo(
    () => product.shades?.find((item) => item.id === shadeId),
    [product.shades, shadeId]
  );

  const addToCart = () => {
    add(product, shadeId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <main className="pdp">
      <header className="pdp-nav">
        <Link href="/" className="brand">VELOURA</Link>
        <Link href="/#products">بازگشت به فروشگاه ←</Link>
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

          <div className="pdp-rating">★ {product.rating} <span>{fa.format(product.reviewCount)} دیدگاه</span></div>

          <div className="pdp-price">
            <strong>{money(product.price)}</strong>
            {product.compareAtPrice && <del>{money(product.compareAtPrice)}</del>}
          </div>

          <p className="pdp-description">
            تجربه‌ای پریمیوم با تمرکز روی بافت، رنگ و استفاده روزانه. طراحی شده برای اینکه انتخاب محصول
            سریع بماند و حس کمپین لوکس از بین نرود.
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

          <div className="pdp-actions">
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
          </div>

          <div className="pdp-trust">
            <span>ضمانت اصالت</span>
            <span>ارسال سریع</span>
            <span>پرداخت امن</span>
          </div>
        </aside>
      </section>

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
