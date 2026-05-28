"use client";

import Lenis from "@studio-freight/lenis";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Church, MessageCircle, Navigation, Wine } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import CelebrationSection from "../CelebrationSection";
import CountdownSection from "../CountdownSection";

gsap.registerPlugin(ScrollTrigger);

const assetVersion = "20260526-performance-1";

function EditorialRule({ className = "" }: { className?: string }) {
  return (
    <svg className={`hero-rule-svg ${className}`} viewBox="0 0 214 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 10H86" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M128 10H210" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path
        d="M107 14.8C101.8 11.1 98.8 8.1 99.7 5.3C100.5 2.9 103.8 2.5 107 6.2C110.2 2.5 113.5 2.9 114.3 5.3C115.2 8.1 112.2 11.1 107 14.8Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const luisaRef = useRef<HTMLSpanElement>(null);
  const ampRef = useRef<HTMLSpanElement>(null);
  const jhonnatanRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, { scale: reduceMotion ? 1 : 1.25, force3D: true });
      gsap.set(overlayRef.current, { opacity: reduceMotion ? 0.18 : 0 });
      gsap.set(glowRef.current, { opacity: reduceMotion ? 0.72 : 0 });
      gsap.set(fadeRef.current, { opacity: reduceMotion ? 1 : 0 });
      gsap.set(contentRef.current, { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 40 });

      if (luisaRef.current) luisaRef.current.textContent = reduceMotion ? "LUISA" : "";
      if (jhonnatanRef.current) jhonnatanRef.current.textContent = reduceMotion ? "JHONNATAN" : "";

      if (reduceMotion) {
        gsap.set([introRef.current, ampRef.current, dateRef.current], {
          opacity: 1,
          y: 0,
        });
        gsap.set(cursorRef.current, { opacity: 0 });
        return undefined;
      }

      const lenis = new Lenis({
        lerp: 0.075,
        wheelMultiplier: 0.85,
        smoothWheel: true,
      });

      const updateScrollTrigger = () => ScrollTrigger.update();
      lenis.on("scroll", updateScrollTrigger);

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);

      const heroLayers = [
        imageRef.current,
        overlayRef.current,
        contentRef.current,
        glowRef.current,
        fadeRef.current,
      ];

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
        animation: gsap
          .timeline()
          .fromTo(imageRef.current, { scale: 1.25 }, { scale: 1, ease: "none", force3D: true, immediateRender: false }, 0)
          .fromTo(overlayRef.current, { opacity: 0.28 }, { opacity: 0.14, ease: "none", immediateRender: false }, 0)
          .fromTo(fadeRef.current, { opacity: 0.92 }, { opacity: 0.52, ease: "none", immediateRender: false }, 0)
          .fromTo(glowRef.current, { opacity: 0.42 }, { opacity: 0.18, ease: "none", immediateRender: false }, 0),
        onEnter: () => gsap.set(heroLayers, { visibility: "visible" }),
        onEnterBack: () => gsap.set(heroLayers, { visibility: "visible" }),
      });

      gsap
        .timeline({ delay: 0.06 })
        .to(overlayRef.current, { opacity: 0.28, duration: 1.35, ease: "sine.out" }, 0.12)
        .to(glowRef.current, { opacity: 0.42, duration: 1.45, ease: "sine.out" }, 0.3)
        .to(fadeRef.current, { opacity: 0.92, duration: 1.65, ease: "sine.out" }, 0.44)
        .to(contentRef.current, { opacity: 1, y: 0, duration: 1.35, ease: "power3.out" }, 0.28);

      const typeText = (element: HTMLSpanElement | null, text: string, duration: number) => {
        if (!element) return gsap.timeline();

        const proxy = { count: 0 };
        return gsap.to(proxy, {
          count: text.length,
          duration,
          ease: "none",
          onStart: () => {
            element.textContent = "";
          },
          onUpdate: () => {
            element.textContent = text.slice(0, Math.round(proxy.count));
          },
          onComplete: () => {
            element.textContent = text;
          },
        });
      };

      gsap
        .timeline({ delay: 0.45 })
        .fromTo(introRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.72, ease: "power2.out" })
        .set(cursorRef.current, { opacity: 1 }, ">-0.08")
        .add(typeText(luisaRef.current, "LUISA", 0.82), ">")
        .fromTo(ampRef.current, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.48, ease: "power2.out" }, ">+0.16")
        .add(typeText(jhonnatanRef.current, "JHONNATAN", 1.15), ">+0.14")
        .fromTo(dateRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.78, ease: "power2.out" }, ">+0.18")
        .to(cursorRef.current, { opacity: 0.18, duration: 0.72, repeat: -1, yoyo: true, ease: "sine.inOut" }, ">");

      return () => {
        gsap.ticker.remove(tick);
        lenis.off("scroll", updateScrollTrigger);
        lenis.destroy();
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero" aria-labelledby="wedding-hero-title">
      <div className="hero-sticky">
        <div ref={imageRef} className="hero-image" aria-hidden="true" />
        <div ref={overlayRef} className="hero-overlay" aria-hidden="true" />
        <div ref={glowRef} className="hero-glow" aria-hidden="true" />
        <div ref={fadeRef} className="hero-fade" aria-hidden="true" />

        <div ref={contentRef} className="hero-content">
          <p ref={introRef} className="hero-kicker">
            <EditorialRule />
            <span>Nos Casamos</span>
            <EditorialRule className="hero-rule-svg--reverse" />
          </p>

          <h1 id="wedding-hero-title" className="hero-title" aria-label="Luisa y Jhonnatan">
            <span className="hero-name-slot hero-name-slot--luisa">
              <span ref={luisaRef} />
            </span>
            <span className="hero-title-middle">
              <EditorialRule className="hero-amp-rule" />
              <span ref={ampRef} className="hero-amp">
                &amp;
              </span>
              <EditorialRule className="hero-amp-rule hero-rule-svg--reverse" />
            </span>
            <span className="hero-name-slot hero-name-slot--jhonnatan">
              <span ref={jhonnatanRef} />
              <span ref={cursorRef} className="hero-type-cursor" aria-hidden="true" />
            </span>
          </h1>

          <p ref={dateRef} className="hero-date">
            26 <span>09</span> 2026
          </p>
        </div>
      </div>
    </section>
  );
}

