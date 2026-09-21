import Link from "next/link";
import { STORE_SUPPORT_EMAIL, STORE_SUPPORT_MAILTO } from "@/config/store";

export const metadata = {
  title: "تماس با VELOURA",
  description: "راه ارتباط و پشتیبانی فروشگاه VELOURA."
};

export default function ContactPage(){
  return <main className="info-page">
    <header className="shop-nav"><Link href="/" className="brand">VELOURA</Link><Link href="/shop/">فروشگاه ←</Link></header>
    <section className="info-hero compact">
      <p className="eyebrow">VELOURA SUPPORT</p>
      <h1>تماس با <em>پشتیبانی</em></h1>
      <p>برای پیگیری سفارش، پرداخت یا پرسش درباره محصول از ایمیل رسمی زیر استفاده کن.</p>
    </section>
    <section className="info-grid">
      <article><span>01</span><h2>ایمیل رسمی</h2><p><a href={STORE_SUPPORT_MAILTO}>{STORE_SUPPORT_EMAIL}</a></p></article>
      <article><span>02</span><h2>امنیت پرداخت</h2><p>VELOURA اطلاعات کارت بانکی را داخل سایت دریافت یا ذخیره نمی‌کند؛ پرداخت فقط در درگاه متصل و تأییدشده انجام می‌شود.</p></article>
    </section>
  </main>;
}
