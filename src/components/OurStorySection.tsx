"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import SectionFrameDecor from "./SectionFrameDecor";

gsap.registerPlugin(ScrollTrigger);

const storyItems = [
  { year: "2015", text: "Nos conocimos", icon: "/images/story/001-heart.webp" },
  { year: "2018", text: "Inicio de esta aventura", icon: "/images/story/004-correo.webp" },
  { year: "2024", text: "Dos almas, una promesa", icon: "/images/story/002-wedding-rings.webp" },
  { year: "2026", text: "Para toda la vida", icon: "/images/story/003-heart-1.webp" },
];

export default function OurStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

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
            toggleActions: "play none none none",
            ...triggerDefaults,
          },
        })
        .fromTo(titleRef.current, { opacity: 0, y: -26 }, { opacity: 1, y: 0, duration: 0.82, ease: "power2.out" }, 0)
        .fromTo(".story-line-fill", { scaleY: 0 }, { scaleY: 1, duration: 1.6, ease: "power2.out" }, 0.18);

      gsap.utils.toArray<HTMLElement>(".story-item").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: -34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 86%",
              toggleActions: "play none none none",
              ...triggerDefaults,
            },
          },
        );
      });

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
      <SectionFrameDecor variant="story" />
      <div ref={imageRef} className="story-bg" aria-hidden="true">
        <Image src="/images/couple/_DSC0953.webp" alt="" fill sizes="100vw" className="story-bg-image" />
      </div>
      <div className="story-bg-overlay" aria-hidden="true" />

      <div className="story-inner">
        <div ref={titleRef} className="story-heading">
          <h2 id="story-title">Nuestra historia</h2>
          <p>Un camino escrito con tiempo, promesas y amor.</p>
        </div>

        <div className="story-timeline" aria-label="Linea de tiempo de nuestra historia">
          <span className="story-line" aria-hidden="true">
            <span className="story-line-fill" />
          </span>
          {storyItems.map((item) => (
            <div key={item.year} className="story-item">
              <div className="story-icon-wrap">
                <Image src={item.icon} alt="" width={42} height={42} className="story-icon-image" />
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
