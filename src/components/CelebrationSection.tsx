"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

function HeartRule() {
  return (
    <svg className="celebration-rule" viewBox="0 0 260 26" fill="none" aria-hidden="true" focusable="false">
      <path d="M5 13H103" stroke="currentColor" strokeLinecap="round" strokeWidth="0.85" />
      <path d="M157 13H255" stroke="currentColor" strokeLinecap="round" strokeWidth="0.85" />
      <path
        d="M130 18C124.1 13.8 121.1 10.55 122.15 7.4C123.02 4.82 126.65 4.4 130 8.45C133.35 4.4 136.98 4.82 137.85 7.4C138.9 10.55 135.9 13.8 130 18Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.95"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="celebration-pin" viewBox="0 0 26 26" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M13 23C17.65 18.28 20 14.48 20 10.7C20 6.84 16.86 4 13 4C9.14 4 6 6.84 6 10.7C6 14.48 8.35 18.28 13 23Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <circle cx="13" cy="10.8" r="2.4" stroke="currentColor" strokeWidth="1.05" />
    </svg>
  );
}

export default function CelebrationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scroller = sectionRef.current?.closest(".details-scroll") as HTMLElement | null;
    const triggerDefaults = scroller ? { scroller } : {};

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set([titleRef.current, ruleRef.current, infoRef.current, imageRef.current, buttonRef.current], {
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
            start: "top 75%",
            toggleActions: "play none none reverse",
            ...triggerDefaults,
          },
        })
        .fromTo(titleRef.current, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.82, ease: "power2.out" }, 0)
        .fromTo(ruleRef.current, { opacity: 0 }, { opacity: 1, duration: 0.78, ease: "power2.out" }, 0.14)
        .fromTo(imageRef.current, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, 0.22)
        .fromTo(infoRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.88, ease: "power2.out" }, 0.32)
        .fromTo(buttonRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.68, ease: "power2.out" }, 0.52);

      const rulePaths = gsap.utils.toArray<SVGPathElement>(".celebration-rule path");
      rulePaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      gsap.to(rulePaths, {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
          ...triggerDefaults,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="celebration-section" aria-labelledby="celebration-title">
      <div className="celebration-inner">
        <div ref={titleRef} className="celebration-heading">
          <p>Acompáñanos a celebrar este día tan especial</p>
          <h2 id="celebration-title">Celebración</h2>
        </div>

        <div ref={ruleRef} className="celebration-rule-wrap">
          <HeartRule />
        </div>

        <div className="celebration-layout">
          <div ref={imageRef} className="celebration-image-card">
            <Image
              src="/images/venues/hacienda_SH.webp"
              alt="Hacienda Santa Elena"
              fill
              sizes="(max-width: 720px) 88vw, 360px"
              className="celebration-image"
            />
          </div>

          <div ref={infoRef} className="celebration-info-card">
            <p className="celebration-date">26 · SEP · 2026</p>
            <p className="celebration-time">XX:XX P.M.</p>
            <div className="celebration-place">
              <strong>Hacienda Santa Elena</strong>
              <span>Cota</span>
            </div>
            <a
              ref={buttonRef}
              className="celebration-map-button"
              href="https://maps.app.goo.gl/yYX8tQsJdW1rckqX7"
              target="_blank"
              rel="noopener noreferrer"
            >
              <PinIcon />
              Ver ubicación
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
