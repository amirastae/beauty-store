'use client'

import { useState } from 'react'
import HeroSlider from '@/components/hero-slider'
import VerticalCardsSection from '@/components/vertical-cards-section'
import FilterBarSection from '@/components/filter-bar-section'
import MixedCardsSection from '@/components/mixed-cards-section'

export default function HomeLowerSections(){
  const [selectedFilter,setSelectedFilter]=useState('All')
  return <>
    <HeroSlider/>
    <VerticalCardsSection title="کالکشن ویژه" filter={selectedFilter} startIndex={0}/>
    <FilterBarSection selectedFilter={selectedFilter} onFilterChange={setSelectedFilter}/>
    <MixedCardsSection filter={selectedFilter}/>
    <VerticalCardsSection title="تازه‌رسیده‌ها" filter={selectedFilter} startIndex={4}/>
  </>
}
