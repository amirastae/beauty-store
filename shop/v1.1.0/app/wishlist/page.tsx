'use client'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { ALL_PRODUCTS } from '@/lib/products'
import { useStore, formatToman } from '@/lib/store'

export default function WishlistPage(){
  const {wishlist,toggleWishlist,addToCart}=useStore()
  const items=ALL_PRODUCTS.filter(p=>wishlist.includes(p.id))
  return <div className="min-h-screen bg-background flex flex-col"><Header/>
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10">
      <div className="mb-8"><p className="text-primary text-sm mb-2">VELOURA WISHLIST</p><h1 className="text-4xl md:text-5xl font-light">علاقه‌مندی‌ها</h1></div>
      {!items.length?<div className="min-h-[45vh] grid place-items-center text-center"><div>
        <Heart className="w-14 h-14 mx-auto mb-4 text-muted-foreground"/>
        <h2 className="text-2xl mb-3">هنوز چیزی ذخیره نکرده‌اید</h2>
        <p className="text-muted-foreground mb-6">محصولات موردعلاقه‌تان را با آیکن قلب ذخیره کنید.</p>
        <Link href="/shop-all" className="inline-block bg-primary text-primary-foreground px-7 py-3 rounded-full">مشاهده محصولات</Link>
      </div></div>:
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">{items.map(p=><article key={p.id} className="group bg-card rounded-2xl overflow-hidden border border-border">
        <Link href={`/product/${p.id}`} className="block overflow-hidden"><img src={p.image} alt={p.name} className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition duration-500"/></Link>
        <div className="p-4">
          <Link href={`/product/${p.id}`} className="font-semibold line-clamp-2">{p.name}</Link>
          <p className="text-primary font-bold mt-2">{formatToman(p.price)}</p>
          <div className="grid grid-cols-[1fr_auto] gap-2 mt-4">
            <button onClick={()=>addToCart(p.id)} className="bg-primary text-primary-foreground rounded-full py-2.5 px-4 flex items-center justify-center gap-2"><ShoppingCart className="w-4 h-4"/>افزودن به سبد</button>
            <button onClick={()=>toggleWishlist(p.id)} aria-label="حذف از علاقه‌مندی‌ها" className="w-11 h-11 grid place-items-center border rounded-full"><Trash2 className="w-4 h-4"/></button>
          </div>
        </div>
      </article>)}</div>}
    </main><Footer/></div>
}
