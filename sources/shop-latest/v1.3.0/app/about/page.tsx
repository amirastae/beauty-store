import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import { Sparkles, ShieldCheck, Gauge, Search, PackageCheck, HeartHandshake } from 'lucide-react'

const values = [
  { icon: Sparkles, title: 'انتخاب دقیق', description: 'تمرکز روی تجربه خرید منظم، معرفی شفاف محصول و دسته‌بندی قابل‌فهم.' },
  { icon: ShieldCheck, title: 'شفافیت', description: 'قیمت، مشخصات، ترکیبات و شرایط سفارش باید قبل از خرید واضح باشند.' },
  { icon: Gauge, title: 'سرعت و سادگی', description: 'طراحی سبک، جست‌وجوی سریع و مسیر خرید کوتاه برای موبایل و دسکتاپ.' },
]

const journey = [
  { icon: Search, title: 'کشف', description: 'جست‌وجو و فیلتر بین محصولات و دسته‌بندی‌ها.' },
  { icon: PackageCheck, title: 'انتخاب', description: 'بررسی تصاویر، ترکیبات، روش مصرف و محصولات مرتبط.' },
  { icon: HeartHandshake, title: 'پشتیبانی', description: 'پیگیری سفارش، سوالات محصول و درخواست‌های بعد از خرید از مسیرهای رسمی سایت.' },
]

export default function AboutPage() {
  return <div className="min-h-screen bg-background"><Header/>
    <main>
      <section className="relative overflow-hidden bg-[#160f15] text-white px-4 py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(156,66,113,.28),transparent_38%)]"/>
        <div className="relative max-w-5xl mx-auto">
          <p className="text-sm tracking-[.24em] text-[#d9a9c1] mb-5">ABOUT VELOURA</p>
          <h1 className="text-5xl md:text-7xl font-light leading-tight mb-6">زیبایی، با تجربه‌ای<br/><span className="text-[#e9bfd2]">دقیق‌تر و ساده‌تر.</span></h1>
          <p className="text-white/70 max-w-2xl leading-8">وِلورا یک تجربه فروشگاهی فارسی برای مرور، مقایسه و خرید محصولات زیبایی است؛ با تمرکز بر رابط کاربری شفاف، سرعت، محتوای محصول و مسیر خرید قابل‌اعتماد.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <img src="/about-story.jpg" alt="فضای زیبایی وِلورا" className="w-full h-[420px] object-cover rounded-3xl"/>
        <div>
          <p className="text-primary text-sm mb-3">رویکرد ما</p>
          <h2 className="text-3xl md:text-4xl font-light mb-6">فروشگاه باید قبل از هر چیز، قابل اعتماد و قابل استفاده باشد.</h2>
          <div className="space-y-4 text-muted-foreground leading-8">
            <p>اطلاعات محصول، قیمت، روش استفاده و شرایط خرید باید در همان جایی نمایش داده شوند که کاربر برای تصمیم‌گیری به آن نیاز دارد.</p>
            <p>هیچ آمار مشتری، جایزه، تیم یا ادعای تجاریِ تأییدنشده در این نسخه نمایش داده نمی‌شود.</p>
            <p>اطلاعات رسمی کسب‌وکار، راه‌های تماس و سیاست‌های نهایی زمانی نمایش داده می‌شوند که داده واقعی فروشگاه ثبت شود.</p>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12">اصول تجربه وِلورا</h2>
          <div className="grid md:grid-cols-3 gap-6">{values.map(({icon:Icon,title,description})=><article key={title} className="bg-card border border-border rounded-3xl p-7">
            <Icon className="w-10 h-10 text-primary mb-5"/>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-7">{description}</p>
          </article>)}</div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-light mb-10">مسیر خرید</h2>
        <div className="grid md:grid-cols-3 gap-6">{journey.map(({icon:Icon,title,description},index)=><article key={title} className="relative border-t border-border pt-6">
          <span className="text-xs text-primary">0{index+1}</span>
          <Icon className="w-7 h-7 my-4"/>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground leading-7">{description}</p>
        </article>)}</div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#160f15] text-white p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-5">کالکشن وِلورا را ببینید</h2>
          <p className="text-white/65 mb-7">محصولات را براساس دسته‌بندی، نیاز و قیمت مرور کنید.</p>
          <Link href="/shop-all" className="inline-block bg-white text-black px-7 py-3 rounded-full">مشاهده همه محصولات</Link>
        </div>
      </section>
    </main><Footer/></div>
}
