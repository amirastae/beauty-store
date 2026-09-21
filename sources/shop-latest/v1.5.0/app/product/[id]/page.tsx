import type { Metadata } from 'next'
import { ALL_PRODUCTS, categoryLabelFa } from '@/lib/products'
import ProductPageClient from '@/components/product-page-client'

export function generateStaticParams(){
  return ALL_PRODUCTS.map(product=>({id:String(product.id)}))
}

export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{
  const {id}=await params
  const product=ALL_PRODUCTS.find(item=>item.id===Number(id))
  if(!product) return {title:'محصول پیدا نشد',robots:{index:false,follow:false}}
  const path=`/product/${product.id}`
  return {
    title:product.name,
    description:`${product.name} از دسته ${categoryLabelFa(product.category)}؛ مشاهده ترکیبات، روش مصرف و قیمت در فروشگاه وِلورا.`,
    alternates:{canonical:path},
    openGraph:{
      type:'website',
      url:path,
      title:`${product.name} | VELOURA`,
      description:`مشاهده ${product.name} در فروشگاه وِلورا`,
      images:[{url:product.image,alt:product.name}],
    },
  }
}

export default async function ProductPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params
  return <ProductPageClient productId={Number(id)}/>
}
