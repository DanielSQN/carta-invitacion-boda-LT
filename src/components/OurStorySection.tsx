"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const storyItems = [
  { year: "2015", text: "Nos conocimos" },
  { year: "2016", text: "Inicio de esta aventura" },
  { year: "2024", text: "Dos almas, una promesa" },
  { year: "2026", text: "Para toda la vida" },
];

function StoryHeartIcon() {
  return (
    <svg className="story-heart-icon" viewBox="0 0 32 28" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M16 25C8.9 19.8 4.8 15.75 4.8 10.9C4.8 7.35 7.45 5 10.65 5C13.28 5 15.02 6.4 16 8.16C16.98 6.4 18.72 5 21.35 5C24.55 5 27.2 7.35 27.2 10.9C27.2 15.75 23.1 19.8 16 25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export default function OurStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scroller = sectionRef.current?.closest(".details-scroll") as HTMLElement | null;
    const triggerDefaults = scroller ? { scroller } : {};

    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, { scale: reduceMotion ? 1 : 1.04, yPercent: reduceMotion ? 0 : -3, force3D: true });

      if (reduceMotion) {
        gsap.set([titleRef.current, cardRef.current], { opacity: 1, y: 0 });
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
        .fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.82, ease: "power2.out" }, 0)
        .fromTo(cardRef.current, { opacity: 0, y: 38 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.18);

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

        <div ref={cardRef} className="story-card">
          <div className="story-timeline" aria-label="Linea de tiempo de nuestra historia">
            {storyItems.map((item) => (
              <div key={item.year} className="story-item">
                <span className="story-year">{item.year}</span>
                <span className="story-dot" aria-hidden="true" />
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <StoryHeartIcon />
        </div>
      </div>
    </section>
  );
}
