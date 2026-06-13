"use client";

import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ChevronLeft, ChevronRight, ChevronsRight, Heart, User, X } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CelebrationSection from "../CelebrationSection";
import CountdownSection from "../CountdownSection";
import SectionFrameDecor from "../SectionFrameDecor";
import DetailsSection from "../DetailsSection";
import DressCodeSection from "../DressCodeSection";
import OurStorySection from "../OurStorySection";
import { createSectionReveal, getSectionScroller, prefersReducedMotion } from "../sectionFx";

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
      gsap.set(imageRef.current, { scale: 1, force3D: true });
      gsap.set(overlayRef.current, { opacity: reduceMotion ? 0.28 : 0 });
      gsap.set(glowRef.current, { opacity: reduceMotion ? 0.42 : 0 });
      gsap.set(fadeRef.current, { opacity: reduceMotion ? 0.92 : 0 });
      gsap.set(contentRef.current, { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 40 });

      if (luisaRef.current) luisaRef.current.textContent = reduceMotion ? "Luisa" : "";
      if (jhonnatanRef.current) jhonnatanRef.current.textContent = reduceMotion ? "Jhonnatan" : "";

      if (reduceMotion) {
        gsap.set([introRef.current, ampRef.current, dateRef.current], {
          opacity: 1,
          y: 0,
        });
        gsap.set(cursorRef.current, { opacity: 0 });
        window.setTimeout(() => window.dispatchEvent(new Event("hero-intro-complete")), 350);
        return undefined;
      }

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
        .add(typeText(luisaRef.current, "Luisa", 0.82), ">")
        .fromTo(ampRef.current, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.48, ease: "power2.out" }, ">+0.16")
        .add(typeText(jhonnatanRef.current, "Jhonnatan", 1.15), ">+0.14")
        .fromTo(dateRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.78, ease: "power2.out" }, ">+0.18")
        .call(() => window.dispatchEvent(new Event("hero-intro-complete")), [], ">+0.05")
        .to(cursorRef.current, { opacity: 0.18, duration: 0.72, repeat: -1, yoyo: true, ease: "sine.inOut" }, ">");

      // Zoom-in al hacer scroll. Arranca en scale 1 para que la foto del hero
      // coincida 1:1 con la foto de la transicion del sobre.
      const scroller = getSectionScroller(heroRef.current);
      gsap.fromTo(
        imageRef.current,
        { scale: 1, yPercent: 0, transformOrigin: "50% 30%" },
        {
          scale: 1.16,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
            ...(scroller ? { scroller } : {}),
          },
        },
      );
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
            26 <span>SEP</span> 2026
          </p>
        </div>
      </div>
    </section>
  );
}

// RECUERDOS (28 fotos, 2016-2026).
// Estructura de simulacion: cada año tiene su cantidad real de fotos, pero
// las imagenes son placeholders (se reciclan las 4 fotos existentes).
// Para poner las definitivas: sube los webp optimizados a
// public/images/memories/ y reemplaza src/alt/caption de cada entrada.
const memoryPlaceholderSources = [
  { src: "/images/couple/couple-photo.webp?v=20260601-assets-2", alt: "Recuerdo de Luisa y Jhonnatan" },
  { src: "/images/couple/_DSC0723.webp?v=20260601-assets-1", alt: "Luisa y Jhonnatan sonriendo juntos" },
  { src: "/images/couple/_DSC0953.webp", alt: "Recuerdo de Luisa y Jhonnatan" },
  { src: "/images/couple/_DSC1252.webp", alt: "Luisa y Jhonnatan en una foto especial" },
];

// [año, cantidad de fotos de ese año] — total: 28
const memoryYearCounts: Array<[string, number]> = [
  ["2016", 2],
  ["2017", 2],
  ["2018", 2],
  ["2019", 2],
  ["2020", 3],
  ["2021", 2],
  ["2022", 3],
  ["2023", 3],
  ["2024", 4],
  ["2025", 3],
  ["2026", 2],
];

// Leyendas amorosas para el marco de cada foto (el año va solo en el badge).
const memoryCaptions = [
  "Donde todo comenzó",
  "Cómplices para siempre",
  "Entre risas y miradas",
  "Caminando de tu mano",
  "Nuestro lugar favorito: juntos",
  "Amor en cada detalle",
  "El mejor equipo",
  "Sueños compartidos",
  "Cada día te elijo",
  "Pedacitos de felicidad",
  "Tu risa es mi hogar",
  "Aventura de dos",
  "Un sí para toda la vida",
  "Momentos que atesoramos",
];

