"use client";

import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, ChevronsRight, Hand, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { prefersReducedMotion } from "./sectionFx";

gsap.registerPlugin(ScrollTrigger);

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

function normalizeMemoryIndex(index: number) {
  return (index + memoryPhotos.length) % memoryPhotos.length;
}

function preloadMemoryNeighbors(index: number) {
  [index - 1, index + 1, index + 2].forEach((target) => {
    const photo = memoryPhotos[normalizeMemoryIndex(target)];
    const image = new window.Image();
    image.decoding = "async";
    image.src = photo.src;
  });
}

export default function MemoriesGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // Pista de "desliza" al abrir el detalle; se oculta al primer gesto o sola.
  const [showSwipeCue, setShowSwipeCue] = useState(false);

  const showPreviousLightboxPhoto = useCallback(() => {
    setShowSwipeCue(false);
    setLightboxIndex((index) => (index === null ? index : normalizeMemoryIndex(index - 1)));
  }, []);

  const showNextLightboxPhoto = useCallback(() => {
    setShowSwipeCue(false);
    setLightboxIndex((index) => (index === null ? index : normalizeMemoryIndex(index + 1)));
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setShowSwipeCue(true);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) {
      return;
    }

    // Bloqueo del scroll NATIVO del documento mientras el lightbox esta abierto.
    // Tecnica iOS-safe: se fija el body en su posicion actual (position:fixed +
    // top negativo) para que el fondo no se mueva y al cerrar se restaura el
    // scroll exacto. No se toca ningun contenedor interno (ya no existe).
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    html.classList.add("is-lightbox-open");
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      } else if (event.key === "ArrowRight") {
        showNextLightboxPhoto();
      } else if (event.key === "ArrowLeft") {
        showPreviousLightboxPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      html.classList.remove("is-lightbox-open");
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, showNextLightboxPhoto, showPreviousLightboxPhoto]);

  useEffect(() => {
    if (!showSwipeCue) {
      return;
    }

    const timer = window.setTimeout(() => setShowSwipeCue(false), 3400);
    return () => window.clearTimeout(timer);
  }, [showSwipeCue]);

  useEffect(() => {
    preloadMemoryNeighbors(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      preloadMemoryNeighbors(lightboxIndex);
    }
  }, [lightboxIndex]);

  useEffect(() => {
    const scroller = galleryRef.current?.closest(".details-scroll") as HTMLElement | null;
    const strip = stripRef.current;
    let removeNudgeListeners: (() => void) | undefined;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion() || !strip) {
        return;
      }

      // Vaiven sutil del strip para invitar a deslizar; se detiene
      // definitivamente al primer gesto del usuario.
      const nudge = gsap.to(strip, {
        x: -16,
        duration: 0.95,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 70%",
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
    }, galleryRef);

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
    const targetIndex = normalizeMemoryIndex(index);
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

  // El lightbox se monta en <body> via portal para que ocupe todo el alto.
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
            key={`memories-lightbox-card-${lightboxIndex}`}
            className="memories-lightbox-card"
            initial={{ scale: 0.88, y: 22 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 12 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragStart={() => setShowSwipeCue(false)}
            onDragEnd={(_, info) => {
              const swipeDistance = 58;
              const swipeVelocity = 450;

              if (info.offset.x <= -swipeDistance || info.velocity.x <= -swipeVelocity) {
                showNextLightboxPhoto();
              } else if (info.offset.x >= swipeDistance || info.velocity.x >= swipeVelocity) {
                showPreviousLightboxPhoto();
              }
            }}
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

          <button type="button" className="memories-lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Cerrar foto">
            <X strokeWidth={2.2} />
          </button>

          <AnimatePresence>
            {showSwipeCue ? (
              <motion.div
                key="memories-lightbox-cue"
                className="memories-lightbox-cue"
                aria-hidden="true"
                initial={{ opacity: 0, x: "-50%", y: 12 }}
                animate={{ opacity: 1, x: "-50%", y: 0 }}
                exit={{ opacity: 0, x: "-50%", y: 8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <span className="memories-lightbox-cue-track">
                  <ChevronLeft className="memories-cue-arrow" strokeWidth={2.4} aria-hidden="true" />
                  <span className="memories-cue-runner">
                    <Hand strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  <ChevronRight className="memories-cue-arrow" strokeWidth={2.4} aria-hidden="true" />
                </span>
                <span className="memories-lightbox-cue-text">Desliza para cambiar de foto</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <div ref={galleryRef} className="memories-gallery" data-reveal>
      <div className="memories-subheading">
        <span className="section-kicker">Algunos recuerdos</span>
        <p>Momentos que guardamos con amor y que nos trajeron hasta este día.</p>
      </div>

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
              onClick={() => openLightbox(index)}
              aria-label={`Ampliar foto: ${photo.caption} (${photo.year})`}
            >
              <span className="memories-card-photo">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading={index < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 760px) 62vw, 18rem"
                  quality={60}
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
        <button type="button" className="memories-arrow" onClick={() => scrollToIndex(activeIndex - 1)} aria-label="Foto anterior">
          ‹
        </button>
        <p className="memories-counter" aria-live="polite">
          {activeIndex + 1} / {memoryPhotos.length}
        </p>
        <button type="button" className="memories-arrow" onClick={() => scrollToIndex(activeIndex + 1)} aria-label="Siguiente foto">
          ›
        </button>
      </div>

      <p className="memories-swipe-hint" aria-hidden="true">
        <span>Desliza para ver más fotos y toca una para ampliarla</span>
        <ChevronsRight strokeWidth={2} />
      </p>

      {typeof document !== "undefined" ? createPortal(lightbox, document.body) : null}
    </div>
  );
}
