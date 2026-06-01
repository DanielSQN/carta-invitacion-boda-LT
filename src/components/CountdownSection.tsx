"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const weddingDate = new Date("2026-09-26T00:00:00-05:00");

type CountdownTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const initialCountdown: CountdownTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function getCountdownTime(): CountdownTime {
  const totalSeconds = Math.max(Math.floor((weddingDate.getTime() - Date.now()) / 1000), 0);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M14 21.2C7.7 16.55 4.1 12.95 4.1 8.85C4.1 5.95 6.28 4 8.88 4C11.05 4 12.62 5.18 14 7.05C15.38 5.18 16.95 4 19.12 4C21.72 4 23.9 5.95 23.9 8.85C23.9 12.95 20.3 16.55 14 21.2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.15"
      />
    </svg>
  );
}

function MarqueeHeart({ className = "" }: { className?: string }) {
  return <HeartIcon className={`countdown-marquee-heart ${className}`} />;
}

function OrbitRings() {
  return (
    <svg className="countdown-orbits" viewBox="0 0 360 360" fill="none" aria-hidden="true" focusable="false">
      <circle className="countdown-orbit countdown-orbit--blue" cx="180" cy="180" r="156" />
      <circle className="countdown-orbit countdown-orbit--slate" cx="180" cy="180" r="134" />
      <circle className="countdown-orbit countdown-orbit--gold" cx="180" cy="180" r="112" />
      <circle className="countdown-orbit-dot countdown-orbit-dot--top" cx="180" cy="44" r="4.5" />
      <circle className="countdown-orbit-dot countdown-orbit-dot--right" cx="316" cy="180" r="3.6" />
      <circle className="countdown-orbit-dot countdown-orbit-dot--bottom" cx="180" cy="316" r="4.5" />
      <circle className="countdown-orbit-dot countdown-orbit-dot--left" cx="44" cy="180" r="3.6" />
      <path
        className="countdown-orbit-heart countdown-orbit-heart--top-right"
        d="M255 89C248.9 84.55 245.7 81.1 246.5 77.85C247.25 74.9 251.05 74.25 255 78.4C258.95 74.25 262.75 74.9 263.5 77.85C264.3 81.1 261.1 84.55 255 89Z"
      />
      <path
        className="countdown-orbit-heart countdown-orbit-heart--bottom-left"
        d="M105 276C98.9 271.55 95.7 268.1 96.5 264.85C97.25 261.9 101.05 261.25 105 265.4C108.95 261.25 112.75 261.9 113.5 264.85C114.3 268.1 111.1 271.55 105 276Z"
      />
    </svg>
  );
}

export default function CountdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const quoteTextRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [countdown, setCountdown] = useState<CountdownTime>(initialCountdown);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setCountdown(getCountdownTime()), 0);
    const interval = window.setInterval(() => setCountdown(getCountdownTime()), 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scroller = sectionRef.current?.closest(".details-scroll") as HTMLElement | null;
    const triggerDefaults = scroller ? { scroller } : {};

    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, { yPercent: -4, scale: 1.08, force3D: true });
      gsap.set(topRef.current, { opacity: 1 });
      gsap.set(quoteTextRef.current, { xPercent: 0, opacity: 1 });
      gsap.set([titleRef.current, ringsRef.current, metaRef.current, ...itemRefs.current], { opacity: 0 });

      if (reduceMotion) {
        gsap.set(imageRef.current, { yPercent: 0, scale: 1 });
        gsap.set(quoteTextRef.current, { opacity: 1, xPercent: 0 });
        gsap.set([titleRef.current, ringsRef.current, metaRef.current, ...itemRefs.current], {
          opacity: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
            ...triggerDefaults,
          },
        })
        .to(quoteTextRef.current, { xPercent: -50, duration: 14, repeat: -1, ease: "none" }, 0)
        .fromTo(titleRef.current, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.86, ease: "power2.out" }, 0.22)
        .fromTo(ringsRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1.08, ease: "power2.out" }, 0.3)
        .fromTo(
          itemRefs.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.72, stagger: 0.08, ease: "power2.out" },
          0.36,
        )
        .fromTo(metaRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.72, ease: "power2.out" }, 0.58);

      gsap.to(imageRef.current, {
        yPercent: 4,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.75,
          invalidateOnRefresh: true,
          ...triggerDefaults,
        },
      });

      gsap.to(".countdown-orbit--blue", { rotate: 360, transformOrigin: "50% 50%", duration: 32, repeat: -1, ease: "none" });
      gsap.to(".countdown-orbit--slate", { rotate: -360, transformOrigin: "50% 50%", duration: 42, repeat: -1, ease: "none" });
      gsap.to(".countdown-orbit--gold", { rotate: 360, transformOrigin: "50% 50%", duration: 55, repeat: -1, ease: "none" });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const items = [
    { label: "DÍAS", value: countdown.days },
    { label: "HORAS", value: countdown.hours },
    { label: "MINUTOS", value: countdown.minutes },
    { label: "SEGUNDOS", value: countdown.seconds },
  ];

  return (
    <section ref={sectionRef} className="countdown-section" aria-labelledby="countdown-title">
      <div ref={imageRef} className="countdown-bg" aria-hidden="true">
        <Image
          src="/images/couple/_DSC0723.webp?v=20260601-assets-1"
          alt=""
          fill
          sizes="100vw"
          className="countdown-bg-image"
          priority={false}
        />
      </div>
      <div className="countdown-overlay" aria-hidden="true" />
      <div className="countdown-vignette" aria-hidden="true" />

      <div className="countdown-layout">
        <div ref={topRef} className="countdown-quote-panel">
          <p className="countdown-quote-copy">
            <span ref={quoteTextRef}>
              <span className="countdown-marquee-item">
                <span className="countdown-marquee-text">
                  Desde aquel <span className="countdown-marquee-yes">Sí</span>, empezó nuestra aventura favorita
                </span>
                <MarqueeHeart />
              </span>
              <span className="countdown-marquee-item" aria-hidden="true">
                <span className="countdown-marquee-text">
                  Desde aquel <span className="countdown-marquee-yes">Sí</span>, empezó nuestra aventura favorita
                </span>
                <MarqueeHeart />
              </span>
            </span>
          </p>
        </div>

        <div className="countdown-content">
          <div ref={ringsRef} className="countdown-orbit-wrap">
            <OrbitRings />
          </div>

          <div ref={titleRef} className="countdown-title-block">
            <h2 id="countdown-title">Faltan</h2>
            <span aria-hidden="true" />
          </div>

          <div className="countdown-grid" aria-label="Cuenta regresiva para la boda">
            {items.map((item, index) => (
              <div
                key={item.label}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className="countdown-unit"
              >
                <strong>{String(item.value).padStart(2, "0")}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div ref={metaRef} className="countdown-meta">
            <p className="countdown-date">26 · SEP · 2026</p>
            <div className="countdown-place">
              <p>HACIENDA SANTA ELENA</p>
              <span>COTA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
