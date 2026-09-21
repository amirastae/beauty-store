'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Search, ChevronDown, AlertCircle, CheckCircle, Clock, Phone, Mail, MessageSquare } from 'lucide-react'

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'order' | 'product' | 'returns'>(
    'order'
  )

  const faqItems = [
    {
      category: 'order',
      q: 'How long does standard shipping take?',
      a: 'Standard shipping typically takes 5-7 business days to most locations. Express shipping is available for 2-3 day delivery. You can track your order in real-time through your account dashboard.'
    },
    {
      category: 'product',
      q: 'Are all products cruelty-free and vegan?',
      a: 'اطلاعات مربوط به تست حیوانی، ترکیبات و استانداردهای هر محصول در صفحه همان محصول نمایش داده می‌شود.'
    },
    {
      category: 'returns',
      q: 'What is your return policy?',
      a: 'We offer a 30-day money-back guarantee on all unused, unopened products. We also accept exchanges if you want to try a different shade or size. Return shipping is free.'
    },
    {
      category: 'product',
      q: 'Can I get personalized shade matching?',
      a: 'Our beauty advisors can help you find the perfect shade. Email us a photo with natural lighting, schedule a virtual consultation, or use our interactive shade matcher tool.'
    },
    {
      category: 'order',
      q: 'What if my product arrives damaged?',
      a: 'Contact us immediately with photos. We will ship a replacement right away at no cost and arrange a free pickup for the damaged product. Your satisfaction is guaranteed.'
    },
    {
      category: 'returns',
      q: 'How do I initiate a return or exchange?',
      a: 'Log into your account, go to Order History, select the item, and choose Return or Exchange. Print the prepaid label and ship it back. Refunds process within 5-7 business days of receipt.'
    },
    {
      category: 'product',
      q: 'Do you offer product recommendations?',
      a: 'Yes, our experts provide personalized recommendations. Fill out our skincare quiz or beauty profile, and we will suggest products tailored to your skin type, concerns, and preferences.'
    },
    {
      category: 'order',
      q: 'Do you offer international shipping?',
      a: 'We ship to over 50 countries. International orders typically take 10-14 business days. International customers can view all applicable duties and taxes at checkout.'
    }
  ]

  useEffect(() => {
    if (searchQuery.trim()) {
      // Find all matching FAQs across all categories
      const matchingItems = faqItems.filter(item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
      )

      if (matchingItems.length > 0) {
        // Automatically switch to the tab with the first matching result
        const firstMatchCategory = matchingItems[0].category
        setActiveTab(firstMatchCategory as 'order' | 'product' | 'returns')
        
        // Expand the first matching FAQ
        const firstMatchIndex = faqItems.findIndex(
          item => item === matchingItems[0]
        )
        setExpandedFaq(firstMatchIndex)
      }
    }
  }, [searchQuery])

  const filteredFaqs = faqItems.filter(item => {
    const matchesTab = item.category === activeTab
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.a.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Support Center
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Find answers, track orders, and connect with our dedicated beauty experts whenever you need assistance.
            </p>
          </div>

          {/* Hero Image */}
          <div className="mb-16 rounded-2xl overflow-hidden h-96">
            <img 
              src="/support-hero.jpg" 
              alt="Customer support team" 
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <p className="text-muted-foreground font-medium">راه‌های پشتیبانی</p>
            <p className="text-sm text-muted-foreground mt-2">چت، ایمیل یا تماس</p>
          </div>
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <div className="text-4xl font-bold text-primary mb-2">{'<'} 45 min</div>
            <p className="text-muted-foreground font-medium">میانگین پاسخ‌گویی</p>
            <p className="text-sm text-muted-foreground mt-2">در ساعات کاری</p>
          </div>
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <div className="text-4xl font-bold text-primary mb-2">۳۰ روز</div>
            <p className="text-muted-foreground font-medium">ضمانت بازگشت وجه</p>
            <p className="text-sm text-muted-foreground mt-2">طبق شرایط بازگشت کالا</p>
          </div>
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <div className="text-4xl font-bold text-primary mb-2">۵هزار+</div>
            <p className="text-muted-foreground font-medium">مشتری راضی</p>
            <p className="text-sm text-muted-foreground mt-2">امتیاز ۴٫۹ از ۵</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">دسترسی سریع</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:bg-card/50 transition text-left">
              <Clock className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">پیگیری سفارش</h3>
              <p className="text-sm text-muted-foreground">مشاهده وضعیت و جزئیات ارسال</p>
            </button>
            <button className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:bg-card/50 transition text-left">
              <AlertCircle className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">درخواست مرجوعی</h3>
              <p className="text-sm text-muted-foreground">ثبت درخواست بازگشت یا تعویض</p>
            </button>
            <button className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:bg-card/50 transition text-left">
              <Search className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">راهنمای محصول</h3>
              <p className="text-sm text-muted-foreground">مشاهده راهنمای محصولات</p>
            </button>
            <button className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:bg-card/50 transition text-left">
              <MessageSquare className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">گفت‌وگو با پشتیبانی</h3>
              <p className="text-sm text-muted-foreground">دریافت راهنمایی متناسب با نیاز شما</p>
            </button>
          </div>
        </section>

        {/* Search Bar */}
        <section className="mb-16">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="جست‌وجو در راهنما و پاسخ‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </section>

        {/* Knowledge Base Tabs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">مرکز راهنما</h2>
          
          <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
            {[
              { id: 'order' as const, label: 'Orders & Shipping' },
              { id: 'product' as const, label: 'Products & Selection' },
              { id: 'returns' as const, label: 'Returns & Exchanges' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSearchQuery('')
                  setExpandedFaq(null)
                }}
                className={`pb-4 font-medium whitespace-nowrap transition ${ 
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4 max-w-3xl">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, idx) => {
                const originalIndex = faqItems.findIndex(faq => faq === item)
                return (
                  <button
                    key={idx}
                    onClick={() => setExpandedFaq(expandedFaq === originalIndex ? null : originalIndex)}
                    className="w-full text-left"
                  >
                    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary transition">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold text-foreground text-lg flex-1">{item.q}</h3>
                        <ChevronDown
                          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${ 
                            expandedFaq === originalIndex ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                      {expandedFaq === originalIndex && (
                        <p className="text-muted-foreground mt-4 leading-relaxed text-base">{item.a}</p>
                      )}
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">نتیجه‌ای برای جست‌وجوی شما پیدا نشد.</p>
              </div>
            )}
          </div>
        </section>

        {/* Support Team Images */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">تجربه پشتیبانی وِلورا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden h-80">
              <img 
                src="/support-team.jpg" 
                alt="Dedicated support team members" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden h-80">
              <img 
                src="/support-consultation.jpg" 
                alt="Expert beauty consultation" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">با ما در ارتباط باشید</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 border border-border text-center hover:border-primary transition">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">پشتیبانی ایمیلی</h3>
              <p className="text-muted-foreground mb-4">پشتیبانی از طریق فرم تماس</p>
              <p className="text-sm text-primary font-medium">پاسخ‌گویی در ساعات کاری</p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border text-center hover:border-primary transition">
              <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">پشتیبانی تلفنی</h3>
              <p className="text-muted-foreground mb-4">+1 (555) 123-4567</p>
              <p className="text-sm text-primary font-medium">ساعات پاسخ‌گویی پس از ثبت اطلاعات فروشگاه</p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border text-center hover:border-primary transition">
              <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">گفت‌وگوی آنلاین</h3>
              <p className="text-muted-foreground mb-4">گفت‌وگو با تیم پشتیبانی زیبایی</p>
              <p className="text-sm text-primary font-medium">زمان انتظار بسته به ترافیک پشتیبانی</p>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="mb-16 bg-card border border-border rounded-2xl p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">ضمانت بازگشت</h3>
              <p className="text-muted-foreground">بازگشت وجه طبق شرایط مرجوعی فروشگاه انجام می‌شود.</p>
            </div>
            <div>
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">فرایند مرجوعی ساده</h3>
              <p className="text-muted-foreground">درخواست بازگشت کالا از مسیر پشتیبانی ثبت و پیگیری می‌شود.</p>
            </div>
            <div>
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">مشاوران محصول</h3>
              <p className="text-muted-foreground">راهنمایی برای انتخاب محصول متناسب با نیاز شما.</p>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">نکات زیبایی و پیشنهادهای ویژه</h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for product guides, skincare tips, and early access to new collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="ایمیل شما"
              className="flex-1 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-foreground text-white"
            />
            <button className="px-8 py-3 bg-accent text-accent-foreground rounded-full font-semibold hover:bg-accent/90 transition whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
