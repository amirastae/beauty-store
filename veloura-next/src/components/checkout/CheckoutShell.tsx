"use client";

import Link from "next/link";
import CommerceFooter from "@/components/commerce/CommerceFooter";
import { FormEvent, useState } from "react";
import IranianTrustRail from "@/components/commerce/IranianTrustRail";
import {
  commerceVerificationConfigured,
  CommerceVerificationError,
  type CommerceVerification,
  verifyCommerceCart
} from "@/lib/commerce-verify";
import { formatFaNumber, formatToman, isIranianMobile, isIranianPostalCode } from "@/lib/locale";
import { useCart } from "@/store/cart";
import { STORE_SUPPORT_EMAIL, STORE_SUPPORT_MAILTO } from "@/config/store";

const provinces = [
  "آذربایجان شرقی","آذربایجان غربی","اردبیل","اصفهان","البرز","ایلام","بوشهر","تهران",
  "چهارمحال و بختیاری","خراسان جنوبی","خراسان رضوی","خراسان شمالی","خوزستان","زنجان","سمنان",
  "سیستان و بلوچستان","فارس","قزوین","قم","کردستان","کرمان","کرمانشاه","کهگیلویه و بویراحمد",
  "گلستان","گیلان","لرستان","مازندران","مرکزی","هرمزگان","همدان","یزد"
];

function verificationErrorMessage(error: unknown) {
  if (!(error instanceof CommerceVerificationError)) {
    return "بررسی سرور انجام نشد. سفارش ساخته نشده و می‌توانی دوباره تلاش کنی.";
  }
  if (error.code === "FRONTEND_VARIANT_NOT_FOUND") return "یکی از محصولات با کاتالوگ سرور هماهنگ نیست. سفارش ساخته نشد.";
  if (error.code === "INVENTORY_NOT_FOUND") return "اطلاعات موجودی یکی از محصولات در سرور کامل نیست.";
  if (error.code === "DB_NOT_BOUND") return "دیتابیس فروشگاه در این محیط متصل نیست.";
  return "ارتباط با هسته تجارت برقرار نشد. سفارش ساخته نشده است.";
}

