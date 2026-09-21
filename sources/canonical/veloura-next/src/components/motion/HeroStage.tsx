"use client";

import dynamic from "next/dynamic";
import { useCapabilityTier } from "@/hooks/useCapabilityTier";

const HeroProductScene = dynamic(() => import("@/scenes/HeroProductScene"), {
  ssr: false,
  loading: () => null
});

export default function HeroStage({ allow3D = true }: { allow3D?: boolean }) {
  const tier = useCapabilityTier();
  const enable3D = allow3D && tier === "A";

  return (
    <div className="hero-object" aria-label="نمایش سینمایی محصول">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="hero-glow" />

      <div className={enable3D ? "hero-css-product fade-under" : "hero-css-product"}>
        <div className="cosmetic-object">
          <div className="cap" />
          <div className="bottle">
            <span className="bottle-shine" />
            <b>FATIKHAN</b>
            <small>PEARL BARRIER SERUM</small>
          </div>
        </div>
      </div>

      {enable3D && <div className="hero-r3f"><HeroProductScene /></div>}

      <div className="floating-note note-one"><b>01</b><span>سد دفاعی پوست</span></div>
      <div className="floating-note note-two"><b>02</b><span>بافت سبک</span></div>
    </div>
  );
}
