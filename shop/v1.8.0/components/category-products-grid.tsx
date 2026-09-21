'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { ALL_PRODUCTS } from '@/lib/products'
import { formatToman, useStore } from '@/lib/store'

export default function CategoryProductsGrid({category,title,description}:{category?:string;title:string;description:string}){
  const {addToCart}=useStore()
  const products=category ? ALL_PRODUCTS.filter(product=>product.category===category) : ALL_PRODUCTS

  return <>
    <section className="bg-secondary/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </section>

    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product=><article key={product.id} className="group">
            <Link href={`/product/${product.id}`} className="block">
              <div className="relative bg-muted rounded-lg overflow-hidden mb-4 aspect-square">
                <img src={product.image||'/placeholder.svg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
              </div>
              <h2 className="font-semibold text-foreground">{product.name}</h2>
            </Link>
            <div className="flex items-center justify-between gap-3 mt-2">
              <p className="text-lg font-bold text-primary">{formatToman(product.price)}</p>
              <button
                type="button"
                aria-label={`افزودن ${product.name} به سبد خرید`}
                onClick={()=>addToCart(product.id)}
                className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition"
              >
                <ShoppingCart className="w-5 h-5"/>
              </button>
            </div>
          </article>)}
        </div>
      </div>
    </section>
  </>
}
