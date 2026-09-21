"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useCompare } from "@/store/compare";
import { useRecent } from "@/store/recent";

const fa = new Intl.NumberFormat("fa-IR");
const money = (value:number) => fa.format(value) + " تومان";

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [shadeId, setShadeId] = useState(product.shades?.[0]?.id);
  const [added, setAdded] = useState(false);
  const add = useCart((state) => state.add);
  const wishlistIds = useWishlist((state) => state.ids);
  const toggleWishlist = useWishlist((state) => state.toggle);
  const compareIds = useCompare((state) => state.ids);
  const toggleCompare = useCompare((state) => state.toggle);
  const visitRecent = useRecent((state) => state.visit);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    visitRecent(product.id);
  }, [product.id, visitRecent]);

  const shade = useMemo(
    () => product.shades?.find((item) => item.id === shadeId),
    [product.shades, shadeId]
  );

  const shareProduct = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.nameFa + " — VELOURA", text: product.nameEn, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        window.setTimeout(() => setShared(false), 1600);
      }
    } catch {}
  };

  const addToCart = () => {
    add(product, shadeId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <main className="pdp">
      <header className="pdp-nav">
        <Link href="/" className="brand">VELOURA</Link>
        <nav className="pdp-crumbs" aria-label="مسیر صفحه">
          <Link href="/shop/">فروشگاه</Link>
          <span>/</span>
          <Link href={"/shop/?category=" + encodeURIComponent(product.category)}>{product.category}</Link>
          <span>/</span>
          <b>{product.nameFa}</b>
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
          <div className="pdp-media-meta">
            <span>{product.brand}</span>
            <span>{product.category}</span>
            <span>PRODUCT OBJECT</span>
          </div>
        </div>

        <aside className="pdp-buy">
          <p className="eyebrow">{product.brand} · {product.category}</p>
          <h1>{product.nameFa}</h1>
          <p className="pdp-en">{product.nameEn}</p>

          <div className="pdp-rating">★ {product.rating} <span>{fa.format(product.reviewCount)} امتیاز</span></div>

          <div className="pdp-price">
            <strong>{money(product.price)}</strong>
            {product.compareAtPrice && <del>{money(product.compareAtPrice)}</del>}
          </div>

          <p className="pdp-description">
            محصولی از کالکشن ولورا با تمرکز روی تجربه استفاده، انتخاب روشن و اطلاعات کاربردی؛
            بدون شلوغی اضافه در مسیر خرید.
          </p>

          <ul className="pdp-benefits">
            {product.benefitsFa.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>

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
            <button
              className={compareIds.includes(product.id) ? "button pdp-compare active" : "button pdp-compare"}
              onClick={() => toggleCompare(product.id)}
              aria-pressed={compareIds.includes(product.id)}
            >
              {compareIds.includes(product.id) ? "مقایسه ✓" : "مقایسه"}
            </button>
            <button className="button pdp-share" onClick={shareProduct}>
              {shared ? "لینک کپی شد ✓" : "اشتراک‌گذاری"}
            </button>
          </div>
          {compareIds.length > 0 && <Link className="compare-inline-link" href="/compare/">مشاهده مقایسه ({fa.format(compareIds.length)}/۳) ←</Link>}

          <div className="pdp-trust">
            <span>ضمانت اصالت</span>
            <span>ارسال قابل پیگیری</span>
            <span>پرداخت امن پس از اتصال درگاه</span>
          </div>
        </aside>
      </section>

      <section className="pdp-details-rich">
        <article>
          <span>01</span>
          <h2>چرا انتخابش کنیم؟</h2>
          <ul>{product.benefitsFa.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
        </article>
        <article>
          <span>02</span>
          <h2>روش استفاده</h2>
          <p>{product.usageFa}</p>
        </article>
        <article>
          <span>03</span>
          <h2>ترکیبات شاخص</h2>
          <div className="ingredient-chips">
            {product.ingredients.map((ingredient) => <span key={ingredient}>{ingredient}</span>)}
          </div>
        </article>
      </section>

      <section className="pdp-review-shell">
        <div>
          <p className="eyebrow">REVIEWS · VERIFIED PURCHASES</p>
          <h2>{product.rating} <span>/ 5</span></h2>
          <p>{fa.format(product.reviewCount)} امتیاز تجمیعی در کاتالوگ.</p>
        </div>
        <div className="review-policy">
          <strong>دیدگاه واقعی، نه متن ساختگی.</strong>
          <p>متن دیدگاه خریداران فقط بعد از اتصال سیستم سفارش و تایید خرید نمایش داده می‌شود. تا آن زمان هیچ testimonial ساختگی منتشر نمی‌شود.</p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="related-products">
          <div className="related-head">
            <div><p className="eyebrow">RELATED EDIT</p><h2>در همین حال‌وهوا.</h2></div>
            <Link href={"/shop/?category=" + encodeURIComponent(product.category)}>همه {product.category} ←</Link>
          </div>
          <div className="related-grid">
            {related.map((item) => (
              <article key={item.id}>
                <Link href={"/product/" + item.slug} className="related-image">
                  <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width:700px) 50vw,25vw" />
                </Link>
                <div><Link href={"/product/" + item.slug}>{item.nameFa}</Link><span>{money(item.price)}</span></div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="pdp-editorial">
        <div><p className="eyebrow">VELOURA OBJECTS</p><h2>محصول، بخشی از تجربه است؛ نه فقط یک کارت در فروشگاه.</h2></div>
        <span>03 / PRODUCT STORY</span>
      </section>

      <div className="pdp-mobile-buy">
        <div><small>{shade?.nameFa ?? product.category}</small><strong>{money(product.price)}</strong></div>
        <button onClick={addToCart}>{added ? "اضافه شد ✓" : "افزودن به سبد"}</button>
      </div>
    </main>
  );
}
