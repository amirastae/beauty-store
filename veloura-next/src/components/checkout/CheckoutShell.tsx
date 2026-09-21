"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import IranianTrustRail from "@/components/commerce/IranianTrustRail";
import { formatFaNumber, formatToman, isIranianMobile, isIranianPostalCode } from "@/lib/locale";
import { useCart } from "@/store/cart";

const provinces = [
  "آذربایجان شرقی","آذربایجان غربی","اردبیل","اصفهان","البرز","ایلام","بوشهر","تهران",
  "چهارمحال و بختیاری","خراسان جنوبی","خراسان رضوی","خراسان شمالی","خوزستان","زنجان","سمنان",
  "سیستان و بلوچستان","فارس","قزوین","قم","کردستان","کرمان","کرمانشاه","کهگیلویه و بویراحمد",
  "گلستان","گیلان","لرستان","مازندران","مرکزی","هرمزگان","همدان","یزد"
];

export default function CheckoutShell(){
  const lines=useCart((state)=>state.lines);
  const total=lines.reduce((s,l)=>s+l.product.price*l.qty,0);
  const originalTotal=lines.reduce((s,l)=>s+(l.product.compareAtPrice??l.product.price)*l.qty,0);
  const savings=Math.max(0,originalTotal-total);
  const [done,setDone]=useState(false);
  const [mobileError,setMobileError]=useState("");
  const [postalError,setPostalError]=useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form=event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setDone(false);
      return;
    }

    const data = new FormData(form);
    const mobile = String(data.get("mobile") || "");
    const postal = String(data.get("postalCode") || "");
    const mobileValid = isIranianMobile(mobile);
    const postalValid = isIranianPostalCode(postal);

    setMobileError(mobileValid ? "" : "شماره موبایل معتبر ایران وارد کن.");
    setPostalError(postalValid ? "" : "کد پستی باید ۱۰ رقم باشد.");
    setDone(mobileValid && postalValid && lines.length > 0);
  };

  return <main className="checkout-page">
    <header className="shop-nav"><Link href="/" className="brand">VELOURA</Link><Link href="/cart/">بازگشت به سبد ←</Link></header>
    <IranianTrustRail />
    <div className="checkout-layout">
      <section>
        <p className="eyebrow">IRAN CHECKOUT · SECURE FLOW</p>
        <h1>تکمیل سفارش</h1>
        <form className="checkout-form" onSubmit={submit} onChange={()=>done&&setDone(false)}>
          <label>نام و نام خانوادگی<input name="fullName" required autoComplete="name"/></label>
          <label>
            شماره موبایل
            <input name="mobile" required inputMode="tel" autoComplete="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" aria-invalid={Boolean(mobileError)} aria-describedby={mobileError?"mobile-error":undefined}/>
            {mobileError && <span id="mobile-error" className="checkout-field-error">{mobileError}</span>}
          </label>
          <label>ایمیل اختیاری<input name="email" type="email" autoComplete="email"/></label>
          <label>
            استان
            <select name="province" required defaultValue="">
              <option value="" disabled>انتخاب استان</option>
              {provinces.map((province)=><option key={province} value={province}>{province}</option>)}
            </select>
          </label>
          <label>شهر<input name="city" required autoComplete="address-level2"/></label>
          <label>
            کد پستی
            <input name="postalCode" required inputMode="numeric" autoComplete="postal-code" maxLength={10} placeholder="۱۰ رقم بدون خط تیره" aria-invalid={Boolean(postalError)} aria-describedby={postalError?"postal-error":undefined}/>
            {postalError && <span id="postal-error" className="checkout-field-error">{postalError}</span>}
          </label>
          <label className="wide">آدرس کامل<textarea name="address" required rows={3} autoComplete="street-address"/></label>
          <label className="wide">توضیحات سفارش<textarea name="note" rows={2} placeholder="پلاک، واحد یا توضیح لازم برای ارسال"/></label>

          <fieldset className="checkout-methods">
            <legend>روش پرداخت</legend>
            <label><input type="radio" name="payment" value="online" defaultChecked/> پرداخت آنلاین از درگاه فروشگاه</label>
          </fieldset>

          <button className="button button-dark wide" disabled={!lines.length}>تأیید اطلاعات سفارش</button>
        </form>
        {done && <div className="checkout-success" role="status">
          اطلاعات سفارش معتبر است و برای مرحله اتصال به درگاه واقعی آماده شد. هیچ پرداخت نمایشی یا موفقیت جعلی ثبت نمی‌شود.
        </div>}
        {!lines.length && <div className="checkout-note">سبد خرید خالی است؛ برای ادامه ابتدا محصولی به سبد اضافه کن.</div>}
      </section>
      <aside className="order-summary">
        <h2>سفارش شما</h2>
        {lines.map((line)=><div key={line.product.id+"-"+(line.shadeId||"default")}><span>{line.product.nameFa} × {formatFaNumber(line.qty)}</span><strong>{formatToman(line.product.price*line.qty)}</strong></div>)}
        <hr/>
        <div><span>جمع کالاها</span><strong>{formatToman(total)}</strong></div>
        {savings>0 && <div className="order-saving"><span>صرفه‌جویی شما</span><strong>{formatToman(savings)}</strong></div>}
        <small className="pdp-commerce-note">هزینه ارسال بعد از اتصال سرویس ارسال و بر اساس مقصد محاسبه می‌شود.</small>
      </aside>
    </div>
  </main>;
}
