'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
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
      q: 'ارسال استاندارد چقدر زمان می‌برد؟',
      a: 'زمان و روش ارسال بر اساس مقصد و گزینه‌های فعال فروشگاه هنگام ثبت سفارش نمایش داده می‌شود و وضعیت سفارش از بخش حساب یا پشتیبانی قابل پیگیری است.'
    },
    {
      category: 'product',
      q: 'اطلاعات ترکیبات و تست حیوانی کجاست؟',
      a: 'اطلاعات ترکیبات و ویژگی‌های هر محصول در صفحه همان محصول نمایش داده می‌شود. برای موارد حساس یا نیازهای خاص، اطلاعات درج‌شده روی بسته‌بندی مرجع نهایی است.'
    },
    {
      category: 'returns',
      q: 'شرایط مرجوعی چیست؟',
      a: 'کالای استفاده‌نشده و دارای بسته‌بندی سالم می‌تواند مطابق شرایط مرجوعی فروشگاه بررسی شود. محصولات آرایشی و بهداشتی بازشده ممکن است به دلایل بهداشتی قابل بازگشت نباشند.'
    },
    {
      category: 'product',
      q: 'برای انتخاب محصول می‌توانم راهنمایی بگیرم؟',
      a: 'بله. از بخش تماس یا پشتیبانی می‌توانید درباره دسته محصول، نوع استفاده و انتخاب مناسب‌تر راهنمایی بگیرید.'
    },
    {
      category: 'order',
      q: 'اگر محصول آسیب‌دیده به دستم برسد چه کنم؟',
      a: 'از بسته و محصول عکس بگیرید و از مسیر پشتیبانی درخواست بررسی ثبت کنید تا وضعیت تعویض یا مرجوعی پیگیری شود.'
    },
    {
      category: 'returns',
      q: 'چطور درخواست مرجوعی ثبت کنم؟',
      a: 'از بخش پشتیبانی درخواست را با شماره سفارش و توضیح وضعیت کالا ثبت کنید. مراحل بعدی و شرایط ارسال بازگشت به شما اعلام می‌شود.'
    },
    {
      category: 'product',
      q: 'محصولات پیشنهادی را از کجا ببینم؟',
      a: 'در صفحه هر محصول بخش محصولات مرتبط وجود دارد و از دسته‌بندی‌ها نیز می‌توانید محصولات مشابه را مقایسه کنید.'
    },
    {
      category: 'order',
      q: 'ارسال بین‌المللی دارید؟',
      a: 'مقصدها و روش‌های ارسال فعال باید هنگام ثبت سفارش نمایش داده شوند. اگر مقصد شما در checkout قابل انتخاب نباشد، ارسال برای آن مقصد فعال نیست.'
    }
  ]

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredFaqs = faqItems.filter(item => {
    const matchesTab = normalizedQuery ? true : item.category === activeTab
    const matchesSearch = !normalizedQuery ||
      item.q.toLowerCase().includes(normalizedQuery) ||
      item.a.toLowerCase().includes(normalizedQuery)
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

        {/* Verified storefront facts */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          <div className="bg-card rounded-xl p-6 border border-border text-center">
            <div className="text-3xl font-bold text-primary mb-2">۵۶</div>
            <p className="text-muted-foreground font-medium">محصول در کاتالوگ</p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border text-center">
            <div className="text-3xl font-bold text-primary mb-2">۶</div>
            <p className="text-muted-foreground font-medium">دسته اصلی</p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border text-center">
            <div className="text-3xl font-bold text-primary mb-2">FA / EN</div>
            <p className="text-muted-foreground font-medium">جست‌وجوی دو زبانه</p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border text-center">
            <div className="text-3xl font-bold text-primary mb-2">RTL</div>
            <p className="text-muted-foreground font-medium">تجربه فارسی کامل</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">دسترسی سریع</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/account" className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:bg-card/50 transition text-right">
              <Clock className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">پیگیری سفارش</h3>
              <p className="text-sm text-muted-foreground">مشاهده وضعیت و جزئیات سفارش</p>
            </Link>
            <Link href="/policies/returns" className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:bg-card/50 transition text-right">
              <AlertCircle className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">شرایط مرجوعی</h3>
              <p className="text-sm text-muted-foreground">مشاهده شرایط بازگشت یا تعویض</p>
            </Link>
            <Link href="/shop-all" className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:bg-card/50 transition text-right">
              <Search className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">راهنمای محصول</h3>
              <p className="text-sm text-muted-foreground">مرور محصولات و اطلاعات مصرف</p>
            </Link>
            <Link href="/contact" className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:bg-card/50 transition text-right">
              <MessageSquare className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">تماس با پشتیبانی</h3>
              <p className="text-sm text-muted-foreground">ارسال پیام برای تیم فروشگاه</p>
            </Link>
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
              { id: 'order' as const, label: 'سفارش و ارسال' },
              { id: 'product' as const, label: 'محصول و انتخاب' },
              { id: 'returns' as const, label: 'مرجوعی و تعویض' }
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
