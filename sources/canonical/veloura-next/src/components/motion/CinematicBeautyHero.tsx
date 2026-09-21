"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HeroStage from "@/components/motion/HeroStage";

gsap.registerPlugin(ScrollTrigger);

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

const VIDEO_SCRUB_ENABLED = process.env.NEXT_PUBLIC_FATIKHAN_CINEMATIC_VIDEO !== "0";

export default function CinematicBeautyHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (!VIDEO_SCRUB_ENABLED) return;

    const media = video.current;
    if (!media) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;

    if (reducedMotion || saveData) return;

    const onReady = () => {
      if (!Number.isFinite(media.duration) || media.duration <= 0 || media.readyState < 2) return;
      media.pause();
      setVideoFailed(false);
      setVideoReady(true);
    };
    const onError = () => {
      setVideoReady(false);
      setVideoFailed(true);
    };

    media.addEventListener("loadeddata", onReady);
    media.addEventListener("canplay", onReady);
    media.addEventListener("error", onError);
    media.load();

    return () => {
      media.removeEventListener("loadeddata", onReady);
      media.removeEventListener("canplay", onReady);
      media.removeEventListener("error", onError);
    };
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".cinematic-chapter", { opacity: 0, y: 28 });
      gsap.set(".cinematic-progress-fill", { scaleY: 0, transformOrigin: "50% 0%" });

      if (videoReady && video.current) {
        const media = video.current;
        let pendingFrame = 0;
        let targetTime = 0;

        gsap.set(".cinematic-scrub-video", { opacity: 1 });
        gsap.set(".cinematic-stage", { opacity: 0 });

        const seekTrigger = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            targetTime = self.progress * Math.max(0, media.duration - 0.04);
            if (pendingFrame) return;
            pendingFrame = window.requestAnimationFrame(() => {
              pendingFrame = 0;
              if (!media.paused) media.pause();
              if (Math.abs(media.currentTime - targetTime) > 0.016) {
                media.currentTime = targetTime;
              }
            });
          }
        });

        const copyTl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        });

        // Golestan build-journal timing contract:
        // 01: 15–25%, 02: 35–45%, 03: 60–70%, 04: 85–100%.
        copyTl
          .to(".cinematic-progress-fill", { scaleY: 1, duration: 1, ease: "none" }, 0)
          .to(".chapter-one", { opacity: 1, y: 0, duration: 0.035 }, 0.115)
          .to(".chapter-one", { opacity: 0, y: -24, duration: 0.035 }, 0.25)
          .to(".chapter-two", { opacity: 1, y: 0, duration: 0.035 }, 0.315)
          .to(".chapter-two", { opacity: 0, y: -24, duration: 0.035 }, 0.45)
          .to(".chapter-three", { opacity: 1, y: 0, duration: 0.035 }, 0.565)
          .to(".chapter-three", { opacity: 0, y: -24, duration: 0.035 }, 0.70)
          .to(".chapter-four", { opacity: 1, y: 0, duration: 0.05 }, 0.80)
          .to(".cinematic-final-glow", { opacity: 0.72, scale: 1.12, duration: 0.15 }, 0.85);

        return () => {
          if (pendingFrame) window.cancelAnimationFrame(pendingFrame);
          seekTrigger.kill();
          copyTl.kill();
        };
      }

      gsap.set(".cinematic-stage-two, .cinematic-stage-three, .cinematic-stage-four", { opacity: 0 });

      const fallbackTl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
          invalidateOnRefresh: true
        }
      });

      fallbackTl
        .to(".cinematic-progress-fill", { scaleY: 1, duration: 4 }, 0)
        .to(".cinematic-product-frame", { scale: 1.06, rotate: 1.5, yPercent: -3, duration: 0.9 }, 0.05)
        .to(".chapter-one", { opacity: 0, y: -28, duration: 0.28 }, 0.62)
        .to(".cinematic-stage-one", { opacity: 0.12, scale: 1.08, duration: 0.45 }, 0.64)
        .to(".cinematic-stage-two", { opacity: 1, scale: 1, duration: 0.48 }, 0.72)
        .to(".chapter-two", { opacity: 1, y: 0, duration: 0.34 }, 0.78)
        .to(".chapter-two", { opacity: 0, y: -28, duration: 0.28 }, 1.48)
        .to(".cinematic-stage-two", { opacity: 0.08, scale: 1.07, duration: 0.45 }, 1.50)
        .to(".cinematic-stage-three", { opacity: 1, scale: 1, duration: 0.48 }, 1.58)
        .to(".chapter-three", { opacity: 1, y: 0, duration: 0.34 }, 1.64)
        .to(".chapter-three", { opacity: 0, y: -28, duration: 0.28 }, 2.34)
        .to(".cinematic-stage-three", { opacity: 0.1, scale: 1.07, duration: 0.45 }, 2.36)
        .to(".cinematic-stage-four", { opacity: 1, scale: 1, duration: 0.52 }, 2.44)
        .to(".chapter-four", { opacity: 1, y: 0, duration: 0.36 }, 2.50)
        .to(".cinematic-stage-four img", { scale: 1.035, duration: 1.18 }, 2.64)
        .to(".cinematic-final-glow", { opacity: 0.72, scale: 1.12, duration: 1.0 }, 2.70);
    });

    return () => mm.revert();
  }, { scope: root, dependencies: [videoReady] });

  return (
    <section
      className={videoReady ? "cinematic-hero video-active" : "cinematic-hero"}
      ref={root}
      aria-labelledby="cinematic-title"
      data-video-state={videoReady ? "ready" : videoFailed ? "fallback" : "loading"}
      data-cinematic-runtime="golestan-scroll-cinematic-v2"
    >
      <div className="cinematic-sticky">
        {VIDEO_SCRUB_ENABLED && <video
          ref={video}
          className="cinematic-scrub-video"
          muted
          playsInline
          preload="auto"
          poster="/cinematic/fatikhan-poster.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/cinematic/fatikhan-hero.webm" type="video/webm" />
          <source src="/cinematic/fatikhan-hero.mp4" type="video/mp4" />
        </video>}

        <div className="cinematic-stage cinematic-stage-one" aria-hidden="true">
          <div className="cinematic-product-frame">
            <HeroStage />
          </div>
        </div>

        <div className="cinematic-stage cinematic-stage-two" aria-hidden="true">
          <Image src="/editorial-hero.jpg" alt="" fill priority sizes="100vw" />
        </div>

        <div className="cinematic-stage cinematic-stage-three" aria-hidden="true">
          <Image src="/date-night-makeup-set.jpg" alt="" fill sizes="100vw" />
        </div>

        <div className="cinematic-stage cinematic-stage-four" aria-hidden="true">
          <Image src="/signature-collection-set.jpg" alt="" fill sizes="100vw" />
        </div>

        <div className="cinematic-frame" aria-hidden="true"><i/><i/><i/><i/></div>
        <div className="cinematic-final-glow" aria-hidden="true" />
        <div className="cinematic-vignette" aria-hidden="true" />
        <div className="cinematic-grain" aria-hidden="true" />

        <div className="cinematic-copy">
          <article className="cinematic-chapter chapter-one">
            <span className="cinematic-kicker">01 · ORIGIN</span>
            <h1 id="cinematic-title">FATIKHAN</h1>
            <p className="cinematic-subtitle">زیبایی، وقتی دقیق می‌شود.</p>
            <small>نور · پوست · بافت · حضور</small>
          </article>

          <article className="cinematic-chapter chapter-two">
            <span className="cinematic-kicker">02 · TEXTURE</span>
            <h2>بافت را ببین.<br/><em>لمسش را تصور کن.</em></h2>
            <p>فرمول‌های سبک، پرداخت تمیز و جزئیاتی که از نزدیک معنا پیدا می‌کنند.</p>
          </article>

          <article className="cinematic-chapter chapter-three">
            <span className="cinematic-kicker">03 · COLOR</span>
            <h2>رنگ،<br/><em>در لحظه‌ی درست.</em></h2>
            <p>از رنگ‌های روزمره تا انتخاب‌های جسور؛ بدون شلوغی، فقط تمرکز روی خود محصول.</p>
          </article>

          <article className="cinematic-chapter chapter-four">
            <span className="cinematic-kicker">04 · INVITATION</span>
            <h2>انتخاب کن.<br/><em>نزدیک شو. بدرخش.</em></h2>
            <p>کالکشن FATIKHAN را بر اساس پوست، آرایش، عطر و مو کشف کن.</p>
            <div className="cinematic-actions">
              <a href="#products">کشف کالکشن</a>
              <a href="/shop/">ورود به فروشگاه ↗</a>
            </div>
          </article>
        </div>

        <div className="cinematic-progress" aria-hidden="true">
          <span>01</span>
          <i><b className="cinematic-progress-fill" /></i>
          <span>04</span>
        </div>

        <span className="cinematic-scroll-cue">
          {videoReady ? "SCROLL TO CONTROL THE FILM" : "SCROLL TO DISCOVER"}
        </span>
      </div>
    </section>
  );
}
