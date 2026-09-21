import Link from 'next/link'
import Header from '@/components/header'
import Hero3D from '@/components/hero-3d'
import SmallSquareCards from '@/components/small-square-cards'
import AutoCarouselSection from '@/components/auto-carousel-section'
import DeferredHomeSections from '@/components/deferred-home-sections'
import Footer from '@/components/footer'

export default function Home(){
  return <main id="main-content" className="min-h-screen bg-background">
    <Header/>

    <section className="relative overflow-hidden bg-[#160f15] text-white min-h-[72vh] grid lg:grid-cols-2 items-center px-6 md:px-12">
      <div className="relative z-10 max-w-2xl py-16">
        <p className="text-xs md:text-sm tracking-[.28em] text-[#d9a9c1] mb-5">VELOURA • زیبایی در حرکت</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[.92] font-light mb-7">زیبایی را<br/><span className="font-serif italic text-[#e9bfd2]">زندگی کن.</span></h1>
        <p className="text-white/70 max-w-lg leading-8 mb-8">منتخبی از آرایش، مراقبت پوست، عطر و محصولات زیبایی با تجربه‌ای لوکس، سریع و شخصی.</p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/shop-all" className="bg-white text-black px-7 py-3 rounded-full">مشاهده فروشگاه</Link>
          <Link href="/skincare" className="border border-white/25 px-7 py-3 rounded-full">کالکشن پوست</Link>
        </div>
      </div>
      <div className="relative min-h-[520px]">
        <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,#7f385c55,transparent_62%)] blur-xl"/>
        <Hero3D/>
      </div>
    </section>

    <SmallSquareCards/>
    <AutoCarouselSection title="منتخب‌های وِلورا"/>
    <DeferredHomeSections/>
    <Footer/>
  </main>
}
