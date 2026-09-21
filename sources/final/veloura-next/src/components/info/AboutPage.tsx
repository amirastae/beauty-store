import Link from "next/link";

export default function AboutPage(){
  return <main className="info-page">
    <header className="shop-nav"><Link href="/" className="brand">FATIKHAN</Link><Link href="/shop/">فروشگاه ←</Link></header>
    <section className="info-hero">
      <p className="eyebrow">ABOUT FATIKHAN</p>
      <h1>زیبایی،<br/><em>بدون شلوغی.</em></h1>
      <p>FATIKHAN یک تجربه فارسی برای کشف و خرید محصولات زیبایی است؛ با تمرکز روی تصویر قوی، اطلاعات واضح و تصمیم‌گیری سریع.</p>
    </section>
    <section className="info-grid">
      <article><span>01</span><h2>انتخاب روشن</h2><p>نام، دسته، ترکیبات شاخص، روش استفاده و قیمت در مسیر خرید پنهان نمی‌شوند.</p></article>
      <article><span>02</span><h2>طراحی برای موبایل</h2><p>فروشگاه از ابتدا برای لمس، اسکرول، جستجو و خرید روی نمایشگر کوچک طراحی شده است.</p></article>
      <article><span>03</span><h2>حرکت با هدف</h2><p>سه‌بعدی و موشن فقط جایی استفاده می‌شوند که تجربه محصول را بهتر کنند و در دستگاه ضعیف سبک‌تر می‌شوند.</p></article>
      <article><span>04</span><h2>شفافیت</h2><p>دیدگاه، پرداخت یا وضعیت سفارش ساختگی نمایش داده نمی‌شود؛ قابلیت‌هایی که به سرویس واقعی نیاز دارند فقط پس از اتصال واقعی فعال می‌شوند.</p></article>
    </section>
    <section className="info-cta"><h2>کالکشن را ببین.</h2><Link className="button button-dark" href="/shop/">ورود به فروشگاه</Link></section>
  </main>;
}
