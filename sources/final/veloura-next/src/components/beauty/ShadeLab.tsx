"use client";

import { useMemo, useState } from "react";

const shades = [
  { id: "rose", name: "رز خاموش", hex: "#9F5562", tone: "خنثی" },
  { id: "nude", name: "نود گرم", hex: "#B87562", tone: "گرم" },
  { id: "berry", name: "بری عمیق", hex: "#67243B", tone: "سرد" },
  { id: "coral", name: "مرجانی نرم", hex: "#C96D63", tone: "گرم" },
  { id: "mauve", name: "موو ابری", hex: "#865B70", tone: "سرد" }
] as const;

export default function ShadeLab(){
  const [undertone,setUndertone]=useState<"گرم"|"خنثی"|"سرد">("خنثی");
  const [selected,setSelected]=useState("rose");
  const options=useMemo(()=>shades.filter((s)=>s.tone===undertone || undertone==="خنثی"),[undertone]);
  const shade=shades.find((s)=>s.id===selected) || shades[0];

  return <section className="shade-lab" id="shade-lab">
    <div className="shade-copy">
      <p className="eyebrow">SHADE LAB · LIVE PREVIEW</p>
      <h2>رنگی که به <em>تو</em> نزدیک‌تر است.</h2>
      <p>آندرتون را انتخاب کن، بعد رنگ را روی آبجکت محصول ببین. تغییر رنگ فوری است و هیچ انیمیشنی جلوی انتخاب واقعی را نمی‌گیرد.</p>

      <div className="undertones" role="group" aria-label="انتخاب آندرتون">
        {(["گرم","خنثی","سرد"] as const).map((item)=><button key={item} className={undertone===item?"active":""} onClick={()=>setUndertone(item)}>{item}</button>)}
      </div>

      <div className="shade-options" role="group" aria-label="انتخاب رنگ">
        {options.map((item)=><button key={item.id} className={selected===item.id?"active":""} onClick={()=>setSelected(item.id)} aria-label={item.name} title={item.name}><i style={{background:item.hex}}/><span>{item.name}</span></button>)}
      </div>

      <a className="button shade-cta" href="/product/velvet-cloud-lip/">مشاهده محصول ←</a>
    </div>

    <div className="shade-stage" style={{"--shade":shade.hex} as React.CSSProperties}>
      <div className="shade-aura"/>
      <div className="shade-stick">
        <div className="shade-cap"/>
        <div className="shade-bullet"/>
        <div className="shade-base"><b>FATIKHAN</b></div>
      </div>
      <div className="shade-label"><span>SHADE</span><strong>{shade.name}</strong><small>{shade.tone} UNDERTONE</small></div>
    </div>
  </section>;
}
