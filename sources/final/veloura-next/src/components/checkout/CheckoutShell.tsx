"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { commerce, commerceConfigured, CommerceApiError, irrToToman } from "@/lib/commerce-client";
import { formatFaNumber, formatToman, isIranianMobile, isIranianPostalCode, normalizeIranianMobile, normalizePostalCode } from "@/lib/locale";
import { STORE_SUPPORT_EMAIL, STORE_SUPPORT_MAILTO } from "@/config/store";
import { useCart } from "@/store/cart";

const provinces = [
  "آذربایجان شرقی","آذربایجان غربی","اردبیل","اصفهان","البرز","ایلام","بوشهر","تهران",
  "چهارمحال و بختیاری","خراسان جنوبی","خراسان رضوی","خراسان شمالی","خوزستان","زنجان","سمنان",
  "سیستان و بلوچستان","فارس","قزوین","قم","کردستان","کرمان","کرمانشاه","کهگیلویه و بویراحمد",
  "گلستان","گیلان","لرستان","مازندران","مرکزی","هرمزگان","همدان","یزد"
];

type PendingOrder = {
  order_id: string;
  order_number: number;
  payment_expires_at: string;
};

const pendingKey = "veloura-pending-payment-v1";

function errorMessage(error: unknown) {
  if (!(error instanceof CommerceApiError)) return "خطای غیرمنتظره رخ داد. دوباره تلاش کن.";
  const map: Record<string,string> = {
    COMMERCE_API_NOT_CONFIGURED: "هسته سفارش فروشگاه در این build متصل نیست.",
    PAYMENT_PROVIDER_NOT_CONFIGURED: "درگاه واقعی فروشگاه هنوز روی سرور فعال نشده است.",
    PAYMENT_PROVIDER_UNAVAILABLE: "ارتباط با درگاه پرداخت موقتاً برقرار نشد. سفارش تکراری ساخته نمی‌شود؛ دوباره تلاش کن.",
    PAYMENT_PROVIDER_REJECTED: "درگاه پرداخت درخواست را نپذیرفت. کمی بعد دوباره تلاش کن.",
    FRONTEND_VARIANT_NOT_FOUND: "یکی از محصولات سبد با کاتالوگ سرور هماهنگ نیست.",
    INSUFFICIENT_STOCK: "موجودی یکی از محصولات برای این تعداد کافی نیست.",
    CURRENCY_MISMATCH: "ارز یکی از اقلام با سبد سازگار نیست.",
    ORDER_EXPIRED: "مهلت رزرو این سفارش تمام شده؛ دوباره سفارش را ایجاد کن.",
    SHIPPING_POLICY_NOT_CONFIGURED: "هزینه ارسال برای این روش هنوز روی سرور تنظیم نشده است."
  };
  return map[error.code] || error.message || "تکمیل سفارش انجام نشد.";
}

