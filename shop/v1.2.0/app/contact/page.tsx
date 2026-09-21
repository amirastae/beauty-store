'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        
        <h1 className="text-5xl font-bold text-foreground text-center mb-12">با ما در ارتباط باشید</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-foreground mb-6">پیام خود را بفرستید</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">نام</label>
                <input
                  type="text"
                  placeholder="نام شما"
                  className="w-full px-4 py-3 bg-muted rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">ایمیل</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-muted rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">پیام</label>
                <textarea
                  placeholder="پیام شما..."
                  rows={5}
                  className="w-full px-4 py-3 bg-muted rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">اطلاعات تماس</h2>
              <p className="text-muted-foreground mb-8">سوالی دارید؟ از هرکدام از راه‌های زیر با تیم وِلورا در ارتباط باشید.</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">تلفن</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">ایمیل</h3>
                  <p className="text-muted-foreground">پشتیبانی از طریق فرم تماس</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">آدرس</h3>
                  <p className="text-muted-foreground">آدرس فروشگاه پس از ثبت اطلاعات تجاری نمایش داده می‌شود</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-muted rounded-2xl h-64 flex items-center justify-center text-muted-foreground">
              <span>نقشه فروشگاه</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-card rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-foreground mb-6">سوالات متداول</h2>
          <div className="space-y-4">
            {[
              { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 day delivery.' },
              { q: 'Are your products cruelty-free?', a: 'Yes! All our products are 100% cruelty-free and we do not test on animals.' },
              { q: 'What is your return policy?', a: 'We offer a 30-day money-back guarantee on all unused products.' },
            ].map((item, idx) => (
              <details key={idx} className="border border-border rounded-lg p-4 group">
                <summary className="font-semibold text-foreground cursor-pointer">{item.q}</summary>
                <p className="text-muted-foreground mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
