import CategoryPageClient from "@/components/category-page-client"

const slugs=["skincare-essentials","luxury-collections","trending-skincare","makeup-must-haves","best-sellers","sale-items","gift-sets"]
export function generateStaticParams(){ return slugs.map(slug=>({slug})) }

export default async function CategoryPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  return <CategoryPageClient slug={slug} />
}
