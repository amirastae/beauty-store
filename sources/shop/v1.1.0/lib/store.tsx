'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ALL_PRODUCTS } from '@/lib/products'

type CartLine = { id:number; qty:number }
type Store = {
  cart: CartLine[]
  wishlist: number[]
  addToCart:(id:number, qty?:number)=>void
  removeFromCart:(id:number)=>void
  setQty:(id:number, qty:number)=>void
  toggleWishlist:(id:number)=>void
  clearCart:()=>void
  cartCount:number
  subtotal:number
}

const Ctx=createContext<Store|null>(null)

export function StoreProvider({children}:{children:React.ReactNode}){
  const [cart,setCart]=useState<CartLine[]>([])
  const [wishlist,setWishlist]=useState<number[]>([])
  const [ready,setReady]=useState(false)
  useEffect(()=>{
    try{
      setCart(JSON.parse(localStorage.getItem('veloura_cart')||'[]'))
      setWishlist(JSON.parse(localStorage.getItem('veloura_wishlist')||'[]'))
    }catch{}
    setReady(true)
  },[])
  useEffect(()=>{if(ready)localStorage.setItem('veloura_cart',JSON.stringify(cart))},[cart,ready])
  useEffect(()=>{if(ready)localStorage.setItem('veloura_wishlist',JSON.stringify(wishlist))},[wishlist,ready])
  const addToCart=(id:number,qty=1)=>setCart(c=>{
    const x=c.find(i=>i.id===id)
    return x?c.map(i=>i.id===id?{...i,qty:i.qty+qty}:i):[...c,{id,qty}]
  })
  const removeFromCart=(id:number)=>setCart(c=>c.filter(i=>i.id!==id))
  const setQty=(id:number,qty:number)=>qty<=0?removeFromCart(id):setCart(c=>c.map(i=>i.id===id?{...i,qty}:i))
  const toggleWishlist=(id:number)=>setWishlist(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])
  const clearCart=()=>setCart([])
  const cartCount=cart.reduce((n,i)=>n+i.qty,0)
  const subtotal=cart.reduce((sum,i)=>sum+(ALL_PRODUCTS.find(p=>p.id===i.id)?.price||0)*i.qty,0)
  const value=useMemo(()=>({cart,wishlist,addToCart,removeFromCart,setQty,toggleWishlist,clearCart,cartCount,subtotal}),[cart,wishlist,cartCount,subtotal])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(){
  const v=useContext(Ctx)
  if(!v) throw new Error('useStore must be used inside StoreProvider')
  return v
}
export const formatToman=(price:number)=>new Intl.NumberFormat('fa-IR').format(Math.round(price*100000))+' تومان'
