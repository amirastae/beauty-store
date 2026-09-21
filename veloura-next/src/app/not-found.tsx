import Link from "next/link";

export default function NotFound(){
  return <main className="not-found">
    <div>
      <p className="eyebrow">404 · VELOURA</p>
      <h1>این صفحه<br/><em>اینجا نیست.</em></h1>
      <p>مسیر عوض شده یا محصول دیگر در این آدرس نیست.</p>
      <div className="not-found-actions">
        <Link className="button button-dark" href="/">بازگشت به خانه</Link>
        <Link className="text-link" href="/shop/">رفتن به فروشگاه ←</Link>
      </div>
    </div>
    <div className="not-found-object" aria-hidden="true"><i/><b>V</b></div>
  </main>;
}
