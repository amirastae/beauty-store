'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const HomeLowerSections=dynamic(()=>import('@/components/home-lower-sections'),{
  ssr:false,
  loading:()=> <div className="max-w-7xl mx-auto px-4 py-16"><div className="h-52 rounded-3xl bg-muted animate-pulse"/></div>,
})

export default function DeferredHomeSections(){
  const ref=useRef<HTMLDivElement>(null)
  const [ready,setReady]=useState(false)

  useEffect(()=>{
    const node=ref.current
    if(!node)return
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){
        setReady(true)
        observer.disconnect()
      }
    },{rootMargin:'700px'})
    observer.observe(node)
    return()=>observer.disconnect()
  },[])

  return <div ref={ref} className="min-h-[240px]">
    {ready?<HomeLowerSections/>:<div className="max-w-7xl mx-auto px-4 py-16"><div className="h-52 rounded-3xl bg-muted/60"/></div>}
  </div>
}
