"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SectionFrameDecor from "./SectionFrameDecor";
import { createBgParallax } from "./sectionFx";

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

function GoogleCalendarIcon() {
  return (
    <svg className="countdown-action-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M6 9.2h20v15.9A2.9 2.9 0 0 1 23.1 28H8.9A2.9 2.9 0 0 1 6 25.1V9.2Z" fill="#fff" />
      <path d="M6 9.2h20V6.9A2.9 2.9 0 0 0 23.1 4H8.9A2.9 2.9 0 0 0 6 6.9v2.3Z" fill="#4285F4" />
      <path d="M11.1 2.8v4.7M20.9 2.8v4.7" stroke="#5F6368" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M13.2 22.3h5.9M13.2 17.2h5.9" stroke="#4285F4" strokeLinecap="round" strokeWidth="2" />
      <path d="M8.9 4h14.2A2.9 2.9 0 0 1 26 6.9v18.2a2.9 2.9 0 0 1-2.9 2.9H8.9A2.9 2.9 0 0 1 6 25.1V6.9A2.9 2.9 0 0 1 8.9 4Z" fill="none" stroke="#DADCE0" strokeWidth="1" />
    </svg>
  );
}

export default function CountdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const quoteTextRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
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
      gsap.set(topRef.current, { opacity: 1 });
      gsap.set(quoteTextRef.current, { xPercent: 0, opacity: 1 });
      gsap.set([titleRef.current, metaRef.current, ...itemRefs.current], { opacity: 0 });

      createBgParallax(sectionRef.current, imageRef.current, { amplitude: 5, scale: 1.1 });

      if (reduceMotion) {
        gsap.set(quoteTextRef.current, { opacity: 1, xPercent: 0 });
        gsap.set([titleRef.current, metaRef.current, ...itemRefs.current], {
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
            toggleActions: "play none none none",
            ...triggerDefaults,
          },
        })
        .to(quoteTextRef.current, { xPercent: -50, duration: 14, repeat: -1, ease: "none" }, 0)
        .fromTo(titleRef.current, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.86, ease: "power2.out" }, 0.22)
        .fromTo(
          itemRefs.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.72, stagger: 0.08, ease: "power2.out" },
          0.36,
        )
        .fromTo(metaRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.72, ease: "power2.out" }, 0.58);

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
  const calendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda%20Luisa%20%26%20Tattan&dates=20260926T200000Z/20260927T050000Z&details=Celebramos%20nuestra%20boda%20con%20ustedes.&location=Hacienda%20Santa%20Elena%2C%20Cota%2C%20Cundinamarca";

  return (
    <section ref={sectionRef} className="countdown-section" aria-labelledby="countdown-title">
      <SectionFrameDecor variant="countdown" />
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
                <strong key={`${item.label}-${item.value}`} className="countdown-unit-value">
                  {String(item.value).padStart(2, "0")}
                </strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div ref={metaRef} className="countdown-meta">
            <p className="countdown-date">26 · SEP · 2026</p>
            <div className="countdown-actions" aria-label="Acciones de fecha y ubicacion">
              <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
                <GoogleCalendarIcon />
                Agregar al calendario
              </a>
            </div>
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
