"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import {
  checkoutFingerprint,
  checkoutIdempotencyKey,
  clearCheckoutIdempotency,
  commerceEnabled,
  commerceHealth,
  createCommerceOrder,
  irrMinorToToman,
  startCommercePayment
} from "@/lib/commerce";
import { formatFaNumber, formatToman, isIranianMobile, isIranianPostalCode } from "@/lib/locale";

const provinces = [
  "آذربایجان شرقی","آذربایجان غربی","اردبیل","اصفهان","البرز","ایلام","بوشهر","تهران",
  "چهارمحال و بختیاری","خراسان جنوبی","خراسان رضوی","خراسان شمالی","خوزستان","زنجان","سمنان",
  "سیستان و بلوچستان","فارس","قزوین","قم","کردستان","کرمان","کرمانشاه","کهگیلویه و بویراحمد",
  "گلستان","گیلان","لرستان","مازندران","مرکزی","هرمزگان","همدان","یزد"
];

type Draft={
  name:string;
  phone:string;
  email:string;
  province:string;
  address:string;
  city:string;
  postal:string;
  note:string;
};

type PendingOrder={
  orderId:string;
  orderNumber:number;
  expiresAt:string;
};

const emptyDraft:Draft={name:"",phone:"",email:"",province:"",address:"",city:"",postal:"",note:""};
const storageKey="veloura-checkout-draft-v2";
const pendingKey="veloura-pending-payment-v1";

function commerceErrorMessage(error: unknown) {
  const code=typeof error==="object"&&error&&"code" in error?String((error as {code?:unknown}).code||""):"";
  const messages:Record<string,string>={
    COMMERCE_NOT_CONFIGURED:"هسته سفارش در این build متصل نیست.",
    PAYMENT_PROVIDER_NOT_CONFIGURED:"درگاه پرداخت واقعی هنوز روی سرور فعال نشده است.",
    PAYMENT_PROVIDER_UNAVAILABLE:"ارتباط با درگاه موقتاً برقرار نشد. سفارش تکراری ساخته نمی‌شود؛ دوباره ادامه پرداخت را بزن.",
    PAYMENT_PROVIDER_REJECTED:"درگاه پرداخت درخواست را نپذیرفت. کمی بعد دوباره تلاش کن.",
    FRONTEND_VARIANT_NOT_FOUND:"یکی از محصولات سبد با کاتالوگ سرور هماهنگ نیست.",
    INSUFFICIENT_STOCK:"موجودی یکی از محصولات کافی نیست.",
    ORDER_EXPIRED:"مهلت رزرو سفارش تمام شده است؛ سفارش جدید بساز.",
    CURRENCY_MISMATCH:"ارز یکی از اقلام سبد معتبر نیست.",
    SHIPPING_POLICY_NOT_CONFIGURED:"هزینه ارسال برای این سفارش روی سرور تنظیم نشده است."
  };
  return messages[code]||(code?"تکمیل سفارش انجام نشد ("+code+").":"ارتباط با سرویس سفارش برقرار نشد.");
}

