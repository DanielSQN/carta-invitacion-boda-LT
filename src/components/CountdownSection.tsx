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

function OrbitRings() {
  return (
    <svg className="countdown-orbits" viewBox="0 0 320 320" fill="none" aria-hidden="true" focusable="false">
      <circle className="countdown-orbit countdown-orbit--blue" cx="160" cy="160" r="137" />
      <circle className="countdown-orbit countdown-orbit--slate" cx="160" cy="160" r="119" />
      <circle className="countdown-orbit countdown-orbit--gold" cx="160" cy="160" r="101" />
    </svg>
  );
}

export default function CountdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [countdown, setCountdown] = useState<CountdownTime>(() => getCountdownTime());

  useEffect(() => {
    const interval = window.setInterval(() => setCountdown(getCountdownTime()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.set([topRef.current, titleRef.current, ringsRef.current, ...itemRefs.current], { opacity: 0 });

      if (reduceMotion) {
        gsap.set([topRef.current, titleRef.current, ringsRef.current, ...itemRefs.current], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(topRef.current, { opacity: 0, y: -26 }, { opacity: 1, y: 0, duration: 0.85, ease: "power2.out" }, 0)
        .fromTo(titleRef.current, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.82, ease: "power2.out" }, 0.16)
        .fromTo(ringsRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1.08, ease: "power2.out" }, 0.22)
        .fromTo(
          itemRefs.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.72, stagger: 0.08, ease: "power2.out" },
          0.38,
        );

      gsap.to(imageRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".countdown-orbit--blue", { rotate: 360, transformOrigin: "50% 50%", duration: 32, repeat: -1, ease: "none" });
      gsap.to(".countdown-orbit--slate", { rotate: -360, transformOrigin: "50% 50%", duration: 42, repeat: -1, ease: "none" });
      gsap.to(".countdown-orbit--gold", { rotate: 360, transformOrigin: "50% 50%", duration: 55, repeat: -1, ease: "none" });
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
      <div className="countdown-bg" ref={imageRef} aria-hidden="true">
        <Image
          src="/images/couple/_DSC0953.webp"
          alt=""
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          className="countdown-bg-image"
        />
      </div>
      <div className="countdown-overlay" aria-hidden="true" />

      <div ref={topRef} className="countdown-quote-panel">
        <p>Todo comienza con una razón, y se convierte en “Sí”</p>
        <HeartIcon className="countdown-heart" />
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

        <p className="countdown-date">26 · SEP · 2026</p>
        <div className="countdown-place">
          <p>HACIENDA SANTA ELENA</p>
          <span>COTA</span>
        </div>
      </div>
    </section>
  );
}
