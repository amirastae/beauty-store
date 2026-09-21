'use client'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import { ShoppingBag, Trash2, Minus, Plus } from 'lucide-react'
import { ALL_PRODUCTS, categoryLabelFa } from '@/lib/products'
import { useStore, formatToman } from '@/lib/store'

export default function CartPage(){
  const {cart,setQty,removeFromCart,subtotal}=useStore()
  return <div className="min-h-screen bg-background flex flex-col"><Header/>
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div><p className="text-primary text-sm mb-2">VELOURA • سبد خرید</p>
          <h1 className="text-4xl md:text-5xl font-light">سبد خرید شما</h1></div>
        <span className="text-muted-foreground">{new Intl.NumberFormat('fa-IR').format(cart.length)} محصول</span>
      </div>
      {cart.length===0 ? <div className="min-h-[45vh] grid place-items-center text-center"><div>
        <ShoppingBag className="w-14 h-14 mx-auto mb-4 text-muted-foreground"/>
        <h2 className="text-2xl mb-3">سبد خرید خالی است</h2>
        <Link className="inline-block bg-primary text-primary-foreground px-7 py-3 rounded-full" href="/shop-all">مشاهده محصولات</Link>
      </div></div> :
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-4">{cart.map(line=>{
          const p=ALL_PRODUCTS.find(x=>x.id===line.id); if(!p)return null
          return <article key={line.id} className="grid grid-cols-[110px_1fr_auto] gap-4 p-4 bg-card rounded-2xl border border-border">
            <Link href={`/product/${p.id}`}><img src={p.image} alt={p.name} className="w-full aspect-square object-cover rounded-xl"/></Link>
            <div><Link href={`/product/${p.id}`} className="font-semibold text-lg">{p.name}</Link>
              <p className="text-muted-foreground text-sm mt-1">{categoryLabelFa(p.category)}</p>
              <strong className="block mt-3 text-primary">{formatToman(p.price)}</strong>
              <div className="flex items-center gap-3 mt-4">
                <button aria-label="کاهش تعداد" onClick={()=>setQty(p.id,line.qty-1)} className="w-9 h-9 border rounded-full grid place-items-center"><Minus className="w-4 h-4"/></button>
                <span>{new Intl.NumberFormat('fa-IR').format(line.qty)}</span>
                <button aria-label="افزایش تعداد" onClick={()=>setQty(p.id,line.qty+1)} className="w-9 h-9 border rounded-full grid place-items-center"><Plus className="w-4 h-4"/></button>
              </div>
            </div>
            <button onClick={()=>removeFromCart(p.id)} aria-label="حذف" className="self-start p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-5 h-5"/></button>
          </article>})}</div>
        <aside className="bg-card border border-border rounded-2xl p-6 h-fit sticky top-28">
          <h2 className="text-xl font-semibold mb-6">خلاصه سفارش</h2>
          <div className="flex justify-between py-3 border-b"><span>جمع کالاها</span><strong>{formatToman(subtotal)}</strong></div>
          <div className="flex justify-between py-3 border-b"><span>ارسال</span><span>رایگان</span></div>
          <div className="flex justify-between text-xl py-5"><span>مبلغ نهایی</span><strong className="text-primary">{formatToman(subtotal)}</strong></div>
          <Link href="/checkout" className="block text-center bg-primary text-primary-foreground rounded-full py-3.5 font-semibold">ادامه و ثبت سفارش</Link>
        </aside>
      </div>}
    </main><Footer/></div>
}
