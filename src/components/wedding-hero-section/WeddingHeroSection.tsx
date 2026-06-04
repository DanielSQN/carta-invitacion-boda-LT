"use client";

import { motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { type FormEvent, type TouchEvent, useEffect, useRef, useState } from "react";
import CelebrationSection from "../CelebrationSection";
import CountdownSection from "../CountdownSection";
import SectionFrameDecor from "../SectionFrameDecor";
import DetailsSection from "../DetailsSection";
import DressCodeSection from "../DressCodeSection";
import OurStorySection from "../OurStorySection";

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
    const scroller = heroRef.current?.closest(".details-scroll") as HTMLElement | null;
    const triggerDefaults = scroller ? { scroller } : {};

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
        .to(cursorRef.current, { opacity: 0.18, duration: 0.72, repeat: -1, yoyo: true, ease: "sine.inOut" }, ">");

      gsap.to(imageRef.current, {
        yPercent: 5,
        scale: 1.03,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.75,
          invalidateOnRefresh: true,
          ...triggerDefaults,
        },
      });
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

const memoryPhotos = [
  {
    src: "/images/couple/_DSC0723.webp?v=20260601-assets-1",
    alt: "Luisa y Jhonnatan sonriendo juntos",
  },
  {
    src: "/images/couple/_DSC0953.webp",
    alt: "Recuerdo de Luisa y Jhonnatan",
  },
  {
    src: "/images/couple/_DSC1252.webp",
    alt: "Luisa y Jhonnatan en una foto especial",
  },
  {
    src: "/images/couple/couple-photo.webp?v=20260601-assets-2",
    alt: "Foto de la pareja",
  },
];

function useRevealSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        section.classList.toggle("is-visible", entry.isIntersecting);
      },
      {
        threshold: 0.22,
        rootMargin: "-10% 0px -10% 0px",
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return sectionRef;
}

function MemoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRevealSection();
  const touchStartXRef = useRef<number | null>(null);
  const currentPhoto = memoryPhotos[currentIndex];
  const previousPhoto = memoryPhotos[currentIndex === 0 ? memoryPhotos.length - 1 : currentIndex - 1];
  const nextPhoto = memoryPhotos[currentIndex === memoryPhotos.length - 1 ? 0 : currentIndex + 1];

  const goToPrevious = () => {
    setCurrentIndex((index) => (index === 0 ? memoryPhotos.length - 1 : index - 1));
  };

  const goToNext = () => {
    setCurrentIndex((index) => (index === memoryPhotos.length - 1 ? 0 : index + 1));
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    const endX = event.changedTouches[0]?.clientX;

    touchStartXRef.current = null;

    if (startX === null || endX === undefined) {
      return;
    }

    const deltaX = endX - startX;

    if (Math.abs(deltaX) < 42) {
      return;
    }

    if (deltaX > 0) {
      goToPrevious();
      return;
    }

    goToNext();
  };

  return (
    <section ref={sectionRef} className="memories-section finale-section" aria-labelledby="memories-title">
      <SectionFrameDecor variant="memories" />
      <div className="finale-section-bg" aria-hidden="true" />
      <div className="finale-inner">
        <div className="finale-heading finale-reveal">
          <span>Recuerdos</span>
          <h2 id="memories-title">Algunos recuerdos</h2>
          <p>Momentos que guardamos con amor y que nos trajeron hasta este dia.</p>
        </div>

        <div className="memories-carousel finale-reveal">
          <div className="memories-collage memories-touch-area" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            {[
              { photo: previousPhoto, className: "memories-print--left" },
              { photo: currentPhoto, className: "memories-print--center" },
              { photo: nextPhoto, className: "memories-print--right" },
            ].map(({ photo, className }) => (
              <figure key={`${photo.src}-${className}`} className={`memories-print ${className}`}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 760px) 46vw, 18rem"
                className="memories-photo"
              />
              </figure>
            ))}
          </div>

          <div className="memories-controls" aria-label="Controles del carrusel">
            <button type="button" onClick={goToPrevious} aria-label="Foto anterior">
              ‹
            </button>
            <div className="memories-dots" aria-hidden="true">
              {memoryPhotos.map((photo, index) => (
                <span key={photo.src} className={index === currentIndex ? "is-active" : ""} />
              ))}
            </div>
            <button type="button" onClick={goToNext} aria-label="Siguiente foto">
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AttendanceSection() {
  const [guestCount, setGuestCount] = useState(1);
  const [guestNames, setGuestNames] = useState([""]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const sectionRef = useRevealSection();

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
  };

  return (
    <section ref={sectionRef} className="attendance-section finale-section" aria-labelledby="attendance-title">
      <SectionFrameDecor variant="attendance" />
      <div className="finale-section-bg finale-section-bg--attendance" aria-hidden="true" />
      <div className="finale-inner attendance-inner">
        <div className="finale-heading finale-reveal">
          <span>RSVP</span>
          <h2 id="attendance-title">Confirmar tu asistencia</h2>
          <p>Ayudanos a preparar cada detalle con amor.</p>
        </div>

        <form className="attendance-form finale-reveal" onSubmit={handleSubmit}>
          <div className="attendance-quantity-field">
            <span>Cantidad de asistentes</span>
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
          </div>

          <div className="attendance-name-grid">
            {guestNames.map((name, index) => (
              <label key={index} className="attendance-field">
                <span>{guestCount === 1 ? "Nombre" : `Nombre ${index + 1}`}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => updateGuestName(index, event.target.value)}
                  placeholder="Nombre completo"
                  required
                />
              </label>
            ))}
          </div>

          <button className="attendance-submit" type="submit">
            Confirmar
          </button>

          {isConfirmed ? (
            <p className="attendance-confirmed" role="status">
              Gracias, tu confirmacion quedo registrada visualmente.
            </p>
          ) : null}
        </form>
      </div>

      <div className="attendance-footer-envelope" aria-hidden="true">
        <Image
          src="/images/ui/footer-envelope.webp"
          alt=""
          width={900}
          height={640}
          sizes="100vw"
        />
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
