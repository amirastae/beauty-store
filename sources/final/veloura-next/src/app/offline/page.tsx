import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "آفلاین — FATIKHAN", robots: { index: false, follow: false } };

export default function OfflinePage(){
  return <main className="offline-page">
    <div className="offline-card">
      <p className="eyebrow">OFFLINE · FATIKHAN</p>
      <h1>اتصال قطع شده.</h1>
      <p>صفحه‌های بازشده قبلی ممکن است هنوز در دسترس باشند. برای دیدن تازه‌ترین محصولات دوباره به اینترنت وصل شو.</p>
      <div><Link className="button button-dark" href="/">خانه</Link><Link href="/shop/" className="text-link">فروشگاه ←</Link></div>
    </div>
  </main>;
}