let memoryPhotoCursor = 0;
const memoryPhotos = memoryYearCounts.flatMap(([year, count]) =>
  Array.from({ length: count }, () => {
    const source = memoryPlaceholderSources[memoryPhotoCursor % memoryPlaceholderSources.length];
    const caption = memoryCaptions[memoryPhotoCursor % memoryCaptions.length];
    memoryPhotoCursor += 1;

    return { ...source, year, caption };
  }),
);

const memoryYears = Array.from(new Set(memoryPhotos.map((photo) => photo.year)));

function MemoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIndex === null) {
      return;
    }

    const scroller = sectionRef.current?.closest(".details-scroll") as HTMLElement | null;
    scroller?.classList.add("is-scroll-locked");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      } else if (event.key === "ArrowRight") {
        setLightboxIndex((index) => (index === null ? index : (index + 1) % memoryPhotos.length));
      } else if (event.key === "ArrowLeft") {
        setLightboxIndex((index) =>
          index === null ? index : (index + memoryPhotos.length - 1) % memoryPhotos.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      scroller?.classList.remove("is-scroll-locked");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex]);

  useEffect(() => {
    const scroller = getSectionScroller(sectionRef.current);
    const strip = stripRef.current;
    let removeNudgeListeners: (() => void) | undefined;

    const ctx = gsap.context(() => {
      createSectionReveal(sectionRef.current);

      if (prefersReducedMotion()) {
        return;
      }

      // Vaiven sutil del strip para invitar a deslizar; se detiene
      // definitivamente al primer gesto del usuario.
      if (strip) {
        const nudge = gsap.to(strip, {
          x: -16,
          duration: 0.95,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 62%",
            toggleActions: "play none none none",
            ...(scroller ? { scroller } : {}),
          },
        });

        const stopNudge = () => {
          removeNudgeListeners?.();
          removeNudgeListeners = undefined;
          nudge.scrollTrigger?.kill();
          nudge.kill();
          gsap.to(strip, { x: 0, duration: 0.45, ease: "sine.out" });
        };

        strip.addEventListener("scroll", stopNudge, { passive: true });
        strip.addEventListener("pointerdown", stopNudge, { passive: true });
        removeNudgeListeners = () => {
          strip.removeEventListener("scroll", stopNudge);
          strip.removeEventListener("pointerdown", stopNudge);
        };
      }
    }, sectionRef);

    return () => {
      removeNudgeListeners?.();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const strip = stripRef.current;

    if (!strip) {
      return;
    }

    let frame = 0;

    const updateActiveIndex = () => {
      frame = 0;
      const center = strip.scrollLeft + strip.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      Array.from(strip.children).forEach((child, index) => {
        const card = child as HTMLElement;
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    const handleScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateActiveIndex);
      }
    };

    strip.addEventListener("scroll", handleScroll, { passive: true });
    updateActiveIndex();

    return () => {
      strip.removeEventListener("scroll", handleScroll);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const scrollToIndex = (index: number) => {
    const strip = stripRef.current;
    const targetIndex = (index + memoryPhotos.length) % memoryPhotos.length;
    const card = strip?.children[targetIndex] as HTMLElement | undefined;

    if (!strip || !card) {
      return;
    }

    strip.scrollTo({
      left: card.offsetLeft - (strip.clientWidth - card.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const activeYear = memoryPhotos[activeIndex]?.year;

  // El lightbox se monta en <body> via portal: si quedara dentro de la
  // seccion, las secciones siguientes lo taparian al hacer scroll.
  const lightbox = (
    <AnimatePresence>
      {lightboxIndex !== null ? (
        <motion.div
          key="memories-lightbox"
          className="memories-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          onClick={() => setLightboxIndex(null)}
        >
          <motion.figure
            className="memories-lightbox-card"
            initial={{ scale: 0.88, y: 22 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 12 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <span className="memories-lightbox-year">
              <i aria-hidden="true" />
              {memoryPhotos[lightboxIndex].year}
              <i aria-hidden="true" />
            </span>
            <span className="memories-lightbox-photo">
              <Image
                src={memoryPhotos[lightboxIndex].src}
                alt={memoryPhotos[lightboxIndex].alt}
                fill
                sizes="92vw"
                className="memories-lightbox-image"
              />
            </span>
            <figcaption>
              <strong>{memoryPhotos[lightboxIndex].caption}</strong>
            </figcaption>
          </motion.figure>

          <button
            type="button"
            className="memories-lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Cerrar foto"
          >
            <X strokeWidth={2.2} />
          </button>
          <button
            type="button"
            className="memories-lightbox-nav memories-lightbox-nav--prev"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex((index) => (index === null ? index : (index + memoryPhotos.length - 1) % memoryPhotos.length));
            }}
            aria-label="Foto anterior"
          >
            <ChevronLeft strokeWidth={2.2} />
          </button>
          <button
            type="button"
            className="memories-lightbox-nav memories-lightbox-nav--next"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex((index) => (index === null ? index : (index + 1) % memoryPhotos.length));
            }}
            aria-label="Siguiente foto"
          >
            <ChevronRight strokeWidth={2.2} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <section ref={sectionRef} className="memories-section finale-section" aria-labelledby="memories-title">
      <SectionFrameDecor variant="memories" />
      <div className="finale-section-bg" aria-hidden="true" />
      <div className="finale-inner">
        <div className="finale-heading" data-reveal>
          <span>Recuerdos</span>
          <h2 id="memories-title">Algunos recuerdos</h2>
          <p>Momentos que guardamos con amor y que nos trajeron hasta este dia.</p>
        </div>

        <div className="memories-gallery" data-reveal>
          {/* Banner indicativo del año activo (no interactivo) */}
          <div className="memories-years" aria-hidden="true">
            {memoryYears.map((year) => (
              <span key={year} className={year === activeYear ? "is-active" : ""}>
                {year}
              </span>
            ))}
          </div>

          <div ref={stripRef} className="memories-strip" aria-label="Galeria de recuerdos">
            {memoryPhotos.map((photo, index) => (
              <figure key={`${photo.year}-${index}`} className={`memories-card ${index === activeIndex ? "is-active" : ""}`}>
                <button
                  type="button"
                  className="memories-card-trigger"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Ampliar foto: ${photo.caption} (${photo.year})`}
                >
                  <span className="memories-card-photo">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      loading={index < 3 ? "eager" : "lazy"}
                      sizes="(max-width: 760px) 62vw, 17rem"
                      className="memories-photo"
                    />
                  </span>
                  <span className="memories-card-year" aria-hidden="true">
                    {photo.year}
                  </span>
                </button>
                <figcaption className="memories-card-caption">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>

          <div className="memories-controls" aria-label="Controles de la galeria">
            <button
              type="button"
              className="memories-arrow"
              onClick={() => scrollToIndex(activeIndex - 1)}
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <p className="memories-counter" aria-live="polite">
              {activeIndex + 1} / {memoryPhotos.length}
            </p>
            <button
              type="button"
              className="memories-arrow"
              onClick={() => scrollToIndex(activeIndex + 1)}
              aria-label="Siguiente foto"
            >
              ›
            </button>
          </div>

          <p className="memories-swipe-hint" aria-hidden="true">
            <span>Desliza para ver más fotos y toca una para ampliarla</span>
            <ChevronsRight strokeWidth={2} />
          </p>
        </div>
      </div>

      {typeof document !== "undefined" ? createPortal(lightbox, document.body) : null}
    </section>
  );
}

function AttendanceSection() {
  const [guestCount, setGuestCount] = useState(1);
  const [guestNames, setGuestNames] = useState([""]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const confirmInnerRef = useRef<HTMLDivElement>(null);
  const footerEnvelopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = getSectionScroller(sectionRef.current);

    const ctx = gsap.context(() => {
      createSectionReveal(sectionRef.current);

      if (prefersReducedMotion()) {
        return;
      }

      gsap.fromTo(
        footerEnvelopeRef.current,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerEnvelopeRef.current,
            start: "top 96%",
            toggleActions: "play none none none",
            ...(scroller ? { scroller } : {}),
          },
        },
      );

      // La seccion de confirmacion se encoge hacia el sobre al hacer scroll,
      // como si la carta se metiera dentro del sobre del footer. Arranca solo
      // cuando el formulario completo ya se vio (su borde inferior queda a un
      // pequeño margen del fondo). transform-origin bottom fija ese borde, asi
      // que el trigger sobre el propio elemento es estable durante el scrub.
      gsap.to(confirmInnerRef.current, {
        scale: 0.66,
        y: 22,
        autoAlpha: 0.28,
        ease: "none",
        transformOrigin: "bottom center",
        scrollTrigger: {
          trigger: confirmInnerRef.current,
          start: "bottom bottom-=48",
          end: "+=260",
          scrub: 0.6,
          ...(scroller ? { scroller } : {}),
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Al cambiar la cantidad de invitados (o confirmar) el formulario cambia de
  // alto: hay que recalcular las posiciones de ScrollTrigger para que el
  // encogimiento siga arrancando recien cuando se ve todo el formulario.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, [guestCount, isConfirmed]);

  const updateGuestCount = (value: number) => {
    const nextValue = Math.min(Math.max(value, 1), 6);
    setGuestCount(nextValue);
    setGuestNames((names) =>
      Array.from({ length: nextValue }, (_, index) => names[index] ?? ""),
    );
    setIsConfirmed(false);
  };

  const updateGuestName = (index: number, value: string) => {
    setGuestNames((names) => names.map((name, nameIndex) => (nameIndex === index ? value : name)));
    setIsConfirmed(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsConfirmed(true);

    window.requestAnimationFrame(() => {
      sectionRef.current?.querySelector(".attendance-confirmed")?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center",
      });
    });
  };

  return (
    <section ref={sectionRef} className="attendance-section finale-section" aria-labelledby="attendance-title">
      <SectionFrameDecor variant="attendance" />
      <div className="finale-section-bg finale-section-bg--attendance" aria-hidden="true" />
      <div ref={confirmInnerRef} className="finale-inner attendance-inner">
        <div className="finale-heading" data-reveal>
          <span>RSVP</span>
          <h2 id="attendance-title">Confirmar tu asistencia</h2>
          <p>Ayudanos a preparar cada detalle con amor.</p>
        </div>

        <form className="attendance-form" data-reveal onSubmit={handleSubmit}>
          <p className="attendance-hint">
            Completa estos dos pasos y presiona <strong>Confirmar asistencia</strong>.
          </p>

          <div className="attendance-step">
            <div className="attendance-step-head">
              <span className="attendance-step-number" aria-hidden="true">
                1
              </span>
              <span className="attendance-step-title">¿Cuántas personas asisten?</span>
            </div>

            <div className="attendance-stepper" role="group" aria-label="Cantidad de asistentes">
              <button
                type="button"
                onClick={() => updateGuestCount(guestCount - 1)}
                disabled={guestCount <= 1}
                aria-label="Disminuir cantidad de asistentes"
              >
                −
              </button>
              <output aria-live="polite" aria-label={`${guestCount} asistentes`}>
                {guestCount}
                <small>{guestCount === 1 ? "persona" : "personas"}</small>
              </output>
              <button
                type="button"
                onClick={() => updateGuestCount(guestCount + 1)}
                disabled={guestCount >= 6}
                aria-label="Aumentar cantidad de asistentes"
              >
                +
              </button>
            </div>

            <p className="attendance-step-note">Incluyete a ti y a tus acompañantes (máximo 6).</p>
          </div>

          <div className="attendance-step">
            <div className="attendance-step-head">
              <span className="attendance-step-number" aria-hidden="true">
                2
              </span>
              <span className="attendance-step-title">¿Quiénes asisten?</span>
            </div>

            <div className="attendance-name-grid">
              {guestNames.map((name, index) => (
                <label key={index} className="attendance-field">
                  <span>{guestCount === 1 ? "Tu nombre" : index === 0 ? "Tu nombre" : `Acompañante ${index}`}</span>
                  <span className="attendance-input-wrap">
                    <User aria-hidden="true" strokeWidth={2} />
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => updateGuestName(index, event.target.value)}
                      placeholder="Nombre completo"
                      required
                    />
                  </span>
                </label>
              ))}
            </div>
          </div>

          {isConfirmed ? (
            <div className="attendance-confirmed" role="status">
              <span className="attendance-confirmed-icon" aria-hidden="true">
                <Check strokeWidth={2.6} />
              </span>
              <p>¡Gracias por confirmar{guestCount > 1 ? ` por ${guestCount} personas` : ""}!</p>
              <span>Nos vemos el 26 de septiembre de 2026 ♥</span>
            </div>
          ) : (
            <button className="attendance-submit" type="submit">
              <Heart aria-hidden="true" strokeWidth={2.2} />
              Confirmar asistencia
            </button>
          )}
        </form>
      </div>

      <div ref={footerEnvelopeRef} className="footer-letter">
        <div className="footer-envelope">
          <blockquote className="footer-letter-note">
            <cite className="footer-letter-ref">1 Tesalonicenses 3:12 · NVI</cite>
            <p className="footer-letter-verse">
              &ldquo;Que el Se&ntilde;or los haga crecer para que se amen m&aacute;s y m&aacute;s unos a otros, y a todos, tal como
              nosotros los amamos a ustedes.&rdquo;
            </p>
            <p className="footer-letter-sign">
              Con amor <span className="footer-letter-heart" aria-hidden="true">♥</span>
              <span className="footer-letter-names">Luisa &amp; Jhonnatan</span>
            </p>
          </blockquote>

          <div className="footer-envelope-front" aria-hidden="true">
            <span className="footer-envelope-seal">
              <Image src="/images/ui/wax-seal.webp?v=20260601-assets-1" alt="" fill sizes="96px" className="object-contain" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WeddingHeroSection() {
  return (
    <motion.div
      className="paper-stack relative z-[8] mx-auto w-full bg-[#07111f] text-olive"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="wedding-hero-title"
    >
      <HeroSection />
      <CountdownSection />
      <CelebrationSection />
      <OurStorySection />
      <DressCodeSection />
      <DetailsSection />
      <MemoriesSection />
      <AttendanceSection />
    </motion.div>
  );
}
