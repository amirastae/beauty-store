"use client";

import Link from "next/link";
import { STORE_SUPPORT_EMAIL, STORE_SUPPORT_MAILTO } from "@/config/store";

export default function ContactPage() {
  return (
    <main className="contact-page">
      <header className="shop-nav">
        <Link href="/" className="brand">VELOURA</Link>
        <nav>
          <Link href="/shop/">فروشگاه</Link>
          <Link href="/cart/">سبد خرید</Link>
        </nav>
      </header>

      <section className="contact-hero">
        <p className="eyebrow">VELOURA SUPPORT</p>
        <h1>پشتیبانی،<br/><em>شفاف و مستقیم.</em></h1>
        <p>
          برای پرسش درباره محصول، خرید یا هماهنگی سفارش از ایمیل رسمی پشتیبانی استفاده کن.
        </p>
      </section>

      <section className="contact-card" aria-labelledby="support-email-title">
        <span>01</span>
        <h2 id="support-email-title">ایمیل پشتیبانی</h2>
        <a href={STORE_SUPPORT_MAILTO}>{STORE_SUPPORT_EMAIL}</a>
        <p>
          این آدرس برای تماس با فروشگاه است و به‌جای ایمیل خریدار داخل سفارش ثبت نمی‌شود.
        </p>
      </section>
    </main>
  );
}
