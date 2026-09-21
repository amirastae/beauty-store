import Link from 'next/link'

export default function NotFound(){
  return (
    <main className="min-h-screen bg-[#160f15] text-white grid place-items-center px-6">
      <section className="max-w-xl text-center">
        <p className="text-[#d9a9c1] tracking-[.28em] text-sm mb-5">VELOURA • 404</p>
        <h1 className="text-5xl md:text-7xl font-light mb-6">این صفحه پیدا نشد.</h1>
        <p className="text-white/65 leading-8 mb-8">ممکن است لینک تغییر کرده باشد یا صفحه دیگر در دسترس نباشد.</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/" className="bg-white text-black px-7 py-3 rounded-full">بازگشت به خانه</Link>
          <Link href="/shop-all" className="border border-white/25 px-7 py-3 rounded-full">مشاهده محصولات</Link>
        </div>
      </section>
    </main>
  )
}
