'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import type { CarouselApi } from '@/components/ui/carousel'
import { ShoppingCart, Heart } from 'lucide-react'
import { ALL_PRODUCTS, categoryLabelFa } from '@/lib/products'
import { formatToman, useStore } from '@/lib/store'

interface AutoCarouselSectionProps {
  title?: string
}

export default function AutoCarouselSection({ title = 'محصولات منتخب' }: AutoCarouselSectionProps) {
  const categories = ['skincare', 'makeup', 'wellness', 'fragrance', 'sets', 'haircare']
  const carouselProducts = categories.map((category, index) => {
    const categoryProducts = ALL_PRODUCTS.filter(p => p.category === category)
    if (!categoryProducts.length) return null
    return categoryProducts[index % categoryProducts.length]
  }).filter((product): product is (typeof ALL_PRODUCTS)[number] => Boolean(product))

  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const { addToCart, toggleWishlist, wishlist } = useStore()
  const count = carouselProducts.length

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on('select', onSelect)
    api.on('reInit', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  useEffect(() => {
    if (!api) return
    const timer = window.setInterval(() => api.scrollNext(), 5000)
    return () => window.clearInterval(timer)
  }, [api])

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <div className="h-px flex-1 bg-border mx-4" />
        </div>

        <div className="relative">
          <Carousel opts={{ align: 'start', loop: true }} setApi={setApi} className="w-full">
            <CarouselContent>
              {carouselProducts.map((product) => (
                <CarouselItem key={product.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Link href={`/product/${product.id}`} className="group">
                    <div className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col h-full">
                      <div className="relative h-64 bg-muted overflow-hidden">
                        <img
                          src={product.image || '/placeholder.svg'}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <button
                          type="button"
                          aria-label="افزودن به علاقه‌مندی‌ها"
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            toggleWishlist(product.id)
                          }}
                          className="absolute top-4 right-4 bg-white/85 p-2 rounded-full hover:bg-white transition"
                        >
                          <Heart className={`w-5 h-5 text-primary ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{categoryLabelFa(product.category)}</p>

                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xl font-bold text-primary">{formatToman(product.price)}</span>
                          <button
                            type="button"
                            aria-label="افزودن به سبد خرید"
                            onClick={(event) => {
                              event.preventDefault()
                              event.stopPropagation()
                              addToCart(product.id)
                            }}
                            className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="flex justify-center gap-2 mt-6" aria-label="کنترل اسلایدر محصولات">
            {Array.from({ length: count }).map((_, index) => (
              <button
                type="button"
                aria-label={`رفتن به اسلاید ${index + 1}`}
                key={index}
                className={`h-2 rounded-full transition-all ${index === current ? 'bg-primary w-6' : 'bg-muted-foreground w-2'}`}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
