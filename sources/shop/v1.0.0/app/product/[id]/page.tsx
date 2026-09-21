import { ALL_PRODUCTS } from "@/lib/products"
import ProductPageClient from "@/components/product-page-client"

export function generateStaticParams(){
  return ALL_PRODUCTS.map((p)=>({id:String(p.id)}))
}

export default async function ProductPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params
  return <ProductPageClient productId={Number(id)} />
}
