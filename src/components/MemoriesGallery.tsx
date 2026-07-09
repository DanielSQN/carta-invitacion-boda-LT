"use client";

import { AnimatePresence, m } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, ChevronsRight, Hand, X } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { galleryBlur } from "@/lib/galleryBlur";
import { prefersReducedMotion } from "@/lib/sectionFx";

gsap.registerPlugin(ScrollTrigger);

type MemoryPhoto = {
  src: string;
  file: string;
  alt: string;
  year: string;
  width: number;
  height: number;
  orientation: "landscape" | "portrait" | "square";
  // Momento especial que se resalta en la galería (sello dorado + leyenda).
  highlight?: string;
};

// Orden cronológico: dentro de cada año va primero el archivo "fecha sola"
// (p. ej. 2026.webp) y después los numerados (2026-2.webp). El array ya está
// ordenado a mano; no se reordena en runtime.
const galleryPhotos: Array<Omit<MemoryPhoto, "src" | "alt">> = [
  { file: "2016-1.webp", year: "2016", width: 1600, height: 1200, orientation: "landscape" },
  { file: "2016-2.webp", year: "2016", width: 720, height: 720, orientation: "square" },
  { file: "2017-1.webp", year: "2017", width: 1280, height: 720, orientation: "landscape" },
  { file: "2017-2.webp", year: "2017", width: 960, height: 1280, orientation: "portrait" },
  { file: "2018-1.webp", year: "2018", width: 1280, height: 720, orientation: "landscape" },
  { file: "2018-2.webp", year: "2018", width: 1600, height: 1068, orientation: "landscape" },
  { file: "2019-1.webp", year: "2019", width: 1600, height: 1200, orientation: "landscape" },
  { file: "2019-2.webp", year: "2019", width: 1600, height: 1200, orientation: "landscape" },
  { file: "2020-1.webp", year: "2020", width: 1600, height: 1200, orientation: "landscape" },
  { file: "2020-2.webp", year: "2020", width: 960, height: 1280, orientation: "portrait" },
  { file: "2021-1.webp", year: "2021", width: 664, height: 1297, orientation: "portrait" },
  { file: "2021-2.webp", year: "2021", width: 664, height: 1297, orientation: "portrait" },
  { file: "2022-1.webp", year: "2022", width: 1200, height: 1600, orientation: "portrait" },
  { file: "2022-2.webp", year: "2022", width: 1200, height: 1600, orientation: "portrait" },
  { file: "2023-1.webp", year: "2023", width: 1200, height: 1600, orientation: "portrait" },
  { file: "2023-2.webp", year: "2023", width: 1200, height: 1600, orientation: "portrait" },
  { file: "2024-1.webp", year: "2024", width: 1280, height: 960, orientation: "landscape" },
  { file: "2024-2.webp", year: "2024", width: 1600, height: 1200, orientation: "landscape", highlight: "La propuesta" },
  { file: "2025-1.webp", year: "2025", width: 1600, height: 1200, orientation: "landscape" },
  { file: "2025-2.webp", year: "2025", width: 960, height: 1280, orientation: "portrait" },
  { file: "2026.webp", year: "2026", width: 1600, height: 1200, orientation: "landscape" },
  { file: "2026-2.webp", year: "2026", width: 439, height: 589, orientation: "portrait" },
] satisfies Array<Omit<MemoryPhoto, "src" | "alt"> & { file: string }>;

const memoryPhotos: MemoryPhoto[] = galleryPhotos
  .map((photo) => ({
    src: `/images/story/gallery/${photo.file}`,
    file: photo.file,
    alt: photo.highlight
      ? `Luisa y Jhonnatan, ${photo.highlight.toLowerCase()} (${photo.year})`
      : `Luisa y Jhonnatan, recuerdo de ${photo.year}`,
    year: photo.year,
    width: photo.width,
    height: photo.height,
    orientation: photo.orientation,
    highlight: photo.highlight,
  }));

const memoryYears = Array.from(new Set(memoryPhotos.map((photo) => photo.year)));

