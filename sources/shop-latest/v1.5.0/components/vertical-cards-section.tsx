'use client'

import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { ALL_PRODUCTS, categoryLabelFa } from '@/lib/products'
import { formatToman, useStore } from '@/lib/store'

interface VerticalCardsSectionProps {
  title: string
  filter?: string
  startIndex?: number
}

export default function VerticalCardsSection({ title, filter = 'All', startIndex = 0 }: VerticalCardsSectionProps) {
  const { addToCart, toggleWishlist, wishlist } = useStore()
  const filteredProducts = filter === 'All'
    ? ALL_PRODUCTS.slice(startIndex, startIndex + 4)
    : ALL_PRODUCTS.filter(p => p.category?.toLowerCase() === filter.toLowerCase()).slice(0, 4)

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="h-px flex-1 bg-border mx-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? filteredProducts.map(product => (
            <article key={product.id} className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col">
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative h-64 bg-muted overflow-hidden">
                  <img src={product.image || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                </div>
                <div className="px-4 pt-4">
                  <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{categoryLabelFa(product.category)}</p>
                </div>
              </Link>
              <div className="px-4 pb-4 flex items-center justify-between gap-3 mt-auto">
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
          )) : (
            <div className="col-span-full text-center py-8"><p className="text-muted-foreground">محصولی در این دسته پیدا نشد.</p></div>
          )}
        </div>
      </div>
    </section>
  )
}
