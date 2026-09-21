"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HeroStage from "@/components/motion/HeroStage";

gsap.registerPlugin(ScrollTrigger);

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: "slow-2g" | "2g" | "3g" | "4g" | string;
  };
};

const VIDEO_SCRUB_ENABLED = process.env.NEXT_PUBLIC_FATIKHAN_CINEMATIC_VIDEO !== "0";

export default function CinematicBeautyHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [videoEligible, setVideoEligible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (!VIDEO_SCRUB_ENABLED) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactViewport = window.matchMedia("(max-width: 767px)").matches;
    const connection = (navigator as NavigatorWithConnection).connection;
    const saveData = connection?.saveData === true;
    const slowNetwork = connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";

    setVideoEligible(!(reducedMotion || saveData || slowNetwork));
  }, []);

  useEffect(() => {
    if (!VIDEO_SCRUB_ENABLED || !videoEligible) return;

    const media = video.current;
    if (!media) return;

    const controller = new AbortController();
    let objectUrl = "";

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

    const loadScrubMaster = async () => {
      try {
        const response = await fetch("/cinematic/fatikhan-hero.mp4", {
          cache: "force-cache",
          signal: controller.signal
        });
        if (!response.ok) throw new Error("cinematic master fetch failed");

        const blob = await response.blob();
        if (controller.signal.aborted) return;

        objectUrl = URL.createObjectURL(blob);
        media.src = objectUrl;
        media.load();
      } catch {
        if (!controller.signal.aborted) onError();
      }
    };

    void loadScrubMaster();

    return () => {
      controller.abort();
      media.removeEventListener("loadeddata", onReady);
      media.removeEventListener("canplay", onReady);
      media.removeEventListener("error", onError);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [videoEligible]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".chapter-two, .chapter-three, .chapter-four", { opacity: 0, y: 34 });
      gsap.set(".cinematic-progress-fill", { scaleY: 0, transformOrigin: "50% 0%" });

      if (videoReady && video.current) {
        const media = video.current;
        let targetTime = media.currentTime;
        let lastSeekAt = 0;
        let trailingSeek = 0;
        const seekIntervalMs = 45;

        gsap.set(".cinematic-scrub-video", { opacity: 1 });

        const applySeek = () => {
          trailingSeek = 0;
          if (media.readyState < 1) return;
          if (Math.abs(media.currentTime - targetTime) < 1 / 30) return;

          lastSeekAt = performance.now();
          media.currentTime = targetTime;
        };

        const scheduleSeek = () => {
          const elapsed = performance.now() - lastSeekAt;
          if (elapsed >= seekIntervalMs) {
            if (trailingSeek) window.clearTimeout(trailingSeek);
            applySeek();
            return;
          }

          if (trailingSeek) return;
          trailingSeek = window.setTimeout(applySeek, seekIntervalMs - elapsed);
        };

        const syncFromProgress = (self: ScrollTrigger) => {
          targetTime = self.progress * Math.max(0, media.duration - 0.04);
          scheduleSeek();
        };

        const seekTrigger = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: syncFromProgress,
          onRefresh: syncFromProgress
        });

        // If the scrub master finishes loading after the user has already
        // entered the hero, align it immediately instead of flashing frame 0
        // until the next wheel/touch event.
        targetTime = seekTrigger.progress * Math.max(0, media.duration - 0.04);
        applySeek();

        const copyTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.55,
            invalidateOnRefresh: true
          }
        });

        copyTl
          .to(".cinematic-progress-fill", { scaleY: 1, duration: 4 }, 0)
          .to(".chapter-one", { opacity: 0, y: -28, duration: 0.24 }, 0.72)
          .to(".chapter-two", { opacity: 1, y: 0, duration: 0.28 }, 0.84)
          .to(".chapter-two", { opacity: 0, y: -28, duration: 0.24 }, 1.56)
          .to(".chapter-three", { opacity: 1, y: 0, duration: 0.28 }, 1.68)
          .to(".chapter-three", { opacity: 0, y: -28, duration: 0.24 }, 2.40)
          .to(".chapter-four", { opacity: 1, y: 0, duration: 0.30 }, 2.54)
          .to(".cinematic-final-glow", { opacity: 0.72, scale: 1.12, duration: 1.05 }, 2.70);

        return () => {
          if (trailingSeek) window.clearTimeout(trailingSeek);
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
      data-video-state={videoReady ? "ready" : videoFailed || !videoEligible ? "fallback" : "loading"}
      data-cinematic-runtime="blob-throttle-v3"
    >
      <div className="cinematic-sticky">
        {VIDEO_SCRUB_ENABLED && videoEligible && <video
          ref={video}
          className="cinematic-scrub-video"
          muted
          playsInline
          preload="auto"
          poster="/cinematic/fatikhan-poster.jpg"
          aria-hidden="true"
          tabIndex={-1}
        />}

        {!videoReady && <>
          <div className="cinematic-stage cinematic-stage-one" aria-hidden="true">
            <div className="cinematic-product-frame">
              <HeroStage allow3D={!videoEligible} />
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
        </>}

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
