"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const storyItems = [
  { year: "2015", text: "Nos conocimos", icon: "heart" },
  { year: "2018", text: "Inicio de esta aventura", icon: "travel" },
  { year: "2024", text: "Dos almas, una promesa", icon: "rings" },
  { year: "2026", text: "Para toda la vida", icon: "heartFilled" },
];

function StoryIcon({ type }: { type: string }) {
  if (type === "travel") {
    return (
      <svg className="story-icon" viewBox="0 0 38 38" fill="none" aria-hidden="true" focusable="false">
        <path d="M24.3 8.3L29.7 10.4L21.5 18.8L25.2 30.4L21.9 32.1L16.1 24.3L10.2 30.2L10.7 34L8.1 35.2L5.9 29.5L2.1 25.1L3.7 22.7L7.1 24L13.1 18L5.7 11.6L7.7 8.4L18.5 12.8L26.7 4.6C27.9 3.4 29.7 3.2 30.7 4.2C31.7 5.2 31.5 7.1 30.3 8.2L24.3 8.3Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45" />
        <path d="M14.2 29.4C17.8 31.9 22 32.5 26.2 31.1" stroke="currentColor" strokeDasharray="2.2 3.2" strokeLinecap="round" strokeWidth="1.25" />
      </svg>
    );
  }

  if (type === "rings") {
    return (
      <svg className="story-icon" viewBox="0 0 38 38" fill="none" aria-hidden="true" focusable="false">
        <circle cx="15" cy="22" r="8.2" stroke="currentColor" strokeWidth="1.45" />
        <circle cx="23" cy="22" r="8.2" stroke="currentColor" strokeWidth="1.45" />
        <path d="M19 8.2L15.8 12.4H22.2L19 8.2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.35" />
        <path d="M14.2 12.4H23.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.35" />
      </svg>
    );
  }

  return (
    <svg className="story-icon" viewBox="0 0 38 38" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M19 30.2C11.9 24.95 7.8 20.9 7.8 16.05C7.8 12.5 10.45 10.15 13.65 10.15C16.28 10.15 18.02 11.55 19 13.31C19.98 11.55 21.72 10.15 24.35 10.15C27.55 10.15 30.2 12.5 30.2 16.05C30.2 20.9 26.1 24.95 19 30.2Z"
        fill={type === "heartFilled" ? "currentColor" : "none"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
    </svg>
  );
}

export default function OurStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scroller = sectionRef.current?.closest(".details-scroll") as HTMLElement | null;
    const triggerDefaults = scroller ? { scroller } : {};

    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, { scale: reduceMotion ? 1 : 1.04, yPercent: reduceMotion ? 0 : -3, force3D: true });

      if (reduceMotion) {
        gsap.set([titleRef.current, ".story-item"], { opacity: 1, y: 0 });
        gsap.set(".story-line-fill", { scaleY: 1 });
        return;
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 76%",
            toggleActions: "play none none reverse",
            ...triggerDefaults,
          },
        })
        .fromTo(titleRef.current, { opacity: 0, y: -26 }, { opacity: 1, y: 0, duration: 0.82, ease: "power2.out" }, 0)
        .fromTo(".story-line-fill", { scaleY: 0 }, { scaleY: 1, duration: 1.3, ease: "power2.out" }, 0.2)
        .fromTo(
          ".story-item",
          { opacity: 0, y: -28 },
          { opacity: 1, y: 0, duration: 0.72, stagger: 0.22, ease: "power2.out" },
          0.24,
        );

      gsap.to(imageRef.current, {
        yPercent: 4,
        scale: 1.01,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="story-section" aria-labelledby="story-title">
      <div ref={imageRef} className="story-bg" aria-hidden="true">
        <Image src="/images/couple/_DSC0953.webp" alt="" fill sizes="100vw" className="story-bg-image" />
      </div>
      <div className="story-bg-overlay" aria-hidden="true" />

      <div className="story-inner">
        <div ref={titleRef} className="story-heading">
          <h2 id="story-title">Nuestra historia</h2>
          <p>Un camino escrito con tiempo, promesas y amor.</p>
        </div>

        <div ref={timelineRef} className="story-timeline" aria-label="Linea de tiempo de nuestra historia">
          <span className="story-line" aria-hidden="true">
            <span className="story-line-fill" />
          </span>
          {storyItems.map((item) => (
            <div key={item.year} className="story-item">
              <div className="story-icon-wrap">
                <StoryIcon type={item.icon} />
              </div>
              <div className="story-copy">
                <span className="story-year">{item.year}</span>
                <span className="story-flourish" aria-hidden="true" />
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
