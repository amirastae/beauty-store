import Link from "next/link";
import { STORE_SUPPORT_EMAIL, STORE_SUPPORT_MAILTO } from "@/config/store";

export default function CommerceFooter() {
  return (
    <footer className="commerce-footer">
      <div className="commerce-footer-brand">
        <Link href="/" className="brand">VELOURA</Link>
        <p>تجربه خرید فارسی برای آرایش، مراقبت پوست و عطر.</p>
      </div>
      <nav aria-label="لینک‌های فروشگاه">
        <Link href="/shop/">فروشگاه</Link>
        <Link href="/routine/">راهنمای روتین</Link>
        <Link href="/contact/">تماس و پشتیبانی</Link>
      </nav>
      <div className="commerce-footer-support">
        <span>پشتیبانی</span>
        <a href={STORE_SUPPORT_MAILTO}>{STORE_SUPPORT_EMAIL}</a>
      </div>
    </footer>
  );
}
