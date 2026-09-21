'use client'

import { useState, useRef, type KeyboardEvent } from "react"

export default function Footer() {
  const [expanded, setExpanded] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleExpand = () => {
    setExpanded(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 200)
  }

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubscribe = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const email = e.currentTarget.value

      if (!validateEmail(email)) {
        setError("Please enter a valid email")
        e.currentTarget.classList.add("animate-shake")
        const input = e.currentTarget
        setTimeout(() => {
          input.classList.remove("animate-shake")
        }, 500)
        return
      }

      setError("")
      setSubscribed(true)
      setExpanded(false)

      setTimeout(() => {
        setSubscribed(false)
      }, 2000)
    }
  }

  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          
          {/* Shop */}
          <div>
            <h4 className="font-bold mb-4">فروشگاه</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="/shop-all" className="hover:opacity-100 transition">همه محصولات</a></li>
              <li><a href="/skincare" className="hover:opacity-100 transition">مراقبت پوست</a></li>
              <li><a href="/makeup" className="hover:opacity-100 transition">آرایش</a></li>
              <li><a href="/sets" className="hover:opacity-100 transition">ست‌ها</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">وِلورا</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="/about" className="hover:opacity-100 transition">درباره ما</a></li>
              <li><a href="/support" className="hover:opacity-100 transition">پشتیبانی</a></li>
              <li><a href="/support" className="hover:opacity-100 transition">راهنمای خرید</a></li>
              <li><a href="/contact" className="hover:opacity-100 transition">همکاری با ما</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">پشتیبانی</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="/support" className="hover:opacity-100 transition">سوالات متداول</a></li>
              <li><a href="/policies/shipping" className="hover:opacity-100 transition">ارسال</a></li>
              <li><a href="/policies/returns" className="hover:opacity-100 transition">مرجوعی</a></li>
              <li><a href="/policies/privacy" className="hover:opacity-100 transition">حریم خصوصی</a></li>
            </ul>
          </div>

          {/* Newsletter — COLUMN ALIGNED */}
          <div className="flex flex-col items-start">
            <h4 className="font-bold mb-4">خبرنامه</h4>
            <p className="opacity-90 mb-3 text-xs">پیشنهادهای ویژه و نکات زیبایی را دریافت کنید</p>

            <div className="w-full">

              {/* Subscribe Button */}
              {!expanded && !subscribed && (
                <button
                  onClick={handleExpand}
                  className="
                    w-28 h-11 rounded-lg 
                    bg-primary-foreground text-primary 
                    font-semibold text-sm
                    shadow-lg shadow-black/10
                    transition-all duration-500
                    hover:scale-[1.03]
                    active:scale-[0.97]
                    animate-rubberBand
                  "
                >
                  Subscribe
                </button>
              )}

              {/* Expanding Input */}
              {expanded && (
                <div className="w-full mt-0">
                  <input
                    ref={inputRef}
                    type="email"
                    placeholder="ایمیل شما"
                    onKeyDown={handleSubscribe}
                    className={`
                      w-full h-11 rounded-lg 
                      bg-primary-foreground text-primary px-3 
                      text-sm outline-none 
                      transition-all duration-500 
                      origin-center animate-expandInput
                      ${error ? "border border-red-500" : ""}
                    `}
                  />
                  {error && (
                    <p className="text-red-400 text-xs mt-1 px-1">{error}</p>
                  )}
                </div>
              )}

              {/* Subscribed Message */}
              {subscribed && (
                <div className="
                  w-36 h-11 mt-0 rounded-lg 
                  bg-green-500 text-white 
                  flex items-center justify-center 
                  text-sm transition-all duration-500 animate-shrinkBack
                ">
                  Subscribed ✓
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-primary-foreground/20 pt-6 text-center text-sm opacity-75">
          <p className="mb-2">&copy; 2026 VELOURA. تمامی حقوق محفوظ است.</p>
          <p className="text-xs">طراحی این نسخه بر پایه منابع متن‌باز و توسعه اختصاصی وِلورا انجام شده است.</p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes rubberBand {
          0% { transform: scale(1); }
          30% { transform: scale(1.15); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .animate-rubberBand {
          animation: rubberBand 0.6s ease-out;
        }

        @keyframes expandInput {
          0% { transform: scaleX(0.3); opacity: 0; }
          70% { transform: scaleX(1.1); }
          100% { transform: scaleX(1); opacity: 1; }
        }
        .animate-expandInput {
          animation: expandInput 0.6s cubic-bezier(0.22, 1.61, 0.36, 1);
        }

        @keyframes shrinkBack {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-shrinkBack {
          animation: shrinkBack 0.4s ease-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </footer>
  )
}
