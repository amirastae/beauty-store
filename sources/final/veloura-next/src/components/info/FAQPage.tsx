import Link from "next/link";

const items=[
  ["چطور سریع‌تر محصول مناسب پیدا کنم؟","از فیلتر دسته، بودجه و امتیاز در فروشگاه استفاده کن یا در جستجو نام محصول، دسته یا ترکیبی مثل Retinol و Hyaluronic Acid را بنویس."],
  ["انتخاب رنگ کجا انجام می‌شود؟","محصولاتی که چند رنگ دارند روی کارت و صفحه محصول swatch دارند. Shade Lab هم برای تجربه سریع‌تر رنگ طراحی شده است."],
  ["سبد و علاقه‌مندی‌ها ذخیره می‌شوند؟","بله، در همین مرورگر به‌صورت محلی ذخیره می‌شوند تا با بستن صفحه از بین نروند."],
  ["آیا پرداخت واقعی فعال است؟","فرم checkout آماده است، اما پرداخت نهایی فقط بعد از اتصال درگاه واقعی فروشگاه فعال می‌شود. هیچ پرداخت نمایشی به‌عنوان پرداخت موفق ثبت نمی‌شود."],
  ["چرا بعضی افکت‌ها روی موبایل کمترند؟","برای حفظ سرعت و باتری، سایت بر اساس توان دستگاه و تنظیم Reduced Motion افکت‌های سنگین را کاهش می‌دهد."],
  ["اطلاعات ترکیبات از کجا دیده می‌شود؟","صفحه هر محصول بخش «ترکیبات شاخص» دارد و جستجو هم نام ترکیبات را پوشش می‌دهد."]
];

export default function FAQPage(){
  return <main className="info-page">
    <header className="shop-nav"><Link href="/" className="brand">FATIKHAN</Link><Link href="/shop/">فروشگاه ←</Link></header>
    <section className="info-hero compact"><p className="eyebrow">HELP · FAQ</p><h1>پاسخ‌های<br/><em>سریع.</em></h1><p>مهم‌ترین چیزهایی که برای استفاده از فروشگاه لازم است.</p></section>
    <section className="faq-list">
      {items.map(([q,a],i)=><details key={q} open={i===0}><summary><span>0{i+1}</span>{q}<b>+</b></summary><p>{a}</p></details>)}
    </section>
  </main>;
}
