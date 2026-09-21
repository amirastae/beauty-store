import Link from "next/link";

export default function SiteFooter(){
  return <footer className="site-footer">
    <div className="site-footer-brand">
      <Link href="/" aria-label="FATIKHAN home">FATIKHAN</Link>
      <p>فروشگاه فارسی زیبایی با تجربه خرید سریع، تصویری و دقیق.</p>
    </div>
    <div className="site-footer-links">
      <div><strong>فروشگاه</strong><Link href="/shop/">همه محصولات</Link><Link href="/search/">جستجو</Link><Link href="/wishlist/">علاقه‌مندی‌ها</Link><Link href="/recent/">اخیراً دیده‌شده</Link><Link href="/routine/">روتین‌ساز</Link><Link href="/compare/">مقایسه</Link><Link href="/cart/">سبد خرید</Link></div>
      <div><strong>کشف</strong><Link href="/shop/?category=پوست">پوست</Link><Link href="/shop/?category=آرایش">آرایش</Link><Link href="/shop/?category=عطر">عطر</Link><Link href="/shop/?category=مو">مو</Link></div>
      <div><strong>FATIKHAN</strong><Link href="/about/">درباره ما</Link><Link href="/faq/">سوالات متداول</Link><Link href="/#shade-lab">Shade Lab</Link></div>
    </div>
    <div className="site-footer-bottom">
      <span>© 2026 FATIKHAN</span>
      <span>RTL · PERSIAN · PREMIUM BEAUTY COMMERCE</span>
    </div>
  </footer>;
}
