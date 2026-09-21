'use client'

import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { ALL_PRODUCTS, categoryLabelFa } from '@/lib/products'
import { formatToman, useStore } from '@/lib/store'

interface ProductSliderProps { title: string }

export default function ProductSlider({ title }: ProductSliderProps) {
  const products = ALL_PRODUCTS.slice(0, 6)
  const { addToCart, toggleWishlist, wishlist } = useStore()

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-foreground">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <article key={product.id} className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative h-64 bg-muted overflow-hidden">
                  <img src={product.image || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                </div>
                <div className="px-4 pt-4">
                  <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{categoryLabelFa(product.category)}</p>
                </div>
              </Link>
              <div className="px-4 pb-4 flex items-center justify-between gap-3">
                <span className="text-xl font-bold text-primary">{formatToman(product.price)}</span>
                <div className="flex gap-2">
                  <button type="button" aria-label={wishlist.includes(product.id) ? `حذف ${product.name} از علاقه‌مندی‌ها` : `افزودن ${product.name} به علاقه‌مندی‌ها`} onClick={()=>toggleWishlist(product.id)} className="w-10 h-10 grid place-items-center border border-border rounded-full hover:bg-muted transition">
                    <Heart className={`w-4 h-4 text-primary ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button type="button" aria-label={`افزودن ${product.name} به سبد خرید`} onClick={()=>addToCart(product.id)} className="w-10 h-10 grid place-items-center bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
