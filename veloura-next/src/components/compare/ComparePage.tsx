"use client";

import Image from "next/image";
import Link from "next/link";
import CommerceFooter from "@/components/commerce/CommerceFooter";
import { products, type Product } from "@/data/products";
import { formatFaNumber, formatToman } from "@/lib/locale";
import { useCart } from "@/store/cart";
import { useCompare } from "@/store/compare";

export default function ComparePage() {
  const ids = useCompare((state) => state.ids);
  const remove = useCompare((state) => state.remove);
  const clear = useCompare((state) => state.clear);
  const add = useCart((state) => state.add);
  const cartCount = useCart((state) => state.lines.reduce((sum, line) => sum + line.qty, 0));
  const items = ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  return (
    <main className="utility-page compare-page">
      <header className="shop-nav">
        <Link href="/" className="brand">VELOURA</Link>
        <nav><Link href="/shop/">فروشگاه</Link><Link href="/cart/">سبد خرید <span aria-live="polite">({formatFaNumber(cartCount)})</span></Link></nav>
      </header>

      <section className="utility-head">
        <p className="eyebrow">COMPARE · UP TO 4</p>
        <h1>مقایسه محصولات</h1>
        <p>{formatFaNumber(items.length)} محصول انتخاب شده.</p>
      </section>

      <section className="utility-content">
        {!items.length ? (
          <div className="empty-state">
            <h2>هنوز محصولی برای مقایسه انتخاب نکردی.</h2>
            <p>از فروشگاه حداکثر ۴ محصول را انتخاب کن و تفاوت قیمت، دسته و رنگ‌ها را کنار هم ببین.</p>
            <Link className="button button-dark" href="/shop/">انتخاب محصولات</Link>
          </div>
        ) : (
          <>
            <div className="compare-toolbar">
              <span>مقایسه هم‌زمان تا ۴ محصول</span>
              <button type="button" onClick={clear}>پاک کردن همه</button>
            </div>
            <div className="compare-scroller">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th aria-label="ویژگی" />
                    {items.map((product) => (
                      <th key={product.id}>
                        <button className="compare-remove" type="button" onClick={() => remove(product.id)} aria-label={"حذف " + product.nameFa}>×</button>
                        <Link href={"/product/" + product.slug}>
                          <span className="compare-image"><Image src={product.image} alt={product.imageAlt} fill sizes="180px"/></span>
                          <strong>{product.nameFa}</strong>
                          <small>{product.nameEn}</small>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr><th>قیمت</th>{items.map((product)=><td key={product.id}>{formatToman(product.price)}</td>)}</tr>
                  <tr><th>دسته</th>{items.map((product)=><td key={product.id}>{product.category}</td>)}</tr>
                  <tr><th>برند</th>{items.map((product)=><td key={product.id}>{product.brand}</td>)}</tr>
                  <tr>
                    <th>رنگ‌ها</th>
                    {items.map((product)=>(
                      <td key={product.id}>
                        {product.shades?.length ? (
                          <div className="compare-swatches">
                            {product.shades.map((shade)=><i key={shade.id} title={shade.nameFa} style={{backgroundColor:shade.hex}} />)}
                          </div>
                        ) : "—"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th />
                    {items.map((product)=>(
                      <td key={product.id}>
                        <button className="button button-dark compare-add" onClick={()=>add(product,product.shades?.[0]?.id)}>افزودن به سبد</button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
      <CommerceFooter />
</main>
  );
}
