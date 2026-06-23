"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { blurData } from "@/lib/blur";
import MemoriesGallery from "./MemoriesGallery";
import SectionFrameDecor from "./SectionFrameDecor";
import { createSectionReveal } from "./sectionFx";

gsap.registerPlugin(ScrollTrigger);

const storyItems = [
  { year: "2015", text: "Nos conocimos", icon: "/images/story/001-heart.webp" },
  { year: "2016", text: "Inicio de esta aventura", icon: "/images/story/004-correo.webp" },
  { year: "2024", text: "Dos almas, una promesa", icon: "/images/story/002-wedding-rings.webp" },
  { year: "2026", text: "Para toda la vida", icon: "/images/story/003-heart-1.webp" },
];

export default function OurStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // En desktop la linea es horizontal (se rellena en X); en mobile/tablet
    // es vertical (se rellena en Y).
    const isHorizontalTimeline = window.matchMedia("(min-width: 1024px)").matches;
    const scroller = sectionRef.current?.closest(".details-scroll") as HTMLElement | null;
    const triggerDefaults = scroller ? { scroller } : {};

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set([titleRef.current, ".story-item"], { opacity: 1, y: 0 });
        gsap.set(".story-line-fill", { scaleX: 1, scaleY: 1 });
        return;
      }

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.82,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 76%",
            toggleActions: "play none none none",
            ...triggerDefaults,
          },
        },
      );

      // La linea conectora se va llenando con el scroll (y se vacia al subir).
      gsap.fromTo(
        ".story-line-fill",
        isHorizontalTimeline ? { scaleX: 0 } : { scaleY: 0 },
        {
          ...(isHorizontalTimeline ? { scaleX: 1 } : { scaleY: 1 }),
          ease: "none",
          scrollTrigger: {
            trigger: ".story-timeline",
            start: "top 82%",
            end: "bottom 42%",
            scrub: 0.5,
            invalidateOnRefresh: true,
            ...triggerDefaults,
          },
        },
      );

      // Cada hito aparece uno a uno al bajar y se retira al subir
      // (play al entrar, reverse al salir, en ambas direcciones). En desktop
      // los 4 hitos comparten altura, asi que se escalonan de izquierda a
      // derecha (delay por indice) siguiendo el llenado de la linea.
      gsap.utils.toArray<HTMLElement>(".story-item").forEach((item, index) => {
        const icon = item.querySelector(".story-icon-wrap");
        const copy = item.querySelector(".story-copy");
        const itemTrigger = {
          // En desktop dispara con la seccion para que el escalonado se vea;
          // en mobile/tablet cada hito se dispara al entrar al viewport.
          trigger: isHorizontalTimeline ? ".story-timeline" : item,
          start: isHorizontalTimeline ? "top 78%" : "top 88%",
          toggleActions: "play reverse play reverse",
          ...triggerDefaults,
        };
        const delay = isHorizontalTimeline ? index * 0.13 : 0;

        gsap.fromTo(
          icon,
          { opacity: 0, scale: 0.35 },
          { opacity: 1, scale: 1, duration: 0.55, delay, ease: "back.out(2.2)", scrollTrigger: itemTrigger },
        );
        gsap.fromTo(
          copy,
          isHorizontalTimeline ? { opacity: 0, y: 24 } : { opacity: 0, x: -30 },
          {
            opacity: 1,
            ...(isHorizontalTimeline ? { y: 0 } : { x: 0 }),
            duration: 0.62,
            delay,
            ease: "power2.out",
            scrollTrigger: { ...itemTrigger },
          },
        );
      });

      // Revela los bloques [data-reveal] de la galeria de recuerdos integrada.
      createSectionReveal(sectionRef.current, { start: "top 60%" });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="story-section" aria-labelledby="story-title">
      <SectionFrameDecor variant="story" />
      <div ref={imageRef} className="story-bg" aria-hidden="true">
        <Image
          src="/images/couple/_DSC0953.webp"
          alt=""
          fill
          sizes="100vw"
          quality={50}
          placeholder="blur"
          blurDataURL={blurData["couple/_DSC0953"]}
          className="story-bg-image"
        />
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

        <MemoriesGallery />
      </div>
    </section>
  );
}
