import type { Metadata } from 'next'
import CategoryPageClient from '@/components/category-page-client'

const categories: Record<string,{title:string;description:string}> = {
  'skincare-essentials': { title:'مراقبت پوست', description:'محصولات منتخب مراقبت پوست در فروشگاه وِلورا.' },
  'luxury-collections': { title:'کالکشن لوکس', description:'کالکشن‌های منتخب و لوکس زیبایی وِلورا.' },
  'trending-skincare': { title:'محبوب‌های پوست', description:'منتخب محصولات مراقبت پوست وِلورا.' },
  'makeup-must-haves': { title:'منتخب آرایش', description:'محصولات ضروری و منتخب آرایش وِلورا.' },
  'best-sellers': { title:'پرفروش‌ها', description:'منتخب محصولات محبوب فروشگاه وِلورا.' },
  'sale-items': { title:'تخفیف‌ها', description:'محصولات منتخب آرایشی در دسته تخفیف وِلورا.' },
  'gift-sets': { title:'ست هدیه', description:'ست‌های زیبایی مناسب هدیه در وِلورا.' },
}

const slugs=Object.keys(categories)

export function generateStaticParams(){
  return slugs.map(slug=>({slug}))
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params
  const info=categories[slug]
  if(!info) return {title:'دسته‌بندی پیدا نشد',robots:{index:false,follow:false}}
  const path=`/categories/${slug}`
  return {
    title:info.title,
    description:info.description,
    alternates:{canonical:path},
    openGraph:{
      type:'website',
      url:path,
      title:`${info.title} | VELOURA`,
      description:info.description,
    },
  }
}

export default async function CategoryPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  return <CategoryPageClient slug={slug}/>
}
