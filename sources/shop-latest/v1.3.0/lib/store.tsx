'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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

const readCart = (): CartLine[] => {
  try {
    const raw = JSON.parse(localStorage.getItem('veloura_cart') || '[]')
    if (!Array.isArray(raw)) return []
    return raw
      .filter((item): item is CartLine => Number.isInteger(item?.id) && Number.isFinite(item?.qty))
      .map(item => ({ id: item.id, qty: Math.max(1, Math.min(99, Math.floor(item.qty))) }))
  } catch {
    return []
  }
}

const readWishlist = (): number[] => {
  try {
    const raw = JSON.parse(localStorage.getItem('veloura_wishlist') || '[]')
    return Array.isArray(raw) ? raw.filter(id => Number.isInteger(id)) : []
  } catch {
    return []
  }
}

export function StoreProvider({children}:{children:React.ReactNode}){
  const [cart,setCart]=useState<CartLine[]>([])
  const [wishlist,setWishlist]=useState<number[]>([])
  const [ready,setReady]=useState(false)

  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      setCart(readCart())
      setWishlist(readWishlist())
      setReady(true)
    })
    return()=>cancelAnimationFrame(frame)
  },[])

  useEffect(()=>{
    if(ready) localStorage.setItem('veloura_cart',JSON.stringify(cart))
  },[cart,ready])

  useEffect(()=>{
    if(ready) localStorage.setItem('veloura_wishlist',JSON.stringify(wishlist))
  },[wishlist,ready])

  const addToCart=(id:number,qty=1)=>setCart(current=>{
    const safeQty=Math.max(1,Math.min(99,Math.floor(qty)))
    const existing=current.find(item=>item.id===id)
    return existing
      ? current.map(item=>item.id===id?{...item,qty:Math.min(99,item.qty+safeQty)}:item)
      : [...current,{id,qty:safeQty}]
  })

  const removeFromCart=(id:number)=>setCart(current=>current.filter(item=>item.id!==id))
  const setQty=(id:number,qty:number)=>qty<=0
    ? removeFromCart(id)
    : setCart(current=>current.map(item=>item.id===id?{...item,qty:Math.min(99,Math.floor(qty))}:item))
  const toggleWishlist=(id:number)=>setWishlist(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id])
  const clearCart=()=>setCart([])

  const cartCount=cart.reduce((total,item)=>total+item.qty,0)
  const subtotal=cart.reduce((sum,item)=>sum+(ALL_PRODUCTS.find(product=>product.id===item.id)?.price||0)*item.qty,0)

  const value: Store={cart,wishlist,addToCart,removeFromCart,setQty,toggleWishlist,clearCart,cartCount,subtotal}
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore(){
  const value=useContext(Ctx)
  if(!value) throw new Error('useStore must be used inside StoreProvider')
  return value
}

export const formatToman=(price:number)=>new Intl.NumberFormat('fa-IR').format(Math.round(price*100000))+' تومان'
