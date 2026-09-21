"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function SignatureStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true
        }
      });

      tl.fromTo(".film-product", { yPercent: 20, rotate: -7, scale: 0.78 }, { yPercent: 0, rotate: 0, scale: 1, duration: 1 })
        .fromTo(".film-cap", { y: 0 }, { y: -135, rotate: 8, duration: 1 }, 0.65)
        .fromTo(".film-bullet", { scaleY: 0.15, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 1 }, 1.15)
        .fromTo(".pigment", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.1 }, 1.45)
        .fromTo(".film-title", { y: 45, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 1.65)
        .fromTo(".film-note", { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.65 }, 1.9)
        .to(".film-product", { rotate: 9, xPercent: -8, duration: 0.9 }, 2.15)
        .fromTo(".film-buy", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 2.5);
    });

    return () => mm.revert();
  }, { scope: root });

  return (
    <section className="signature-film" ref={root}>
      <div className="film-sticky">
        <div className="film-noise" aria-hidden="true" />
        <div className="pigment" aria-hidden="true" />

        <div className="film-copy">
          <p className="eyebrow">SIGNATURE · VELVET CLOUD</p>
          <h2 className="film-title">رنگی که با حرکت تو<br/><em>زنده می‌شود.</em></h2>
          <div className="film-notes">
            <span className="film-note">01 · بافت مخملی</span>
            <span className="film-note">02 · رنگدانه فشرده</span>
            <span className="film-note">03 · حس سبک</span>
          </div>
          <div className="film-buy">
            <strong>رژ لب مخملی کلود</strong>
            <span>۱٬۸۹۰٬۰۰۰ تومان</span>
            <a href="#products">انتخاب رنگ و خرید ←</a>
          </div>
        </div>

        <div className="film-stage" aria-hidden="true">
          <div className="film-halo" />
          <div className="film-product">
            <div className="film-cap" />
            <div className="film-bullet" />
            <div className="film-tube"><b>V</b></div>
          </div>
        </div>

        <div className="film-progress">
          <span>02</span>
          <i />
          <span>03</span>
        </div>
      </div>
    </section>
  );
}
