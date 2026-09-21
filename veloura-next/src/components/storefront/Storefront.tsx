"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { categories, products, type Product } from "@/data/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import HeroStage from "@/components/motion/HeroStage";
import ShadeLab from "@/components/beauty/ShadeLab";
import DiscoverySections from "@/components/beauty/DiscoverySections";
import { STORE_SUPPORT_EMAIL } from "@/config/store";

const SignatureStory = dynamic(() => import("@/components/motion/SignatureStory"), { ssr: false });

const toman = new Intl.NumberFormat("fa-IR");

function price(value: number) {
  return `${toman.format(value)} تومان`;
}

export default function Storefront() {
  const [category, setCategory] = useState<(typeof categories)[number]>("همه");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedShade, setSelectedShade] = useState<Record<string, string>>({});
  const [clubEmail, setClubEmail] = useState("");
  const [clubStatus, setClubStatus] = useState("");
  const { lines, add, remove } = useCart();
  const wishlistIds = useWishlist((state) => state.ids);
  const toggleWishlist = useWishlist((state) => state.toggle);

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("fa");
    return products.filter((product) => {
      const categoryMatch = category === "همه" || product.category === category;
      const queryMatch =
        !q ||
        `${product.nameFa} ${product.nameEn} ${product.brand} ${product.category}`
          .toLocaleLowerCase("fa")
          .includes(q);
      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  const cartCount = lines.reduce((sum, line) => sum + line.qty, 0);
  const cartTotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);

  const addProduct = (product: Product) => {
    const shadeId = selectedShade[product.id] ?? product.shades?.[0]?.id;
    add(product, shadeId);
    setCartOpen(true);
  };

  const requestPrivateList = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = clubEmail.trim();
    if (!email) return;
    const subject = encodeURIComponent("درخواست عضویت FATIKHAN PRIVATE LIST");
    const body = encodeURIComponent("ایمیل درخواست‌کننده: " + email);
    window.location.href = "mailto:" + STORE_SUPPORT_EMAIL + "?subject=" + subject + "&body=" + body;
    setClubStatus("درخواست در برنامه ایمیل شما آماده شد؛ برای ثبت نهایی آن را ارسال کن.");
  };

  return (
    <main className="site-shell">
      <div className="announcement">کالکشن ۲۰۲۶ · تجربه خرید فارسی · قیمت‌گذاری تومان</div>

      <header className="nav">
        <button className="nav-action" onClick={() => setCartOpen(true)} aria-label="سبد خرید">
          سبد <span className="cart-count">{toman.format(cartCount)}</span>
        </button>
        <nav className="nav-links" aria-label="ناوبری اصلی">
          <Link href="/shop/">فروشگاه</Link>
          <a href="#story">داستان FATIKHAN</a>
          <Link href="/wishlist/">علاقه‌مندی‌ها</Link>
        </nav>
        <Link className="brand" href="/" aria-label="FATIKHAN">FATIKHAN</Link>
        <button className="nav-action" onClick={() => setSearchOpen(true)}>جستجو</button>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">THE NEW BEAUTY EDIT · 2026</p>
          <h1 id="hero-title">زیبایی،<br/><em>در دقیق‌ترین حالتش.</em></h1>
          <p className="hero-lead">
            ترکیبی از بافت‌های لوکس، رنگ‌های هوشمند و فرمول‌هایی که برای حضور واقعی ساخته شده‌اند.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#products">خرید کالکشن</a>
            <a className="text-link" href="#story">کشف دنیای FATIKHAN ←</a>
          </div>
          <div className="hero-metrics">
            <div><strong>RTL</strong><span>تجربه فارسی</span></div>
            <div><strong>تومان</strong><span>نمایش قیمت</span></div>
            <div><strong>COMPARE</strong><span>مقایسه محصول</span></div>
          </div>
        </div>

        <HeroStage />

        <span className="scroll-cue">برای کشف بیشتر اسکرول کن ↓</span>
      </section>

      <section className="category-strip" aria-label="دسته‌بندی">
        {["لب", "پوست", "عطر", "چشم"].map((item, index) => (
          <Link href={"/shop/?category=" + encodeURIComponent(item)} key={item}><span>0{index + 1}</span>{item}</Link>
        ))}
      </section>

      <section className="editorial" id="story">
        <div className="editorial-media">
          <Image
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=90"
            alt="کمپین آرایشی FATIKHAN"
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
          />
        </div>
        <div className="editorial-copy">
          <p className="eyebrow">CHAPTER 01 · TEXTURE</p>
          <h2>محصولی که فقط دیده نمی‌شود؛ <em>حس می‌شود.</em></h2>
          <p>
            FATIKHAN برای تجربه‌ای طراحی شده که بین فشن ادیتوریال و خرید دقیق قرار می‌گیرد:
            تصویر قوی، اطلاعات روشن و انتخابی سریع.
          </p>
          <a className="button button-light" href="#products">مشاهده انتخاب سردبیر</a>
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="section-head">
          <div>
            <p className="eyebrow">CURATED FOR YOU</p>
            <h2>انتخاب‌های FATIKHAN</h2>
          </div>
          <div className="chips" role="group" aria-label="فیلتر دسته‌بندی">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "chip active" : "chip"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <Link className="product-media" href={"/product/" + product.slug}>
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"
                />
                <span className="quick-add" aria-hidden="true">مشاهده محصول</span>
              </Link>
              <div className="product-info">
                <div className="product-heading">
                  <div>
                    <h3><Link href={"/product/" + product.slug}>{product.nameFa}</Link></h3>
                    <p>{product.nameEn}</p>
                  </div>
                  <strong>{price(product.price)}</strong>
                </div>
                <div className="card-actions home-card-actions">
                  <button onClick={() => addProduct(product)}>+ سبد</button>
                  <button
                    type="button"
                    className={wishlistIds.includes(product.id) ? "wish active" : "wish"}
                    aria-label={wishlistIds.includes(product.id) ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                    aria-pressed={wishlistIds.includes(product.id)}
                    onClick={() => toggleWishlist(product.id)}
                  >♡</button>
                </div>
                {product.shades && (
                  <div className="swatches" aria-label="انتخاب رنگ">
                    {product.shades.map((shade) => (
                      <button
                        key={shade.id}
                        title={shade.nameFa}
                        aria-label={shade.nameFa}
                        className={(selectedShade[product.id] ?? product.shades?.[0]?.id) === shade.id ? "swatch active" : "swatch"}
                        style={{ backgroundColor: shade.hex }}
                        onClick={() => setSelectedShade((state) => ({ ...state, [product.id]: shade.id }))}
                      />
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <SignatureStory />
      <ShadeLab />
      <DiscoverySections />

      <section className="club" id="club">
        <p className="eyebrow">FATIKHAN PRIVATE LIST</p>
        <h2>اولین نفر باش.</h2>
        <p>دسترسی زودتر به کالکشن‌ها، رنگ‌های محدود و ادیت‌های جدید.</p>
        <form onSubmit={requestPrivateList}>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={clubEmail}
            onChange={(event) => {
              setClubEmail(event.target.value);
              if (clubStatus) setClubStatus("");
            }}
            placeholder="ایمیل شما"
            aria-label="ایمیل عضویت در لیست خصوصی"
          />
          <button type="submit">درخواست عضویت ←</button>
        </form>
        {clubStatus && <p className="club-status" role="status">{clubStatus}</p>}
      </section>

      <footer>
        <div className="footer-word">FATIKHAN</div>
        <div className="footer-row">
          <span>BEAUTY / 2026</span>
          <span>فارسی · RTL · PREMIUM COMMERCE</span>
        </div>
      </footer>

      <aside className={cartOpen ? "drawer open" : "drawer"} aria-hidden={!cartOpen}>
        <div className="drawer-head">
          <h2>سبد خرید</h2>
          <button onClick={() => setCartOpen(false)} aria-label="بستن">×</button>
        </div>
        <div className="drawer-lines">
          {lines.length === 0 ? (
            <p className="empty">هنوز چیزی انتخاب نکردی.</p>
          ) : lines.map((line) => {
            const shade = line.product.shades?.find((item) => item.id === line.shadeId);
            return (
              <div className="cart-line" key={`${line.product.id}-${line.shadeId ?? "default"}`}>
                <Image src={line.product.image} alt="" width={74} height={92} />
                <div>
                  <strong>{line.product.nameFa}</strong>
                  <span>{shade?.nameFa ?? line.product.category} · ×{toman.format(line.qty)}</span>
                  <small>{price(line.product.price * line.qty)}</small>
                </div>
                <button onClick={() => remove(line.product.id, line.shadeId)}>حذف</button>
              </div>
            );
          })}
        </div>
        <div className="drawer-total">
          <span>جمع</span><strong>{price(cartTotal)}</strong>
        </div>
        {lines.length ? <Link className="button button-dark checkout" href="/checkout/">ادامه به پرداخت</Link> : <button className="button button-dark checkout" disabled>ادامه به پرداخت</button>}
      </aside>
      {cartOpen && <button className="scrim" aria-label="بستن سبد" onClick={() => setCartOpen(false)} />}

      <div className={searchOpen ? "search-layer open" : "search-layer"} aria-hidden={!searchOpen}>
        <button className="search-close" onClick={() => setSearchOpen(false)}>×</button>
        <div className="search-inner">
          <p className="eyebrow">SEARCH FATIKHAN</p>
          <input
            autoFocus={searchOpen}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="دنبال چه محصولی هستی؟"
            aria-label="جستجوی محصول"
          />
          <div className="search-count">{toman.format(visibleProducts.length)} نتیجه</div>
          <div className="search-mini-grid">
            {visibleProducts.slice(0, 4).map((product) => (
              <Link key={product.id} href={"/product/" + product.slug} onClick={() => setSearchOpen(false)}>
                <Image src={product.image} alt="" width={62} height={72} />
                <span>{product.nameFa}<small>{price(product.price)}</small></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
