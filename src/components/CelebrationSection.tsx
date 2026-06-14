"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import SectionFrameDecor from "./SectionFrameDecor";
import { createBgParallax } from "./sectionFx";

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

function GoogleMapsIcon() {
  return (
    <svg className="celebration-brand-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        d="M16 2.8C10.68 2.8 6.38 7.08 6.38 12.35c0 6.63 7.45 15.1 9.05 16.84a0.77 0.77 0 0 0 1.14 0c1.6-1.74 9.05-10.21 9.05-16.84C25.62 7.08 21.32 2.8 16 2.8Z"
        fill="#34A853"
      />
      <path d="M16 2.8c5.32 0 9.62 4.28 9.62 9.55 0 2.34-.93 5.02-2.14 7.55L16 12.35V2.8Z" fill="#4285F4" />
      <path d="M8.52 19.9c-1.21-2.53-2.14-5.21-2.14-7.55 0-3.54 1.93-6.63 4.8-8.28L16 12.35 8.52 19.9Z" fill="#FBBC04" />
      <path d="M16 29.45c-1.22-1.33-5.82-6.56-7.48-9.55L16 12.35l7.48 7.55c-1.66 2.99-6.26 8.22-7.48 9.55Z" fill="#EA4335" />
      <circle cx="16" cy="12.35" r="3.28" fill="#fff" />
    </svg>
  );
}

function WazeIcon() {
  return (
    <svg className="celebration-brand-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        d="M23.7 21.9c2.4-1.8 3.9-4.5 3.9-7.6 0-5.6-5-10.1-11.2-10.1S5.2 8.7 5.2 14.3c0 1.1.2 2.2.6 3.2-1.3.8-2.6 1.1-3.4 1.1.5 1.8 1.8 3.2 3.5 3.9 1.2.5 2.5.5 3.7.2 1.9 1.1 4.2 1.7 6.8 1.7.9 0 1.8-.1 2.6-.3"
        fill="#8BE8FF"
        stroke="#17384A"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
      <circle cx="11.9" cy="14" r="1.2" fill="#17384A" />
      <circle cx="20.4" cy="14" r="1.2" fill="#17384A" />
      <path d="M13.8 18.1c1.4 1 3.1 1 4.5 0" stroke="#17384A" strokeLinecap="round" strokeWidth="1.25" />
      <circle cx="10.1" cy="25.3" r="2.1" fill="#17384A" />
      <circle cx="22.1" cy="25.3" r="2.1" fill="#17384A" />
    </svg>
  );
}

export default function CelebrationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const venueRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scroller = sectionRef.current?.closest(".details-scroll") as HTMLElement | null;
    const triggerDefaults = scroller ? { scroller } : {};

    const ctx = gsap.context(() => {
      createBgParallax(sectionRef.current, imageRef.current, { amplitude: 10, scale: 1.1 });

      if (reduceMotion) {
        gsap.set([titleRef.current, ruleRef.current, venueRef.current, infoRef.current, actionsRef.current], {
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
            toggleActions: "play none none none",
            ...triggerDefaults,
          },
        })
        .fromTo(titleRef.current, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.82, ease: "power2.out" }, 0.06)
        .fromTo(ruleRef.current, { opacity: 0 }, { opacity: 1, duration: 0.78, ease: "power2.out" }, 0.18)
        .fromTo(
          venueRef.current,
          { opacity: 0, y: 36, rotate: -5 },
          { opacity: 1, y: 0, rotate: -1.8, duration: 0.95, ease: "power3.out" },
          0.3,
        )
        .fromTo(infoRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.88, ease: "power2.out" }, 0.46)
        .fromTo(actionsRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.68, ease: "power2.out" }, 0.66);

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
          toggleActions: "play none none none",
          ...triggerDefaults,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="celebration-section" aria-labelledby="celebration-title">
      <SectionFrameDecor variant="celebration" />
      <div ref={imageRef} className="celebration-bg" aria-hidden="true">
        <Image
          src="/images/venues/lugar-celebracion.webp"
          alt=""
          fill
          sizes="100vw"
          quality={50}
          className="celebration-bg-image"
        />
      </div>
      <div className="celebration-bg-overlay" aria-hidden="true" />

      <div className="celebration-inner">
        <div ref={titleRef} className="celebration-heading">
          <p>Acompañanos a celebrar este día tan especial</p>
          <h2 id="celebration-title">Celebración</h2>
        </div>

        <div ref={ruleRef} className="celebration-rule-wrap">
          <HeartRule />
        </div>

        <div className="celebration-layout">
          <figure ref={venueRef} className="celebration-venue">
            <span className="celebration-venue-frame">
              <span className="celebration-venue-photo-wrap">
                <Image
                  src="/images/venues/hacienda_SH.webp"
                  alt="Hacienda Santa Elena"
                  fill
                  sizes="(max-width: 760px) 88vw, 26rem"
                  className="celebration-venue-photo"
                />
              </span>
            </span>
            <figcaption className="celebration-venue-caption">Hacienda Santa Elena</figcaption>
          </figure>

          <div ref={infoRef} className="celebration-info-card">
            <div className="celebration-meta-grid">
              <div className="celebration-meta">
                <CalendarDays aria-hidden="true" strokeWidth={1.5} />
                <span>Fecha</span>
                <strong>26 · SEP · 2026</strong>
              </div>
              <div className="celebration-meta">
                <Clock aria-hidden="true" strokeWidth={1.5} />
                <span>Hora</span>
                <strong>XX:XX P.M.</strong>
              </div>
            </div>

            <div className="celebration-place">
              <span>Lugar</span>
              <strong>Hacienda Santa Elena</strong>
              <em>Cota, Cundinamarca</em>
            </div>

            <div ref={actionsRef} className="celebration-location-card">
              <h3>¿Cómo llegar?</h3>
              <div className="celebration-location-actions">
                <a
                  className="celebration-map-button celebration-map-button--maps"
                  href="https://maps.app.goo.gl/yYX8tQsJdW1rckqX7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GoogleMapsIcon />
                  Mapa
                </a>
                <a
                  className="celebration-map-button celebration-map-button--waze"
                  href="https://waze.com/ul?q=Hacienda%20Santa%20Elena%20Cota&navigate=yes"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WazeIcon />
                  Waze
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
