import Link from "next/link";
import CommerceFooter from "@/components/commerce/CommerceFooter";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <header className="shop-nav">
        <Link href="/" className="brand">FATIKHAN</Link>
        <Link href="/shop/">فروشگاه</Link>
      </header>
      <section className="not-found-hero">
        <p className="eyebrow">404 · PAGE NOT FOUND</p>
        <h1>این صفحه پیدا نشد.</h1>
        <p>ممکن است آدرس تغییر کرده باشد یا صفحه دیگر در دسترس نباشد.</p>
        <div className="not-found-actions">
          <Link className="button button-dark" href="/shop/">بازگشت به فروشگاه</Link>
          <Link className="button" href="/contact/">تماس با پشتیبانی</Link>
        </div>
      </section>
      <CommerceFooter />
    </main>
  );
}
