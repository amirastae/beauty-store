"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import {
  checkoutFingerprint,
  checkoutIdempotencyKey,
  clearCheckoutIdempotency,
  commerceEnabled,
  createCommerceOrder,
  irrMinorToToman
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

const emptyDraft:Draft={name:"",phone:"",email:"",province:"",address:"",city:"",postal:"",note:""};
const storageKey="veloura-checkout-draft-v2";

export default function CheckoutShell(){
  const lines=useCart((state)=>state.lines);
  const localTotal=lines.reduce((sum,line)=>sum+line.product.price*line.qty,0);
  const [draft,setDraft]=useState<Draft>(emptyDraft);
  const [submitting,setSubmitting]=useState(false);
  const [message,setMessage]=useState("");
  const [mobileError,setMobileError]=useState("");
  const [postalError,setPostalError]=useState("");
  const [serverTotal,setServerTotal]=useState<number|null>(null);
  const [serverShipping,setServerShipping]=useState<number|null>(null);

  useEffect(()=>{
    try{
      const raw=localStorage.getItem(storageKey);
      if(raw) setDraft({...emptyDraft,...JSON.parse(raw)});
    }catch{}
  },[]);

  const update=(key:keyof Draft,value:string)=>{
    setDraft((state)=>({...state,[key]:value}));
    setMessage("");
    setServerTotal(null);
    setServerShipping(null);
    clearCheckoutIdempotency();
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

    setSubmitting(true);
    try{
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

      setServerShipping(irrMinorToToman(order.shipping_minor));
      setServerTotal(irrMinorToToman(order.total_minor));
      if(order.payment_status==="requires_provider"){
        setMessage("سفارش با شماره "+formatFaNumber(order.order_number)+" در هسته فروشگاه ثبت شد. پرداخت هنوز انجام نشده و هیچ مبلغی دریافت نشده است.");
      }else{
        setMessage("سفارش ثبت شد. وضعیت پرداخت: "+order.payment_status);
      }
    }catch(error){
      const code=typeof error==="object"&&error&&"code" in error?String((error as {code?:unknown}).code||""):"";
      setMessage(code?"ثبت سفارش انجام نشد ("+code+"). اطلاعات فرم محفوظ است.":"ارتباط با سرویس سفارش برقرار نشد. اطلاعات فرم محفوظ است.");
    }finally{
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
        <p className="checkout-intro">{commerceEnabled?"قیمت، موجودی، ارسال و سفارش توسط هسته واقعی فروشگاه پردازش می‌شود. پرداخت فقط پس از اتصال درگاه معتبر ادامه پیدا می‌کند.":"اطلاعات فعلاً فقط روی مرورگر ذخیره می‌شود؛ هیچ سفارش یا پرداختی ساخته نمی‌شود."}</p>

        <form className="checkout-form" onSubmit={submit}>
          <label>نام و نام خانوادگی<input required autoComplete="name" value={draft.name} onChange={(e)=>update("name",e.target.value)}/></label>
          <label>شماره موبایل<input required inputMode="tel" autoComplete="tel" value={draft.phone} onChange={(e)=>update("phone",e.target.value)} aria-invalid={Boolean(mobileError)}/>{mobileError&&<span className="checkout-field-error">{mobileError}</span>}</label>
          <label>ایمیل — اختیاری<input type="email" autoComplete="email" value={draft.email} onChange={(e)=>update("email",e.target.value)}/></label>
          <label>استان<select required value={draft.province} onChange={(e)=>update("province",e.target.value)}><option value="" disabled>انتخاب استان</option>{provinces.map((p)=><option key={p} value={p}>{p}</option>)}</select></label>
          <label>شهر<input required autoComplete="address-level2" value={draft.city} onChange={(e)=>update("city",e.target.value)}/></label>
          <label>کد پستی<input required inputMode="numeric" autoComplete="postal-code" maxLength={10} value={draft.postal} onChange={(e)=>update("postal",e.target.value)} aria-invalid={Boolean(postalError)}/>{postalError&&<span className="checkout-field-error">{postalError}</span>}</label>
          <label className="wide">آدرس کامل<textarea required rows={3} autoComplete="street-address" value={draft.address} onChange={(e)=>update("address",e.target.value)}/></label>
          <label className="wide">توضیح سفارش<textarea rows={2} value={draft.note} onChange={(e)=>update("note",e.target.value)} placeholder="پلاک، واحد یا توضیح لازم برای ارسال"/></label>
          <button className="button button-dark wide" disabled={!lines.length||submitting}>{submitting?"در حال ثبت امن سفارش…":commerceEnabled?"ثبت سفارش":"ذخیره اطلاعات"}</button>
        </form>

        <div className="checkout-safety"><b>پرداخت نمایشی نداریم.</b><p>تا زمان اتصال درگاه واقعی، هیچ پرداختی موفق اعلام نمی‌شود و اطلاعات بانکی دریافت نمی‌کنیم.</p></div>
        <div className={message?"checkout-note success":"checkout-note"} aria-live="polite">{message||"شماره موبایل، آدرس و مبلغ نهایی قبل از پرداخت بررسی می‌شوند."}</div>
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
