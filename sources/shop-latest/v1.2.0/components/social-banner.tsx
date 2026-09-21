import { Headphones, Mail, UserRound } from 'lucide-react'
import Link from 'next/link'

export default function SocialBanner() {
  return (
    <section className="py-8 px-4 bg-primary/10 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-6">برای راهنمایی، پیگیری سفارش و ارتباط با وِلورا از مسیرهای رسمی داخل سایت استفاده کنید.</p>
        <div className="flex justify-center gap-6 md:gap-12 flex-wrap">
          <Link href="/support" className="flex items-center gap-2 text-primary hover:text-primary/80 transition">
            <Headphones className="w-5 h-5" />
            <span>پشتیبانی</span>
          </Link>
          <Link href="/contact" className="flex items-center gap-2 text-primary hover:text-primary/80 transition">
            <Mail className="w-5 h-5" />
            <span>تماس با ما</span>
          </Link>
          <Link href="/account" className="flex items-center gap-2 text-primary hover:text-primary/80 transition">
            <UserRound className="w-5 h-5" />
            <span>حساب کاربری</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