export default function CheckoutShell(){
  const lines = useCart((state)=>state.lines);
  const clear = useCart((state)=>state.clear);
  const localTotal = lines.reduce((sum,line)=>sum+line.product.price*line.qty,0);

  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const [pending,setPending] = useState<PendingOrder|null>(null);
  const [paymentReturn,setPaymentReturn] = useState<{status:"success"|"failed"|"cancelled";order?:string}|null>(null);
  const [serverSummary,setServerSummary] = useState<{subtotal:number;shipping:number;total:number}|null>(null);

  useEffect(()=>{
    try {
      const saved=sessionStorage.getItem(pendingKey);
      if(saved) setPending(JSON.parse(saved));
    } catch {}

    const params=new URLSearchParams(window.location.search);
    const status=params.get("payment");
    if(status==="success"||status==="failed"||status==="cancelled"){
      const order=(params.get("order")||"").replace(/[^0-9]/g,"").slice(0,20);
      setPaymentReturn({status,...(order?{order}:{})});
      if(status==="success"){
        clear();
        try{sessionStorage.removeItem(pendingKey)}catch{}
        setPending(null);
      }
    }
  },[clear]);

  const redirectToPayment = async (order: PendingOrder) => {
    const payment=await commerce.startPayment(order.order_id);
    window.location.assign(payment.redirect_url);
  };

  const retryPayment = async () => {
    if(!pending) return;
    setBusy(true);
    setMessage("");
    try{
      await redirectToPayment(pending);
    }catch(error){
      setMessage(errorMessage(error));
      setBusy(false);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form=event.currentTarget;
    setMessage("");

    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    if(!lines.length){
      setMessage("سبد خرید خالی است.");
      return;
    }

    const data=new FormData(form);
    const mobile=String(data.get("mobile")||"");
    const postal=String(data.get("postalCode")||"");
    if(!isIranianMobile(mobile)){
      setMessage("شماره موبایل معتبر ایران وارد کن.");
      return;
    }
    if(!isIranianPostalCode(postal)){
      setMessage("کد پستی باید دقیقاً ۱۰ رقم باشد.");
      return;
    }
    if(!commerceConfigured){
      setMessage("اتصال امن سفارش هنوز برای این نسخه فعال نشده است؛ هیچ سفارشی ساخته نشد.");
      return;
    }

    setBusy(true);

    try{
      const health=await commerce.health();
      if(!health.database_bound) throw new CommerceApiError("DB_NOT_BOUND","دیتابیس سفارش متصل نیست.",503);
      if(!health.payment_provider_configured) throw new CommerceApiError("PAYMENT_PROVIDER_NOT_CONFIGURED","درگاه پرداخت متصل نیست.",503);

      const cart=await commerce.createCart();
      let verifiedSubtotalIrr=0;

      for(const line of lines){
        const resolved=await commerce.resolveVariant(line.product.id,line.shadeId);
        if(resolved.currency_code!=="IRR"){
          throw new CommerceApiError("CURRENCY_MISMATCH","ارز محصول معتبر نیست.",409);
        }
        verifiedSubtotalIrr += resolved.price_minor*line.qty;
        await commerce.addItem(cart.id,resolved.variant_id,line.qty);
      }

      const order=await commerce.checkout(
        cart.id,
        {
          phone:normalizeIranianMobile(mobile),
          email:String(data.get("email")||"").trim()||undefined,
          shipping_address:{
            full_name:String(data.get("fullName")||"").trim(),
            province:String(data.get("province")||"").trim(),
            city:String(data.get("city")||"").trim(),
            postal_code:normalizePostalCode(postal),
            line1:String(data.get("address")||"").trim(),
            note:String(data.get("note")||"").trim()
          }
        },
        crypto.randomUUID()
      );

      const pendingOrder:PendingOrder={
        order_id:order.order_id,
        order_number:order.order_number,
        payment_expires_at:order.payment_expires_at
      };
      setPending(pendingOrder);
      setServerSummary({
        subtotal:irrToToman(order.subtotal_minor),
        shipping:irrToToman(order.shipping_minor),
        total:irrToToman(order.total_minor)
      });
      try{sessionStorage.setItem(pendingKey,JSON.stringify(pendingOrder))}catch{}

      if(order.subtotal_minor!==verifiedSubtotalIrr){
        console.warn("server subtotal differs from resolved variant subtotal");
      }

      await redirectToPayment(pendingOrder);
    }catch(error){
      setMessage(errorMessage(error));
      setBusy(false);
    }
  };

  return <main className="checkout-page">
    <header className="shop-nav">
      <Link href="/" className="brand">VELOURA</Link>
      <Link href="/cart/">بازگشت به سبد ←</Link>
    </header>

    <div className="checkout-status" aria-label="مراحل سفارش">
      <span className="done">۰۱ · سبد</span><i/><span className="active">۰۲ · اطلاعات و پرداخت</span><i/><span>۰۳ · تأیید</span>
    </div>

    <div className="checkout-layout">
      <section>
        <p className="eyebrow">SECURE IRAN CHECKOUT</p>
        <h1>تکمیل سفارش</h1>
        <p className="checkout-intro">قیمت و موجودی از سرور تأیید می‌شود، سپس سفارش با رزرو موقت موجودی ساخته شده و فقط به درگاه واقعی هدایت می‌شوی.</p>

        {paymentReturn && <div className={"payment-return "+paymentReturn.status} role={paymentReturn.status==="success"?"status":"alert"}>
          <strong>{paymentReturn.status==="success"?"پرداخت با موفقیت تأیید شد.":paymentReturn.status==="cancelled"?"پرداخت لغو شد.":"پرداخت تأیید نشد."}</strong>
          {paymentReturn.order && <span>شماره سفارش: {paymentReturn.order}</span>}
          {paymentReturn.status!=="success" && <small>اگر هنوز مهلت سفارش باقی مانده باشد می‌توانی دوباره تلاش کنی؛ در غیر این صورت سفارش جدید بساز.</small>}
        </div>}

        {pending && paymentReturn?.status!=="success" && <div className="checkout-resume">
          <div><b>سفارش در انتظار پرداخت</b><span>شماره {formatFaNumber(pending.order_number)}</span></div>
          <button type="button" className="button" disabled={busy} onClick={retryPayment}>ادامه پرداخت</button>
        </div>}

        <form className="checkout-form" onSubmit={submit}>
          <label>نام و نام خانوادگی<input name="fullName" required autoComplete="name"/></label>
          <label>شماره موبایل<input name="mobile" required inputMode="tel" autoComplete="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷"/></label>
          <label>ایمیل — اختیاری<input name="email" type="email" autoComplete="email"/></label>
          <label>استان<select name="province" required defaultValue=""><option value="" disabled>انتخاب استان</option>{provinces.map((p)=><option key={p} value={p}>{p}</option>)}</select></label>
          <label>شهر<input name="city" required autoComplete="address-level2"/></label>
          <label>کد پستی<input name="postalCode" required inputMode="numeric" maxLength={10} autoComplete="postal-code"/></label>
          <label className="wide">آدرس کامل<textarea name="address" required rows={3} autoComplete="street-address"/></label>
          <label className="wide">توضیحات سفارش<textarea name="note" rows={2} placeholder="پلاک، واحد یا توضیح لازم برای ارسال"/></label>
          <button className="button button-dark wide" disabled={busy||!lines.length}>{busy?"در حال آماده‌سازی پرداخت…":"ثبت سفارش و رفتن به درگاه"}</button>
        </form>

        {message && <div className="checkout-error" role="alert">{message}</div>}
        {!commerceConfigured && <div className="checkout-note">این build هنوز آدرس Commerce API ندارد؛ برای جلوگیری از سفارش نمایشی، دکمه پرداخت سفارش ایجاد نمی‌کند.</div>}
        <p className="checkout-support">پشتیبانی: <a href={STORE_SUPPORT_MAILTO}>{STORE_SUPPORT_EMAIL}</a></p>
      </section>

      <aside className="order-summary">
        <h2>سفارش شما</h2>
        {lines.length?lines.map((line)=><div key={line.product.id+"-"+(line.shadeId||"default")}><span>{line.product.nameFa} × {formatFaNumber(line.qty)}</span><strong>{formatToman(line.product.price*line.qty)}</strong></div>):<p className="summary-empty">سبد خرید خالی است.</p>}
        <hr/>
        <div><span>جمع کالاها</span><strong>{formatToman(serverSummary?.subtotal??localTotal)}</strong></div>
        <div><span>ارسال</span><strong>{serverSummary?formatToman(serverSummary.shipping):"محاسبه امن روی سرور"}</strong></div>
        {serverSummary && <div><span>مبلغ نهایی</span><strong>{formatToman(serverSummary.total)}</strong></div>}
        <small>مبلغ نهایی و وضعیت پرداخت فقط از Commerce API و callback تأییدشده درگاه پذیرفته می‌شود.</small>
      </aside>
    </div>
  </main>;
}