export default function CheckoutShell(){
  const lines=useCart((state)=>state.lines);
  const clearCart=useCart((state)=>state.clear);
  const localTotal=lines.reduce((sum,line)=>sum+line.product.price*line.qty,0);
  const [draft,setDraft]=useState<Draft>(emptyDraft);
  const [submitting,setSubmitting]=useState(false);
  const [message,setMessage]=useState("");
  const [mobileError,setMobileError]=useState("");
  const [postalError,setPostalError]=useState("");
  const [serverTotal,setServerTotal]=useState<number|null>(null);
  const [serverShipping,setServerShipping]=useState<number|null>(null);
  const [pending,setPending]=useState<PendingOrder|null>(null);
  const [paymentReturn,setPaymentReturn]=useState<"success"|"failed"|"cancelled"|null>(null);

  useEffect(()=>{
    try{
      const raw=localStorage.getItem(storageKey);
      if(raw) setDraft({...emptyDraft,...JSON.parse(raw)});
      const pendingRaw=sessionStorage.getItem(pendingKey);
      if(pendingRaw) setPending(JSON.parse(pendingRaw));
    }catch{}

    const params=new URLSearchParams(window.location.search);
    const payment=params.get("payment");
    if(payment==="success"||payment==="failed"||payment==="cancelled"){
      setPaymentReturn(payment);
      clearCheckoutIdempotency();
      try{sessionStorage.removeItem(pendingKey)}catch{}
      setPending(null);
      if(payment==="success") clearCart();
    }
  },[clearCart]);

  const update=(key:keyof Draft,value:string)=>{
    setDraft((state)=>({...state,[key]:value}));
    setMessage("");
    setServerTotal(null);
    setServerShipping(null);
    clearCheckoutIdempotency();
  };

  const continuePendingPayment=async()=>{
    if(!pending) return;
    setSubmitting(true);
    setMessage("");
    try{
      const payment=await startCommercePayment(pending.orderId);
      window.location.assign(payment.redirect_url);
    }catch(error){
      const code=typeof error==="object"&&error&&"code" in error?String((error as {code?:unknown}).code||""):"";
      if(code==="ORDER_EXPIRED"){
        try{sessionStorage.removeItem(pendingKey)}catch{}
        setPending(null);
        clearCheckoutIdempotency();
      }
      setMessage(commerceErrorMessage(error));
      setSubmitting(false);
    }
  };

  const submit=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const form=event.currentTarget;
    setMessage("");
    setServerTotal(null);
    setServerShipping(null);

    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }

    const mobileValid=isIranianMobile(draft.phone);
    const postalValid=isIranianPostalCode(draft.postal);
    setMobileError(mobileValid?"":"شماره موبایل معتبر ایران وارد کن.");
    setPostalError(postalValid?"":"کد پستی باید ۱۰ رقم باشد.");
    if(!mobileValid||!postalValid||!lines.length) return;

    try{ localStorage.setItem(storageKey,JSON.stringify(draft)); }catch{}

    if(!commerceEnabled){
      setMessage("اطلاعات روی همین دستگاه ذخیره شد؛ سرویس سفارش واقعی در این build فعال نیست و هیچ سفارش یا پرداختی ساخته نشد.");
      return;
    }

    if(pending){
      setMessage("یک سفارش در انتظار پرداخت داری؛ ابتدا همان پرداخت را ادامه بده یا تا پایان مهلت رزرو صبر کن.");
      return;
    }

    setSubmitting(true);
    try{
      const health=await commerceHealth();
      if(!health.database_bound) throw Object.assign(new Error("Database is not bound."),{code:"DB_NOT_BOUND"});
      if(!health.payment_provider_configured) throw Object.assign(new Error("Payment provider is not configured."),{code:"PAYMENT_PROVIDER_NOT_CONFIGURED"});

      const fingerprint=await checkoutFingerprint(lines,draft);
      const key=checkoutIdempotencyKey(fingerprint);
      const order=await createCommerceOrder(lines,{
        email:draft.email.trim()||undefined,
        fullName:draft.name.trim(),
        phone:draft.phone.trim(),
        province:draft.province,
        address:draft.address.trim(),
        city:draft.city.trim(),
        postal:draft.postal.trim(),
        note:draft.note.trim()
      },key);

      const pendingOrder:PendingOrder={
        orderId:order.order_id,
        orderNumber:order.order_number,
        expiresAt:order.payment_expires_at
      };
      setPending(pendingOrder);
      try{sessionStorage.setItem(pendingKey,JSON.stringify(pendingOrder))}catch{}

      setServerShipping(irrMinorToToman(order.shipping_minor));
      setServerTotal(irrMinorToToman(order.total_minor));

      const payment=await startCommercePayment(order.order_id);
      window.location.assign(payment.redirect_url);
    }catch(error){
      setMessage(commerceErrorMessage(error));
      setSubmitting(false);
    }
  };

  return <main className="checkout-page">
    <header className="shop-nav"><Link href="/" className="brand">FATIKHAN</Link><Link href="/cart/">بازگشت به سبد ←</Link></header>

    <div className="checkout-status" aria-label="مراحل سفارش">
      <span className="done">01 · سبد</span><i/><span className="active">02 · اطلاعات</span><i/><span>03 · پرداخت</span>
    </div>

    <div className="checkout-layout">
      <section>
        <p className="eyebrow">SECURE CHECKOUT · STEP 02</p>
        <h1>اطلاعات تحویل</h1>
        <p className="checkout-intro">{commerceEnabled?"قیمت، موجودی، ارسال و سفارش توسط هسته واقعی فروشگاه پردازش می‌شود و پرداخت فقط از درگاه متصل ادامه پیدا می‌کند.":"اطلاعات فعلاً فقط روی مرورگر ذخیره می‌شود؛ هیچ سفارش یا پرداختی ساخته نمی‌شود."}</p>

        {paymentReturn&&<div className={"payment-return "+paymentReturn} role={paymentReturn==="success"?"status":"alert"}>
          <strong>{paymentReturn==="success"?"پرداخت با موفقیت تأیید شد.":paymentReturn==="cancelled"?"پرداخت لغو شد.":"پرداخت تأیید نشد."}</strong>
          <span>{paymentReturn==="success"?"سبد خرید پاک شد و سفارش برای پردازش ثبت شده است.":"موجودی رزروشده آزاد شده و می‌توانی سفارش جدید بسازی."}</span>
        </div>}

        {pending&&<div className="checkout-resume">
          <div><b>سفارش در انتظار پرداخت</b><span>شماره {formatFaNumber(pending.orderNumber)}</span></div>
          <button type="button" className="button" disabled={submitting} onClick={continuePendingPayment}>ادامه پرداخت</button>
        </div>}

        <form className="checkout-form" onSubmit={submit}>
          <label>نام و نام خانوادگی<input required autoComplete="name" value={draft.name} onChange={(e)=>update("name",e.target.value)}/></label>
          <label>شماره موبایل<input required inputMode="tel" autoComplete="tel" value={draft.phone} onChange={(e)=>update("phone",e.target.value)} aria-invalid={Boolean(mobileError)}/>{mobileError&&<span className="checkout-field-error">{mobileError}</span>}</label>
          <label>ایمیل — اختیاری<input type="email" autoComplete="email" value={draft.email} onChange={(e)=>update("email",e.target.value)}/></label>
          <label>استان<select required value={draft.province} onChange={(e)=>update("province",e.target.value)}><option value="" disabled>انتخاب استان</option>{provinces.map((p)=><option key={p} value={p}>{p}</option>)}</select></label>
          <label>شهر<input required autoComplete="address-level2" value={draft.city} onChange={(e)=>update("city",e.target.value)}/></label>
          <label>کد پستی<input required inputMode="numeric" autoComplete="postal-code" maxLength={10} value={draft.postal} onChange={(e)=>update("postal",e.target.value)} aria-invalid={Boolean(postalError)}/>{postalError&&<span className="checkout-field-error">{postalError}</span>}</label>
          <label className="wide">آدرس کامل<textarea required rows={3} autoComplete="street-address" value={draft.address} onChange={(e)=>update("address",e.target.value)}/></label>
          <label className="wide">توضیح سفارش<textarea rows={2} value={draft.note} onChange={(e)=>update("note",e.target.value)} placeholder="پلاک، واحد یا توضیح لازم برای ارسال"/></label>
          <button className="button button-dark wide" disabled={!lines.length||submitting}>{submitting?"در حال آماده‌سازی پرداخت…":commerceEnabled?"ثبت سفارش و رفتن به درگاه":"ذخیره اطلاعات"}</button>
        </form>

        <div className="checkout-safety"><b>پرداخت نمایشی نداریم.</b><p>اطلاعات کارت در FATIKHAN دریافت یا ذخیره نمی‌شود. سفارش فقط بعد از callback تأییدشده درگاه، پرداخت‌شده محسوب می‌شود.</p></div>
        <div className={message?"checkout-note success":"checkout-note"} aria-live="polite">{message||"شماره موبایل، آدرس و مبلغ نهایی قبل از پرداخت روی سرور بررسی می‌شوند."}</div>
      </section>

      <aside className="order-summary">
        <h2>سفارش شما</h2>
        {lines.length?lines.map((line)=><div key={line.product.id+"-"+(line.shadeId||"default")}><span>{line.product.nameFa} × {formatFaNumber(line.qty)}</span><strong>{formatToman(line.product.price*line.qty)}</strong></div>):<p className="summary-empty">سبد خرید خالی است.</p>}
        <hr/><div><span>جمع کالاها</span><strong>{formatToman(localTotal)}</strong></div>
        <div><span>ارسال</span><strong>{serverShipping===null?"هنگام ثبت از سرور":formatToman(serverShipping)}</strong></div>
        {serverTotal!==null&&<div><span>مبلغ نهایی سرور</span><strong>{formatToman(serverTotal)}</strong></div>}
        <small>مبلغ معتبر نهایی فقط از هسته تجارت دریافت می‌شود.</small>
      </aside>
    </div>
  </main>;
}
