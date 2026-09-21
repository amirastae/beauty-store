'use client'

import Link from 'next/link'
import { ALL_PRODUCTS, categoryLabelFa } from '@/lib/products'
import { ShoppingCart } from 'lucide-react'
import { useStore, formatToman } from '@/lib/store'

// Map category slugs to product categories
const categoryMap: Record<string, { name: string; category: string }> = {
  'skincare-essentials': { name: 'مراقبت پوست', category: 'skincare' },
  'luxury-collections': { name: 'کالکشن لوکس', category: 'sets' },
  'trending-skincare': { name: 'محبوب‌های پوست', category: 'skincare' },
  'makeup-must-haves': { name: 'منتخب آرایش', category: 'makeup' },
  'best-sellers': { name: 'پرفروش‌ها', category: 'skincare' },
  'sale-items': { name: 'تخفیف‌ها', category: 'makeup' },
  'gift-sets': { name: 'ست هدیه', category: 'sets' },
}

export default function CategoryPageClient({slug}:{slug:string}) {
  const { addToCart } = useStore()
  const categoryInfo = categoryMap[slug]

  if (!categoryInfo) {
    return (
      <div className="py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">دسته‌بندی پیدا نشد</h1>
        <Link href="/" className="text-primary hover:underline">
          Back to خانه
        </Link>
      </div>
    )
  }

  const products = ALL_PRODUCTS.filter(p => p.category === categoryInfo.category)

  const handleAddToCart = (e: React.MouseEvent, productName: string) => {
    e.preventDefault()
    e.stopPropagation()
    const product = ALL_PRODUCTS.find(p=>p.name===productName)
    if(product) addToCart(product.id)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="mb-12">
          <Link href="/" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to خانه
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            {categoryInfo.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            نمایش {products.length} products
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group block h-full"
            >
              <div className="bg-muted/50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition h-full flex flex-col">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-muted h-48 md:h-48 rounded-xl md:rounded-none">
                  <img
                    src={product.image || '/placeholder.svg?height=192&width=300&query=cosmetic-product'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{categoryLabelFa(product.category)}</p>
                  </div>

                  {/* Price and Cart Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {formatToman(product.price)}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, product.name)}
                      className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground w-10 h-10 rounded-full items-center justify-center transition flex-shrink-0"
                      aria-label="افزودن به سبد"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">محصولی در این دسته پیدا نشد.</p>
          </div>
        )}
      </div>
    </div>
  )
}
