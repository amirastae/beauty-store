import Header from '@/components/header'
import Footer from '@/components/footer'

type Section={title:string;body:string}

export default function PolicyPage({eyebrow,title,intro,sections}:{eyebrow:string;title:string;intro:string;sections:Section[]}){
  return <div className="min-h-screen bg-background"><Header/>
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <p className="text-primary text-sm tracking-[.2em] mb-3">{eyebrow}</p>
      <h1 className="text-4xl md:text-5xl font-light mb-5">{title}</h1>
      <p className="text-muted-foreground leading-8 mb-10">{intro}</p>
      <div className="space-y-5">{sections.map((s)=><section key={s.title} className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-3">{s.title}</h2>
        <p className="text-muted-foreground leading-8">{s.body}</p>
      </section>)}</div>
      <p className="text-sm text-muted-foreground mt-8">اطلاعات نهایی زمان‌بندی، هزینه ارسال و شرایط تجاری متناسب با مقصد و اطلاعات ثبت‌شده هنگام سفارش نمایش داده می‌شود.</p>
    </main><Footer/></div>
}