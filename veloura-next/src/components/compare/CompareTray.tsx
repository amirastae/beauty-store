"use client";

import Link from "next/link";
import { products } from "@/data/products";
import { useCompare } from "@/store/compare";

export default function CompareTray(){
  const ids=useCompare((state)=>state.ids);
  const clear=useCompare((state)=>state.clear);
  if(!ids.length) return null;

  const selected=ids
    .map((id)=>products.find((product)=>product.id===id))
    .filter(Boolean);

  return <aside className="compare-tray" aria-label="محصولات آماده مقایسه">
    <div className="compare-tray-items">
      {selected.map((product)=>product&&<span key={product.id}>{product.nameFa}</span>)}
    </div>
    <div className="compare-tray-actions">
      <button onClick={clear}>پاک کردن</button>
      <Link href="/compare/">مقایسه {ids.length}/۳ ←</Link>
    </div>
  </aside>;
}
