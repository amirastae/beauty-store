"use client";

import Image from "next/image";
import Link from "next/link";
import CommerceFooter from "@/components/commerce/CommerceFooter";
import { products } from "@/data/products";
import { discountPercent, formatFaNumber, formatToman } from "@/lib/locale";
import { useCart } from "@/store/cart";
import { useCompare } from "@/store/compare";
import { useWishlist } from "@/store/wishlist";

export default function WishlistPage() {
  const ids = useWishlist((state)=>state.ids);
  const toggle = useWishlist((state)=>state.toggle);
  const add = useCart((state)=>state.add);
  const cartCount = useCart((state)=>state.lines.reduce((sum,line)=>sum+line.qty,0));
  const compareIds = useCompare((state)=>state.ids);
  const toggleCompare = useCompare((state)=>state.toggle);
  const items = products.filter((product)=>ids.includes(product.id));

  return (
    <main className="utility-page">
      <header className="shop-nav">
        <Link href="/" className="brand">FATIKHAN</Link>
        <nav><Link href="/shop/">فروشگاه</Link><Link href="/compare/">مقایسه ({formatFaNumber(compareIds.length)})</Link><Link href="/cart/">سبد <span aria-live="polite">({formatFaNumber(cartCount)})</span></Link></nav>
      </header>
      <section className="utility-head"><p className="eyebrow">YOUR EDIT</p><h1>علاقه‌مندی‌ها</h1><p>{formatFaNumber(items.length)} محصول برای بعد ذخیره شده.</p></section>
      <section className="utility-content">
        {!items.length ? (
          <div className="empty-state"><h2>لیستت هنوز خالی است.</h2><Link className="button button-dark" href="/shop/">کشف محصولات</Link></div>
        ) : (
          <div className="product-grid light-grid">
            {items.map((product)=>{
              const discount=discountPercent(product.price,product.compareAtPrice);
              const compared=compareIds.includes(product.id);
              const compareDisabled=!compared && compareIds.length>=4;
              return (
                <article className="product-card" key={product.id}>
                  <Link className="product-media" href={"/product/"+product.slug}>
                    <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width:600px) 50vw,25vw"/>
                    {discount>0 && <span className="sale-pill">٪{formatFaNumber(discount)} تخفیف</span>}
                  </Link>
                  <div className="product-info">
                    <div className="product-heading">
                      <div><h3><Link href={"/product/"+product.slug}>{product.nameFa}</Link></h3><p>{product.nameEn}</p></div>
                      <div className="product-price-stack"><strong>{formatToman(product.price)}</strong>{product.compareAtPrice&&<del>{formatToman(product.compareAtPrice)}</del>}</div>
                    </div>
                    <div className="card-actions commerce-card-actions">
                      <button type="button" aria-label={"افزودن " + product.nameFa + " به سبد"} onClick={()=>add(product, product.shades?.[0]?.id)}>+ سبد</button>
                      <button type="button" aria-label={"حذف " + product.nameFa + " از علاقه‌مندی‌ها"} onClick={()=>toggle(product.id)}>حذف</button>
                      <button type="button" className={compared?"compare-toggle active":"compare-toggle"} aria-pressed={compared} aria-label={(compared ? "حذف " : "افزودن ") + product.nameFa + " " + (compared ? "از مقایسه" : "به مقایسه")} disabled={compareDisabled} title={compareDisabled ? "حداکثر ۴ محصول قابل مقایسه است" : undefined} onClick={()=>toggleCompare(product.id)}>{compared?"✓ مقایسه":"مقایسه"}</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <CommerceFooter />
</main>
  );
}
