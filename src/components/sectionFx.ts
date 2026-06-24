"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isLowEndDevice } from "@/lib/device";

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getSectionScroller(section: HTMLElement | null) {
  return (section?.closest(".details-scroll") as HTMLElement | null) ?? undefined;
}

function scrollerDefaults(section: HTMLElement) {
  const scroller = getSectionScroller(section);
  return scroller ? { scroller } : {};
}

type ParallaxOptions = {
  amplitude?: number;
  scale?: number;
};

/**
 * Parallax unificado para los fondos de seccion: el fondo se desplaza mas
 * lento que el scroll, dando la sensacion de imagen casi fija.
 */
export function createBgParallax(
  section: HTMLElement | null,
  bg: HTMLElement | null,
  { amplitude = 10, scale = 1.08 }: ParallaxOptions = {},
) {
  if (!section || !bg) {
    return;
  }

  // En gama baja (o con "reducir movimiento") el fondo queda estático: el
  // parallax con scrub es de lo que más cuesta durante el scroll en GPUs viejas.
  if (prefersReducedMotion() || isLowEndDevice()) {
    gsap.set(bg, { yPercent: 0, scale: 1 });
    return;
  }

  gsap.set(bg, { scale, transformOrigin: "50% 50%", force3D: true });
  gsap.fromTo(
    bg,
    { yPercent: -amplitude },
    {
      yPercent: amplitude,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.7,
        invalidateOnRefresh: true,
        ...scrollerDefaults(section),
      },
    },
  );
}

type RevealOptions = {
  start?: string;
  stagger?: number;
  y?: number;
};

/**
 * Revelado unificado: anima los hijos marcados con [data-reveal] cuando la
 * seccion entra al viewport.
 */
export function createSectionReveal(
  section: HTMLElement | null,
  { start = "top 74%", stagger = 0.14, y = 34 }: RevealOptions = {},
) {
  if (!section) {
    return;
  }

  const targets = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-reveal]"));

  if (!targets.length) {
    return;
  }

  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration: 0.92,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start,
        toggleActions: "play none none none",
        ...scrollerDefaults(section),
      },
    },
  );
}
