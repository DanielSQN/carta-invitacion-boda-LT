"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import SectionFrameDecor from "./SectionFrameDecor";
import { createBgParallax, createSectionReveal, getSectionScroller, prefersReducedMotion } from "./sectionFx";

gsap.registerPlugin(ScrollTrigger);

const dressColors = ["#56799a", "#ffffff", "#071827", "#2c86c7", "#8ab7ce"];

export default function DressCodeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = getSectionScroller(sectionRef.current);

    const ctx = gsap.context(() => {
      createBgParallax(sectionRef.current, bgRef.current, { amplitude: 8, scale: 1.1 });
      createSectionReveal(sectionRef.current);

      const swatches = gsap.utils.toArray<HTMLElement>(".dress-swatch");

      if (prefersReducedMotion()) {
        gsap.set(swatches, { opacity: 1, scale: 1, y: 0 });
        gsap.set(".dress-polaroid", { y: 0, rotate: -2 });
        return;
      }

      // El polaroid se revela solo con transform (sin opacity): animar la
      // opacidad de un contenedor con backdrop-filter hace que el blur
      // "reviente" encima al llegar a 1.
      gsap.fromTo(
        ".dress-polaroid",
        { y: 46, rotate: -5.5 },
        {
          y: 0,
          rotate: -2,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none none",
            ...(scroller ? { scroller } : {}),
          },
        },
      );

      gsap.fromTo(
        swatches,
        { opacity: 0, scale: 0.55, y: 12 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.08,
          ease: "back.out(1.8)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 58%",
            toggleActions: "play none none none",
            ...(scroller ? { scroller } : {}),
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="dress-section" aria-labelledby="dress-title">
      <SectionFrameDecor variant="dress" />
      <div ref={bgRef} className="dress-bg" aria-hidden="true">
        <Image src="/images/details/background-dress-code.webp" alt="" fill sizes="100vw" quality={50} className="dress-bg-image" />
      </div>
      <div className="dress-overlay" aria-hidden="true" />

      <div className="dress-inner">
        <div className="dress-heading" data-reveal>
          <span className="section-kicker">Vestimenta</span>
          <h2 id="dress-title">Código de vestimenta</h2>
        </div>

        <div className="dress-column dress-column--attire">
          <figure className="dress-polaroid">
            <span className="dress-polaroid-frame">
              <span className="dress-polaroid-photo">
                <Image
                  src="/images/details/dress-code.webp"
                  alt="Ilustracion de traje y vestido formal"
                  fill
                  sizes="(max-width: 760px) 74vw, 22rem"
                  className="dress-image"
                />
              </span>
            </span>
            <figcaption className="dress-polaroid-caption">Formal</figcaption>
          </figure>
        </div>

        <div className="dress-column dress-column--reserved" data-reveal>
          <h3>Nos reservamos</h3>
          <div className="dress-palette" aria-label="Paleta de colores reservados">
            {dressColors.map((color) => (
              <span key={color} className="dress-swatch" style={{ backgroundColor: color }} />
            ))}
          </div>
          <p className="dress-reserved-note">
            Todo tipo de azul nos lo reservamos los novios <span aria-hidden="true">♥</span>
          </p>
        </div>
      </div>
    </section>
  );
}
