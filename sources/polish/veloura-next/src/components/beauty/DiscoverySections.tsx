import Image from "next/image";
import Link from "next/link";

const concerns=[
  ["آبرسانی","پوستی نرم‌تر و شاداب‌تر","/shop/?category=پوست"],
  ["درخشش","برای جلوه روشن و شفاف","/shop/?category=پوست"],
  ["سد دفاعی","تقویت روتین روزانه","/shop/?category=پوست"],
  ["رنگ لب","از نود تا بری عمیق","/shop/?category=آرایش"]
];

export default function DiscoverySections(){
  return <>
    <section className="concern-section">
      <div className="concern-head"><p className="eyebrow">SHOP BY MOOD</p><h2>با نیازت شروع کن.</h2><p>به‌جای گشتن بین ده‌ها کارت، از نتیجه‌ای که می‌خواهی شروع کن.</p></div>
      <div className="concern-grid">
        {concerns.map(([title,desc,href],i)=><Link key={title} href={href}><span>0{i+1}</span><h3>{title}</h3><p>{desc}</p><b>کشف ←</b></Link>)}
      </div>
    </section>

    <section className="bundle-section">
      <div className="bundle-copy">
        <p className="eyebrow">THE THREE-STEP EDIT</p>
        <h2>سه محصول.<br/><em>یک ریتم کامل.</em></h2>
        <p>سرم، رنگ و رایحه در یک ادیت مینیمال؛ برای کسی که می‌خواهد سریع انتخاب کند اما تجربه لوکس را از دست ندهد.</p>
        <Link className="button button-light" href="/shop/">ساخت روتین من</Link>
      </div>
      <div className="bundle-objects" aria-hidden="true"><i/><i/><i/></div>
    </section>

    <section className="ugc-section">
      <div className="section-head"><div><p className="eyebrow">REAL RITUALS</p><h2>زیبایی در استفاده واقعی.</h2></div><span>COMMUNITY / 2026</span></div>
      <div className="ugc-grid">
        <figure className="ugc-large"><Image src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=86" alt="میز آرایش و محصولات زیبایی" fill sizes="(max-width:900px) 100vw,50vw"/><figcaption>روتین صبح · پوست + رنگ</figcaption></figure>
        <figure><Image src="https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=900&q=86" alt="محصولات آرایشی" fill sizes="(max-width:900px) 50vw,25vw"/><figcaption>ادیت روزانه</figcaption></figure>
        <figure><Image src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=86" alt="مراقبت پوست" fill sizes="(max-width:900px) 50vw,25vw"/><figcaption>پوست، بدون شلوغی</figcaption></figure>
      </div>
    </section>

    <section className="trust-band">
      <div><b>01</b><span>ضمانت اصالت کالا</span></div>
      <div><b>02</b><span>ارسال سریع و قابل پیگیری</span></div>
      <div><b>03</b><span>پشتیبانی خرید</span></div>
      <div><b>04</b><span>تجربه امن و شفاف</span></div>
    </section>
  </>;
}