function TearDivider({ variant }: { variant: "one" | "two" }) {
  return <div className={`tear-divider tear-divider--${variant}`} aria-hidden="true" />;
}

function BotanicalDecorations() {
  return (
    <>
      <Image
        src={`/images/florals/floral-top.webp?v=${assetVersion}`}
        alt=""
        width={360}
        height={240}
        className="flowers section-flower section-flower--top reveal-item"
        aria-hidden="true"
      />
      <Image
        src={`/images/florals/floral-bottom.webp?v=${assetVersion}`}
        alt=""
        width={320}
        height={260}
        className="flowers section-flower section-flower--bottom-left reveal-item"
        aria-hidden="true"
      />
      <Image
        src={`/images/florals/floral-bottom-right.webp?v=${assetVersion}`}
        alt=""
        width={280}
        height={220}
        className="flowers section-flower section-flower--bottom-right reveal-item"
        aria-hidden="true"
      />
    </>
  );
}

function ConfirmationSection() {
  return (
    <section className="paper-section paper-section--warm reveal-section" aria-labelledby="confirmation-section-title">
      <BotanicalDecorations />
      <div className="paper-section-frame" aria-hidden="true" />
      <div className="paper-section-content confirmation-content">
        <div className="reveal-item section-heart-knot" aria-hidden="true">
          <span />
          <span>♡</span>
          <span />
        </div>

        <h2 id="confirmation-section-title" className="reveal-item confirmation-title">
          <span>Confirma tu</span>
          <strong>Asistencia</strong>
        </h2>

        <div className="reveal-item section-heart-rule" aria-hidden="true">
          <span />
          <span>♡</span>
          <span />
        </div>

        <p className="reveal-item confirmation-copy">
          Tu presencia es muy importante para nosotros.
          <br />
          Por favor confirma tu asistencia antes del
          <br />
          <span>10 de agosto de 2026.</span>
        </p>

        <a
          className="reveal-item paper-action confirmation-action"
          href="https://wa.me/?text=Confirmo%20mi%20asistencia%20a%20la%20boda%20de%20Luisa%20y%20Tattan"
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle className="size-4" strokeWidth={1.8} />
          Confirmar asistencia
        </a>
      </div>
    </section>
  );
}

function LocationSection() {
  const eventCards = [
    {
      title: "Ceremonia",
      time: "3:00 P. M.",
      place: "El lugar de su presencia",
      city: "Bogota, Colombia",
      image: `/images/venues/ceremony-venue.webp?v=${assetVersion}`,
      icon: Church,
      mapQuery: "El lugar de su presencia Bogota",
    },
    {
      title: "Recepcion",
      time: "4:30 P. M.",
      place: "Celebracion",
      city: "Bogota, Colombia",
      image: `/images/venues/reception-venue.webp?v=${assetVersion}`,
      icon: Wine,
      mapQuery: "Bogota Colombia wedding reception venue",
    },
  ];

  return (
    <section className="paper-section paper-section--paper reveal-section" aria-labelledby="location-section-title">
      <BotanicalDecorations />
      <div className="paper-section-content location-content">
        <div className="reveal-item section-heart-knot" aria-hidden="true">
          <span />
          <span>♡</span>
          <span />
        </div>

        <h2 id="location-section-title" className="reveal-item location-title">
          Lugar del evento
        </h2>

        <div className="reveal-item section-heart-rule" aria-hidden="true">
          <span />
          <span>♡</span>
          <span />
        </div>

        <p className="reveal-item location-copy">Informacion de ceremonia y recepcion.</p>

        <div className="event-card-grid">
          {eventCards.map(({ title, time, place, city, image, icon: Icon, mapQuery }) => (
            <article key={title} className="reveal-item event-card">
              <div className="event-card-icon">
                <Icon className="size-8 text-soft-gold" strokeWidth={1.35} />
              </div>
              <h3>{title}</h3>
              <div className="event-card-rule" aria-hidden="true">
                <span />
                <span>♡</span>
                <span />
              </div>
              <p className="event-time">{time}</p>
              <p>{place}</p>
              <p>{city}</p>
              <div className="event-image-frame">
                <Image src={image} alt={`${title} de la boda`} fill sizes="(max-width: 430px) 86vw, 185px" />
              </div>
              <a
                className="paper-action paper-action--light event-card-action"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Navigation className="size-4" strokeWidth={1.8} />
                Ver ubicacion
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WeddingHeroSection() {
  useEffect(() => {
    const sections = document.querySelectorAll(".reveal-section");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        }
      },
      {
        threshold: 0.38,
        rootMargin: "-8% 0px -8% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      className="paper-stack relative z-[8] mx-auto w-full max-w-[430px] overflow-visible bg-[#f6ead7] text-olive shadow-[0_0_45px_rgba(77,58,35,0.16)]"
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="wedding-hero-title"
    >
      <HeroSection />
      <CountdownSection />
      <CelebrationSection />
      <TearDivider variant="one" />
      <ConfirmationSection />
      <TearDivider variant="two" />
      <LocationSection />
    </motion.section>
  );
}
