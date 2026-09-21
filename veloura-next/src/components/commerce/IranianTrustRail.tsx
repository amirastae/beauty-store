export default function IranianTrustRail() {
  const items = [
    ["01", "خرید شفاف", "قیمت و جزئیات محصول قبل از ثبت سفارش"],
    ["02", "ارسال سراسری", "ساختار آماده انتخاب آدرس و مقصد در ایران"],
    ["03", "پرداخت واقعی", "اتصال نهایی فقط به درگاه واقعی فروشگاه"],
    ["04", "پیگیری سفارش", "زیرساخت آماده اتصال به هسته تجارت و پنل سفارش"]
  ];

  return (
    <section className="iran-trust-rail" aria-label="امکانات خرید">
      {items.map(([index, title, copy]) => (
        <article key={index}>
          <span>{index}</span>
          <strong>{title}</strong>
          <small>{copy}</small>
        </article>
      ))}
    </section>
  );
}