// Anillo de compromiso para el sello dorado de la foto de la propuesta.
function ProposalRingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
      <circle cx="12" cy="14.6" r="6.1" strokeWidth="1.7" />
      <path d="M9.2 5.4 12 2.7l2.8 2.7L12 8.4z" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function normalizeMemoryIndex(index: number) {
  return (index + memoryPhotos.length) % memoryPhotos.length;
}

// Cache de precargas ya disparadas: al ir y volver por el carril no se crean
// objetos Image ni peticiones repetidas para las mismas vecinas.
const preloadedMemories = new Set<number>();

function preloadMemoryNeighbors(index: number) {
  [index - 1, index + 1, index + 2].forEach((target) => {
    const normalized = normalizeMemoryIndex(target);

    if (preloadedMemories.has(normalized)) {
      return;
    }

    preloadedMemories.add(normalized);
    const image = new window.Image();
    image.decoding = "async";
    image.src = memoryPhotos[normalized].src;
  });
}

// Tarjeta memoizada: al cambiar la tarjeta activa durante el scroll solo se
// re-renderizan las 2 tarjetas afectadas, no las 22 con sus next/image.
type MemoryCardProps = {
  photo: MemoryPhoto;
  index: number;
  isActive: boolean;
  onOpen: (index: number) => void;
};

const MemoryCard = memo(function MemoryCard({ photo, index, isActive, onOpen }: MemoryCardProps) {
  return (
    <figure
      className={`memories-card is-${photo.orientation} ${isActive ? "is-active" : ""}${photo.highlight ? " is-highlight" : ""}`}
    >
      <button
        type="button"
        className="memories-card-trigger"
        onClick={() => onOpen(index)}
        aria-label={`Ampliar foto de ${photo.year}`}
      >
        <span className="memories-card-photo">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            loading={index < 3 ? "eager" : "lazy"}
            sizes="(max-width: 760px) 62vw, 18rem"
            quality={60}
            placeholder="blur"
            blurDataURL={galleryBlur[photo.file]}
            className="memories-photo"
          />
        </span>
      </button>
      {photo.highlight ? (
        <span className="memories-card-badge" aria-hidden="true">
          <ProposalRingIcon />
        </span>
      ) : null}
      <figcaption className="memories-card-caption">{photo.year}</figcaption>
    </figure>
  );
});

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
    // scroll exacto. El scroll real de la invitación vive en .details-scroll
    // (contenedor fijo con overflow interno) y fijar el body no lo detiene,
    // así que ese contenedor se bloquea aparte.
    const scroller = galleryRef.current?.closest<HTMLElement>(".details-scroll");
    const previousScrollerOverflowY = scroller?.style.overflowY ?? "";

    if (scroller) {
      scroller.style.overflowY = "hidden";
    }

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
      if (scroller) {
        scroller.style.overflowY = previousScrollerOverflowY;
      }

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
        <m.div
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
          <m.figure
            key={`memories-lightbox-card-${lightboxIndex}`}
            className={`memories-lightbox-card is-${memoryPhotos[lightboxIndex].orientation}`}
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
            <span className="memories-lightbox-photo">
              <Image
                src={memoryPhotos[lightboxIndex].src}
                alt={memoryPhotos[lightboxIndex].alt}
                fill
                sizes="92vw"
                placeholder="blur"
                blurDataURL={galleryBlur[memoryPhotos[lightboxIndex].file]}
                className="memories-lightbox-image"
              />
            </span>
            {/* Solo el año, en la franja inferior del polaroid */}
            <figcaption>
              <span className="memories-lightbox-year">
                <i aria-hidden="true" />
                {memoryPhotos[lightboxIndex].year}
                <i aria-hidden="true" />
              </span>
            </figcaption>
          </m.figure>

          <button type="button" className="memories-lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Cerrar foto">
            <X strokeWidth={2.2} />
          </button>

          <AnimatePresence>
            {showSwipeCue ? (
              <m.div
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
              </m.div>
            ) : null}
          </AnimatePresence>
        </m.div>
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
          <MemoryCard
            key={photo.src}
            photo={photo}
            index={index}
            isActive={index === activeIndex}
            onOpen={openLightbox}
          />
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
