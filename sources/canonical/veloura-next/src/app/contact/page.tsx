import type { Metadata } from "next";
import Link from "next/link";
import { STORE_SUPPORT_EMAIL, STORE_SUPPORT_MAILTO } from "@/config/store";

export const metadata: Metadata = {
  title: "تماس و پشتیبانی — FATIKHAN",
  description: "راه ارتباط مستقیم با پشتیبانی فروشگاه FATIKHAN.",
  alternates: { canonical: "/contact/" },
  openGraph: {
    title: "تماس و پشتیبانی — FATIKHAN",
    description: "راه ارتباط مستقیم با پشتیبانی فروشگاه FATIKHAN.",
    url: "/contact/"
  }
};

export default function ContactPage(){
  return <main className="contact-page">
    <section className="contact-hero">
      <p className="eyebrow">FATIKHAN SUPPORT</p>
      <h1>پشتیبانی،<br/><em>مستقیم و روشن.</em></h1>
      <p>برای سؤال درباره سفارش، محصول یا پرداخت از ایمیل رسمی فروشگاه استفاده کن.</p>
      <a className="button button-dark" href={STORE_SUPPORT_MAILTO}>{STORE_SUPPORT_EMAIL}</a>
      <Link className="text-link" href="/shop/">بازگشت به فروشگاه ←</Link>
    </section>
  </main>;
}
