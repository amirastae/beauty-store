import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { ALL_PRODUCTS, categoryLabelFa } from '@/lib/products'
import { formatToman } from '@/lib/store'

interface ProductSliderProps {
  title: string
}

export default function ProductSlider({ title }: ProductSliderProps) {
  const products = ALL_PRODUCTS.slice(0, 6)

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-foreground">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition block"
            >
              <div className="relative h-64 bg-muted overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition"
                >
                  <Heart className="w-5 h-5 text-primary" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{categoryLabelFa(product.category)}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">{formatToman(product.price)}</span>
                  <button 
                    onClick={(e) => e.preventDefault()}
                    className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
