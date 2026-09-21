"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

export default function MobileDock(){
  const path=usePathname();
  const [cinematicHidden,setCinematicHidden]=useState(path==="/");

  useEffect(()=>{
    if(path!=="/"){ setCinematicHidden(false); return; }
    const update=()=>{
      const hero=document.querySelector<HTMLElement>(".cinematic-hero");
      if(!hero){ setCinematicHidden(false); return; }
      setCinematicHidden(hero.getBoundingClientRect().bottom > window.innerHeight * .98);
    };
    update();
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update);
    return ()=>{
      window.removeEventListener("scroll",update);
      window.removeEventListener("resize",update);
    };
  },[path]);
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

  return <nav className={cinematicHidden?"mobile-dock cinematic-hidden":"mobile-dock"} aria-label="ناوبری سریع موبایل">
    {item("/","خانه","⌂")}
    {item("/shop/","فروشگاه","◫")}
    {item("/search/","جستجو","⌕")}
    {item("/wishlist/","علاقه‌مندی","♡",wishCount)}
    {item("/cart/","سبد","◌",cartCount)}
  </nav>;
}
