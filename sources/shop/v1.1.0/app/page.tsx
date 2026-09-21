'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Hero3D from '@/components/hero-3d'
import SmallSquareCards from '@/components/small-square-cards'
import VerticalCardsSection from '@/components/vertical-cards-section'
import FilterBarSection from '@/components/filter-bar-section'
import MixedCardsSection from '@/components/mixed-cards-section'
import HeroSlider from '@/components/hero-slider'
import Footer from '@/components/footer'
import AutoCarouselSection from '@/components/auto-carousel-section'

export default function خانه() {
  const [selectedFilter, setSelectedFilter] = useState('All')

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="relative overflow-hidden bg-[#160f15] text-white min-h-[72vh] grid lg:grid-cols-2 items-center px-6 md:px-12">
        <div className="relative z-10 max-w-2xl py-16">
          <p className="text-xs md:text-sm tracking-[.28em] text-[#d9a9c1] mb-5">VELOURA • BEAUTY IN MOTION</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[.92] font-light mb-7">زیبایی را<br/><span className="font-serif italic text-[#e9bfd2]">زندگی کن.</span></h1>
          <p className="text-white/70 max-w-lg leading-8 mb-8">منتخبی از آرایش، مراقبت پوست، عطر و محصولات زیبایی با تجربه‌ای لوکس، سریع و شخصی.</p>
          <div className="flex gap-3 flex-wrap">
            <a href="/shop-all" className="bg-white text-black px-7 py-3 rounded-full">مشاهده فروشگاه</a>
            <a href="/skincare" className="border border-white/25 px-7 py-3 rounded-full">کالکشن پوست</a>
          </div>
        </div>
        <div className="relative min-h-[520px]">
          <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,#7f385c55,transparent_62%)] blur-xl"/>
          <Hero3D/>
        </div>
      </section>
      
      {/* Row of 5 small square cards */}
      <SmallSquareCards />
      
      <AutoCarouselSection title="منتخب‌های وِلورا" />
      
      <HeroSlider />
      
      {/* Section with title bar and 4 vertical cards */}
      <VerticalCardsSection title="کالکشن ویژه" filter={selectedFilter} startIndex={0} />
      
      {/* Filter bar section with tab indicator */}
      <FilterBarSection selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
      
      {/* Mixed rows: 2 wide cards + 3 smaller cards */}
      <MixedCardsSection filter={selectedFilter} />
      
      {/* Another vertical cards section */}
      <VerticalCardsSection title="تازه‌رسیده‌ها" filter={selectedFilter} startIndex={4} />
      
      <Footer />
    </main>
  )
}
