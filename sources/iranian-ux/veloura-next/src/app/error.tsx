"use client";

import Link from "next/link";

export default function ErrorPage({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="error-page">
      <section className="error-panel" role="alert">
        <p className="eyebrow">FATIKHAN · RECOVERY</p>
        <h1>مشکلی پیش آمد.</h1>
        <p>این بخش درست بارگذاری نشد. می‌توانی دوباره تلاش کنی یا به مسیر امن دیگری برگردی.</p>
        <div className="not-found-actions">
          <button type="button" className="button button-dark" onClick={reset}>تلاش دوباره</button>
          <Link className="button" href="/shop/">فروشگاه</Link>
          <Link className="button" href="/">صفحه اصلی</Link>
        </div>
      </section>
    </main>
  );
}
