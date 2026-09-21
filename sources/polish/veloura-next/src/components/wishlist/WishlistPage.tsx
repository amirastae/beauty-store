"use client";

import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

const fa = new Intl.NumberFormat("fa-IR");
const money=(v:number)=>fa.format(v)+" تومان";

export default function WishlistPage() {
  const ids = useWishlist((state)=>state.ids);
  const toggle = useWishlist((state)=>state.toggle);
  const add = useCart((state)=>state.add);
  const items = products.filter((product)=>ids.includes(product.id));

  return (
    <main className="utility-page">
      <header className="shop-nav"><Link href="/" className="brand">VELOURA</Link><Link href="/shop/">فروشگاه ←</Link></header>
      <section className="utility-head"><p className="eyebrow">YOUR EDIT</p><h1>علاقه‌مندی‌ها</h1><p>محصولاتی که برای بعد نگه داشته‌ای.</p></section>
      <section className="utility-content">
        {!items.length ? (
          <div className="empty-state"><h2>لیستت هنوز خالی است.</h2><Link className="button button-dark" href="/shop/">کشف محصولات</Link></div>
        ) : (
          <div className="product-grid light-grid">
            {items.map((product)=>(
              <article className="product-card" key={product.id}>
                <Link className="product-media" href={"/product/"+product.slug}><Image src={product.image} alt={product.imageAlt} fill sizes="(max-width:600px) 50vw,25vw"/></Link>
                <div className="product-info">
                  <div className="product-heading"><div><h3>{product.nameFa}</h3><p>{product.nameEn}</p></div><strong>{money(product.price)}</strong></div>
                  <div className="card-actions"><button onClick={()=>add(product, product.shades?.[0]?.id)}>+ سبد</button><button onClick={()=>toggle(product.id)}>حذف</button></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
