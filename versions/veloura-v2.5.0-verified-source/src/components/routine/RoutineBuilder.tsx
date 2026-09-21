"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { products, type Product } from "@/data/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

type Goal = "hydration" | "glow" | "makeup" | "hair";
type Budget = "3" | "6" | "open";
type Steps = 3 | 5;

const fa = new Intl.NumberFormat("fa-IR");
const money = (value:number) => fa.format(value) + " تومان";

const goals: Record<Goal,{title:string;desc:string;categories:string[];keywords:string[]}> = {
  hydration:{title:"آبرسانی",desc:"روتین ساده برای بافت نرم‌تر و حس رطوبت بیشتر.",categories:["پوست"],keywords:["Hyaluronic","Glycerin","Ceramide","Aloe","Squalane"]},
  glow:{title:"درخشش",desc:"تمرکز روی محصولات روشن‌کننده و تکمیل ظاهر شاداب.",categories:["پوست","آرایش"],keywords:["Vitamin C","Niacinamide","Pearl","Rose","Glow"]},
  makeup:{title:"آرایش روزانه",desc:"یک ادیت جمع‌وجور برای پایه، رنگ و چشم.",categories:["آرایش"],keywords:["Foundation","Primer","Lip","Mascara","Blush","Highlighter"]},
  hair:{title:"مراقبت مو",desc:"روتین سبک برای شست‌وشو، نرم‌کنندگی و فینیش.",categories:["مو"],keywords:["Keratin","Argan","Biotin","Protein","Silk"]}
};

const budgetCaps: Record<Budget,number> = {
  "3": 3000000,
  "6": 6000000,
  open: Number.POSITIVE_INFINITY
};

function score(product:Product, goal:Goal){
  const config=goals[goal];
  const text=(product.nameEn+" "+product.ingredients.join(" ")).toLowerCase();
  let value=config.categories.includes(product.category)?5:0;
  for(const keyword of config.keywords){
    if(text.includes(keyword.toLowerCase())) value+=3;
  }
  value+=product.rating;
  value+=Math.min(product.reviewCount/250,2);
  return value;
}

function buildRoutine(goal:Goal,budget:Budget,steps:Steps){
  const cap=budgetCaps[budget];
  const ranked=[...products]
    .filter((product)=>goals[goal].categories.includes(product.category))
    .sort((a,b)=>score(b,goal)-score(a,goal) || a.price-b.price);

  const picked:Product[]=[];
  let total=0;

  for(const product of ranked){
    if(picked.length>=steps) break;
    if(total+product.price<=cap || budget==="open"){
      picked.push(product);
      total+=product.price;
    }
  }

  if(picked.length<steps){
    for(const product of ranked){
      if(picked.length>=steps) break;
      if(!picked.some((item)=>item.id===product.id)){
        picked.push(product);
        total+=product.price;
      }
    }
  }

  return {picked,total};
}

export default function RoutineBuilder(){
  const [goal,setGoal]=useState<Goal>("hydration");
  const [budget,setBudget]=useState<Budget>("6");
  const [steps,setSteps]=useState<Steps>(3);
  const add=useCart((state)=>state.add);
  const wishlistIds=useWishlist((state)=>state.ids);
  const toggleWishlist=useWishlist((state)=>state.toggle);

  const routine=useMemo(()=>buildRoutine(goal,budget,steps),[goal,budget,steps]);

  const addAll=()=>{
    routine.picked.forEach((product)=>add(product,product.shades?.[0]?.id));
  };

  return <main className="routine-page">
    <header className="shop-nav">
      <Link href="/" className="brand">VELOURA</Link>
      <nav><Link href="/shop/">فروشگاه</Link><Link href="/cart/">سبد خرید</Link></nav>
    </header>

    <section className="routine-hero">
      <p className="eyebrow">ROUTINE BUILDER · NO QUIZ FATIGUE</p>
      <h1>روتینت را<br/><em>سریع بچین.</em></h1>
      <p>سه انتخاب کوتاه؛ بعد یک ادیت پیشنهادی از خود کاتالوگ ولورا. این ابزار تشخیص پزشکی یا پوستی نیست و فقط برای ساده‌کردن انتخاب محصول است.</p>
    </section>

    <section className="routine-controls" aria-label="تنظیم روتین">
      <fieldset>
        <legend>01 · هدفت چیست؟</legend>
        <div className="routine-options">
          {(Object.keys(goals) as Goal[]).map((item)=><button type="button" key={item} className={goal===item?"active":""} onClick={()=>setGoal(item)}><strong>{goals[item].title}</strong><span>{goals[item].desc}</span></button>)}
        </div>
      </fieldset>

      <fieldset>
        <legend>02 · بودجه کل</legend>
        <div className="routine-pills">
          <button type="button" className={budget==="3"?"active":""} onClick={()=>setBudget("3")}>تا ۳ میلیون</button>
          <button type="button" className={budget==="6"?"active":""} onClick={()=>setBudget("6")}>تا ۶ میلیون</button>
          <button type="button" className={budget==="open"?"active":""} onClick={()=>setBudget("open")}>آزاد</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>03 · چند مرحله؟</legend>
        <div className="routine-pills">
          <button type="button" className={steps===3?"active":""} onClick={()=>setSteps(3)}>۳ مرحله</button>
          <button type="button" className={steps===5?"active":""} onClick={()=>setSteps(5)}>۵ مرحله</button>
        </div>
      </fieldset>
    </section>

    <section className="routine-result">
      <div className="routine-result-head">
        <div>
          <p className="eyebrow">YOUR VELOURA EDIT</p>
          <h2>{goals[goal].title} · {fa.format(routine.picked.length)} محصول</h2>
          <p>جمع تقریبی: <strong>{money(routine.total)}</strong></p>
        </div>
        <button className="button button-dark" onClick={addAll}>افزودن همه به سبد</button>
      </div>

      <div className="routine-grid">
        {routine.picked.map((product,index)=>(
          <article key={product.id}>
            <span className="routine-step">0{index+1}</span>
            <Link className="routine-image" href={"/product/"+product.slug}>
              <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width:700px) 50vw,20vw"/>
            </Link>
            <div className="routine-copy">
              <span>{product.category}</span>
              <h3><Link href={"/product/"+product.slug}>{product.nameFa}</Link></h3>
              <p>{product.ingredients.slice(0,2).join(" · ") || product.nameEn}</p>
              <div><strong>{money(product.price)}</strong><button className={wishlistIds.includes(product.id)?"active":""} onClick={()=>toggleWishlist(product.id)}>{wishlistIds.includes(product.id)?"♥":"♡"}</button></div>
            </div>
          </article>
        ))}
      </div>

      <div className="routine-note">
        <strong>نکته انتخاب</strong>
        <p>اگر پوست حساس، آلرژی، بارداری یا مصرف ترکیبات فعال مثل رتینوئید داری، اطلاعات رسمی محصول و نظر متخصص را مبنا قرار بده. این ابزار توصیه پزشکی ارائه نمی‌کند.</p>
      </div>
    </section>
  </main>;
}
