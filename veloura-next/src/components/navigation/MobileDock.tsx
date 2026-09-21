"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

export default function MobileDock(){
  const path=usePathname();
  const cartCount=useCart((state)=>state.lines.reduce((sum,line)=>sum+line.qty,0));
  const wishCount=useWishlist((state)=>state.ids.length);

  const item=(href:string,label:string,icon:string,count?:number)=>{
    const active=href==="/" ? path==="/" : path.startsWith(href);
    return <Link href={href} className={active?"dock-item active":"dock-item"} aria-current={active?"page":undefined}>
      <span className="dock-icon" aria-hidden="true">{icon}</span>
      <span>{label}</span>
      {count ? <b>{count>9?"9+":count}</b> : null}
    </Link>;
  };

  return <nav className="mobile-dock" aria-label="ناوبری سریع موبایل">
    {item("/","خانه","⌂")}
    {item("/shop/","فروشگاه","◫")}
    {item("/wishlist/","علاقه‌مندی","♡",wishCount)}
    {item("/cart/","سبد","◌",cartCount)}
  </nav>;
}
