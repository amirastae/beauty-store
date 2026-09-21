"use client";

import Link from "next/link";
import CommerceFooter from "@/components/commerce/CommerceFooter";
import { useState } from "react";

const morning = [
  ["01","پاکسازی ملایم","آلودگی و چربی اضافه را بدون شست‌وشوی افراطی پاک کن.","اگر پوستت بعد از شست‌وشو کشیده می‌شود، پاک‌کننده ملایم‌تر انتخاب کن."],
  ["02","تونر یا اسنس","مرحله‌ای اختیاری برای آماده‌کردن پوست و افزودن لایه سبک رطوبت.","ضروری نیست؛ روتین کوتاه و منظم بهتر از مراحل زیاد است."],
  ["03","سرم","یک سرم متناسب با هدف آرایشی روتین، مثل آبرسانی یا ظاهر یکنواخت‌تر.","محصول جدید را ابتدا روی بخش کوچکی از پوست امتحان کن."],
  ["04","مرطوب‌کننده","رطوبت را حفظ کن و بافتی انتخاب کن که زیر آرایش راحت باشد.","مقدار کمتر را لایه‌لایه اضافه کن تا پیل نشود."],
  ["05","ضدآفتاب","آخرین مرحله مراقبت صبح؛ روی نواحی در معرض نور به‌طور یکنواخت استفاده شود.","برای دستور مصرف و تمدید، برچسب همان محصول را دنبال کن."],
  ["06","آماده آرایش","چند دقیقه فرصت بده لایه‌ها بنشینند، سپس آرایش را با بافت‌های سبک شروع کن.","اگر محصولی سوزش یا تحریک ایجاد کرد، استفاده را متوقف کن."]
];

const night = [
  ["01","پاک‌کردن آرایش","اگر آرایش یا ضدآفتاب مقاوم داری، ابتدا آن را به‌آرامی پاک کن.","از کشیدن شدید اطراف چشم و لب خودداری کن."],
  ["02","شست‌وشوی ملایم","باقی‌مانده روز را با شوینده مناسب پاک کن.","شست‌وشوی بیشتر همیشه به معنی پوست تمیزتر نیست."],
  ["03","لایه سبک رطوبت","تونر یا اسنس اختیاری را در صورت سازگاری با پوست اضافه کن.","اگر روتین ساده‌تر برایت بهتر است، این مرحله را حذف کن."],
  ["04","سرم یا محصول هدفمند","در هر شب تعداد محصولات فعال را محدود نگه دار و دستور همان محصول را رعایت کن.","ترکیب هم‌زمان چند محصول قوی می‌تواند تحمل پوست را کم کند."],
  ["05","مرطوب‌کننده","روتین شب را با یک مرطوب‌کننده مناسب کامل کن.","روی نواحی خشک می‌توانی لایه نازک دیگری اضافه کنی."],
  ["06","لب و ناحیه چشم","در صورت نیاز از محصول ساده و سازگار برای لب یا اطراف چشم استفاده کن.","محصولات معطر یا محرک را نزدیک چشم با احتیاط استفاده کن."]
];

export default function RoutineGuide() {
  const [mode, setMode] = useState<"morning" | "night">("morning");
  const steps = mode === "morning" ? morning : night;

  return (
    <main className="routine-page">
      <header className="shop-nav">
        <Link href="/" className="brand">VELOURA</Link>
        <nav><Link href="/shop/?category=%D9%BE%D9%88%D8%B3%D8%AA">محصولات پوست</Link><Link href="/shop/">فروشگاه</Link></nav>
      </header>
      <section className="routine-hero">
        <p className="eyebrow">VELOURA ROUTINE GUIDE</p>
        <h1>روتین ساده،<br/>اجرای دقیق.</h1>
        <p>یک ترتیب عمومی برای چیدن محصولات مراقبت پوست در صبح و شب؛ بدون تشخیص نوع پوست و بدون شلوغ‌کردن روتین.</p>
      </section>
      <section className="routine-shell">
        <div className="routine-switch" role="group" aria-label="انتخاب زمان روتین">
          <button className={mode === "morning" ? "active" : ""} onClick={() => setMode("morning")} aria-pressed={mode === "morning"}>صبح · AM</button>
          <button className={mode === "night" ? "active" : ""} onClick={() => setMode("night")} aria-pressed={mode === "night"}>شب · PM</button>
        </div>
        <div className="routine-grid">
          {steps.map(([index, title, copy, note]) => (
            <article className="routine-step" key={index}>
              <span>{index}</span><h2>{title}</h2><p>{copy}</p><small>{note}</small>
            </article>
          ))}
        </div>
        <div className="routine-note">
          <p>این راهنما عمومی است. ترتیب دقیق استفاده، دفعات مصرف و محدودیت‌های هر محصول را از برچسب همان محصول دنبال کن. در صورت تحریک مداوم پوست، استفاده را متوقف کن.</p>
          <Link className="button button-dark" href="/shop/?category=%D9%BE%D9%88%D8%B3%D8%AA">دیدن محصولات پوست</Link>
        </div>
      </section>
      <CommerceFooter />
</main>
  );
}