export default function CheckoutShell(){
  const lines=useCart((state)=>state.lines);
  const total=lines.reduce((s,l)=>s+l.product.price*l.qty,0);
  const originalTotal=lines.reduce((s,l)=>s+(l.product.compareAtPrice??l.product.price)*l.qty,0);
  const savings=Math.max(0,originalTotal-total);
  const [done,setDone]=useState(false);
  const [mobileError,setMobileError]=useState("");
  const [postalError,setPostalError]=useState("");
  const [checking,setChecking]=useState(false);
  const [verification,setVerification]=useState<CommerceVerification|null>(null);
  const [serverError,setServerError]=useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form=event.currentTarget;
    setServerError("");
    setVerification(null);
    setDone(false);

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const mobile = String(data.get("mobile") || "");
    const postal = String(data.get("postalCode") || "");
    const mobileValid = isIranianMobile(mobile);
    const postalValid = isIranianPostalCode(postal);

    setMobileError(mobileValid ? "" : "شماره موبایل معتبر ایران وارد کن.");
    setPostalError(postalValid ? "" : "کد پستی باید ۱۰ رقم باشد.");
    if (!mobileValid || !postalValid || !lines.length) return;

    if (!commerceVerificationConfigured) {
      setDone(true);
      return;
    }

    setChecking(true);
    try {
      const result=await verifyCommerceCart(lines);
      setVerification(result);
      if (result.issues.length) {
        setServerError(result.issues.map((issue)=>issue.message).join(" "));
        return;
      }
      setDone(true);
    } catch (error) {
      setServerError(verificationErrorMessage(error));
    } finally {
      setChecking(false);
    }
  };

  const displayTotal=verification?.serverSubtotalToman ?? total;

  return <main className="checkout-page">
    <header className="shop-nav"><Link href="/" className="brand">VELOURA</Link><Link href="/cart/">بازگشت به سبد ←</Link></header>
    <IranianTrustRail />
    <div className="checkout-layout">
      <section>
        <p className="eyebrow">IRAN CHECKOUT · SECURE FLOW</p>
        <h1>تکمیل سفارش</h1>
        <form className="checkout-form" onSubmit={submit} onChange={()=>{done&&setDone(false);verification&&setVerification(null);serverError&&setServerError("")}}>
          <label>نام و نام خانوادگی<input name="fullName" required autoComplete="name"/></label>
          <label>
            شماره موبایل
            <input name="mobile" required inputMode="tel" autoComplete="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" aria-invalid={Boolean(mobileError)} aria-describedby={mobileError?"mobile-error":undefined}/>
            {mobileError && <span id="mobile-error" className="checkout-field-error">{mobileError}</span>}
          </label>
          <label>ایمیل خریدار — اختیاری<input name="email" type="email" autoComplete="email"/></label>
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
            <label><input type="radio" name="payment" value="online" defaultChecked/> پرداخت آنلاین — فعال‌سازی پس از اتصال درگاه واقعی</label>
          </fieldset>

          <button className="button button-dark wide" disabled={!lines.length||checking}>
            {checking?"در حال بررسی قیمت و موجودی…":"تأیید اطلاعات سفارش"}
          </button>
        </form>

        {serverError && <div className="checkout-error" role="alert">{serverError}</div>}

        {done && commerceVerificationConfigured && verification && <div className="checkout-success" role="status">
          قیمت و موجودی توسط هسته تجارت تأیید شد.
          {verification.stalePriceLines>0 && <> قیمت نمایش‌داده‌شده محلی قدیمی بود؛ مبلغ معتبر سرور {formatToman(verification.serverSubtotalToman)} است.</>}
          {" "}هنوز هیچ سفارش یا پرداختی ساخته نشده؛ فعال‌سازی نهایی بعد از رفع gate ارسال و اتصال درگاه واقعی انجام می‌شود.
        </div>}

        {done && !commerceVerificationConfigured && <div className="checkout-note" role="status">
          اطلاعات فرم معتبر است، اما Commerce API در این build تنظیم نشده؛ سفارش و پرداختی ساخته نشده است.
        </div>}

        {!lines.length && <div className="checkout-note">سبد خرید خالی است؛ برای ادامه ابتدا محصولی به سبد اضافه کن.</div>}
        <p className="checkout-support">پشتیبانی فروشگاه: <a href={STORE_SUPPORT_MAILTO}>{STORE_SUPPORT_EMAIL}</a></p>
      </section>

      <aside className="order-summary">
        <h2>سفارش شما</h2>
        {lines.map((line)=>{
          const verifiedLine=verification?.lines.find((item)=>item.productId===line.product.id && item.shadeId===line.shadeId);
          const lineTotal=(verifiedLine?.serverUnitToman??line.product.price)*line.qty;
          return <div key={line.product.id+"-"+(line.shadeId||"default")}>
            <span>{line.product.nameFa} × {formatFaNumber(line.qty)}</span>
            <strong>{formatToman(lineTotal)}</strong>
          </div>;
        })}
        <hr/>
        <div><span>{verification?"جمع تأییدشده سرور":"جمع کالاها"}</span><strong>{formatToman(displayTotal)}</strong></div>
        {!verification&&savings>0 && <div className="order-saving"><span>صرفه‌جویی شما</span><strong>{formatToman(savings)}</strong></div>}
        <small className="pdp-commerce-note">
          {commerceVerificationConfigured
            ?"در این مرحله فقط قیمت و موجودی از سرور بررسی می‌شود؛ هیچ سفارش یا پرداختی ایجاد نمی‌شود."
            :"برای بررسی server-side، NEXT_PUBLIC_COMMERCE_API_BASE باید در build تنظیم شود."}
        </small>
      </aside>
    </div>
    <CommerceFooter />
</main>;
}
