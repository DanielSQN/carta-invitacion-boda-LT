"use client";

import { AnimatePresence, domMax, LazyMotion, m } from "framer-motion";
import gsap from "gsap";
import { Music, VolumeX } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { isLowEndDevice } from "@/lib/device";
import SectionNav from "../SectionNav";
import DecorativeText from "./DecorativeText";
import Envelope from "./Envelope";
import FloralCorners from "./FloralCorners";
import Verse from "./Verse";

const WeddingHeroSection = dynamic(() => import("../wedding-hero-section/WeddingHeroSection"), {
  ssr: false,
});

// Solo se precargan los assets consumidos por URL directa (fondos CSS).
// El resto de imagenes pasa por next/image, que sirve URLs optimizadas
// distintas: precargar el archivo original lo descargaria dos veces.
const preloadedInvitationAssets = [
  // El hero usa AVIF vía image-set (con respaldo WebP); se precarga el AVIF, que
  // es lo que descargan los navegadores modernos (evita malgastar el WebP).
  "/images/couple/couple-photo.avif?v=20260616",
  "/images/paper/paper-texture.webp?v=20260525-wedding-home",
  "/images/paper/paper-texture-old.webp",
];

function MusicToggleIcon({ isPlaying }: { isPlaying: boolean }) {
  return isPlaying ? (
    <Music className="music-toggle-svg music-toggle-svg--music" strokeWidth={2} aria-hidden="true" />
  ) : (
    <VolumeX className="music-toggle-svg music-toggle-svg--muted" strokeWidth={2} aria-hidden="true" />
  );
}

function SwipeDownIcon() {
  return (
    <svg className="fixed-swipe-down-svg" viewBox="0 0 42 62" fill="none" aria-hidden="true" focusable="false">
      <path d="M21 5V48" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <path d="M12.5 39.5L21 48L29.5 39.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 5H28.5" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" opacity="0.42" />
    </svg>
  );
}

function SwipeDownPrompt() {
  return (
    <div className="fixed-swipe-down-content">
      <span className="fixed-swipe-rule" aria-hidden="true">
        <i />
        <b>♥</b>
        <i />
      </span>
      <span>Desliza para continuar</span>
      <SwipeDownIcon />
    </div>
  );
}

function normalizeGuestName(value: string) {
  let normalized = value;

  for (let index = 0; index < 2; index += 1) {
    try {
      normalized = decodeURIComponent(normalized);
    } catch {
      break;
    }
  }

  return normalized
    .replace(/\+/g, " ")
    .replace(/%20/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type WeddingHomeProps = {
  initialGuestName: string;
};

export default function WeddingHome({ initialGuestName }: WeddingHomeProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showWeddingHero, setShowWeddingHero] = useState(false);
  const [isHeroTransitioning, setIsHeroTransitioning] = useState(false);
  const [isHeroIntroDone, setIsHeroIntroDone] = useState(false);
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(false);
  const [guestName, setGuestName] = useState(initialGuestName);
  const [hasMusicStarted, setHasMusicStarted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const homeSceneRef = useRef<HTMLElement>(null);
  const envelopeLetterRef = useRef<HTMLDivElement>(null);
  const transitionCardRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const pullIndicatorRef = useRef<HTMLDivElement>(null);

  // [MVP revertible] Partículas blancas que cubren la foto al salir del sobre
  // y se dispersan al revelarla a pantalla completa. Posiciones/tamaños fijos.
  // En gama baja se reducen (no se eliminan) para aligerar la transición sin
  // perder el efecto de revelado.
  const [revealParticles] = useState(() => {
    const count = isLowEndDevice() ? 14 : 48;

    return Array.from({ length: count }, (_, id) => ({
      id,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 1 + Math.random() * 3.2,
    }));
  });

  useEffect(() => {
    const handleIntroComplete = () => setIsHeroIntroDone(true);

    window.addEventListener("hero-intro-complete", handleIntroComplete);

    return () => window.removeEventListener("hero-intro-complete", handleIntroComplete);
  }, []);

  useEffect(() => {
    // El indicador "Desliza para continuar" no espera a que termine toda la
    // máquina de escribir del hero: aparece poco después de montarse el hero
    // (el evento hero-intro-complete sigue siendo el otro disparador).
    if (!showWeddingHero) {
      return;
    }

    const timer = window.setTimeout(() => setIsHeroIntroDone(true), 1400);

    return () => window.clearTimeout(timer);
  }, [showWeddingHero]);

  useEffect(() => {
    // Modo lite en gama baja: marca el documento para que el CSS quite el
    // backdrop-filter (desenfoque) de los controles flotantes, costoso en GPUs
    // viejas.
    if (!isLowEndDevice()) {
      return;
    }

    document.documentElement.classList.add("lite-mode");

    return () => document.documentElement.classList.remove("lite-mode");
  }, []);

  useEffect(() => {
    // Deshabilita el pinch-zoom en toda la invitación. iOS ignora el viewport
    // maximumScale/userScalable, así que se bloquean sus gestos de pellizco
    // (gesturestart/change/end) y el touchmove con 2+ dedos. El scroll (1 dedo)
    // y el pull-to-refresh del tope NO se ven afectados.
    const preventGesture = (event: Event) => event.preventDefault();
    const preventMultiTouch = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    document.addEventListener("gesturestart", preventGesture);
    document.addEventListener("gesturechange", preventGesture);
    document.addEventListener("gestureend", preventGesture);
    document.addEventListener("touchmove", preventMultiTouch, { passive: false });

    return () => {
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
      document.removeEventListener("touchmove", preventMultiTouch);
    };
  }, []);

  useEffect(() => {
    if (!showWeddingHero) {
      return;
    }

    // WeddingHeroSection se carga de forma diferida, así que .attendance-section
    // aparece después de showWeddingHero: se reintenta hasta que exista para
    // conectar el observer (si no, el swipe nunca se ocultaba al llegar ahí).
    let observer: IntersectionObserver | undefined;
    let raf = 0;
    let attempts = 0;

    const attach = () => {
      const attendanceSection = document.querySelector(".attendance-section");

      if (!attendanceSection) {
        attempts += 1;
        if (attempts < 180) {
          raf = window.requestAnimationFrame(attach);
        }
        return;
      }

      // Scroll nativo del documento: el root del observer es el viewport (null).
      observer = new IntersectionObserver(([entry]) => setIsAttendanceVisible(entry.isIntersecting), {
        root: null,
        threshold: 0.05,
      });
      observer.observe(attendanceSection);
    };

    attach();

    return () => {
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
      observer?.disconnect();
    };
  }, [showWeddingHero]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawName = params.get("para") || params.get("invitado");
    const name = rawName ? normalizeGuestName(rawName) : "";

    if (name && name !== initialGuestName) {
      queueMicrotask(() => setGuestName(name));
    }
  }, [initialGuestName]);

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    const timer = window.setTimeout(() => {
      preloadedInvitationAssets.forEach((src) => {
        const image = new window.Image();
        image.decoding = "async";
        image.src = src;
        images.push(image);
      });
    }, 900);

    return () => {
      window.clearTimeout(timer);
      images.forEach((image) => {
        image.src = "";
      });
    };
  }, []);

  useEffect(() => {
    // Precarga al primer toque en pantalla: el chunk del hero (garantiza que
    // esté listo aunque abran el sobre rápido en una red lenta) y el buffer del
    // audio (preload none -> auto), para que la música arranque sin espera al
    // abrir. El timer de 1.6s queda de respaldo para quien no toca nada.
    const preloadHero = () => {
      void import("../wedding-hero-section/WeddingHeroSection");

      if (audioRef.current) {
        audioRef.current.preload = "auto";
      }
    };
    const timer = window.setTimeout(preloadHero, 1600);

    window.addEventListener("pointerdown", preloadHero, { once: true, passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", preloadHero);
    };
  }, []);

  useEffect(() => {
    if (!isEnvelopeOpen) {
      return;
    }

    // La transición cinematográfica del sobre (la foto que sale y llena la
    // pantalla) SIEMPRE debe reproducirse; solo se omite si el usuario activó
    // "reducir movimiento" en su sistema. En gama baja se aligera reduciendo las
    // partículas (ver revealParticles), no quitando la animación.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      const timer = window.setTimeout(() => {
        setShowWeddingHero(true);
        setIsHeroTransitioning(false);
      }, 460);
      return () => window.clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const cardGeometry = {
        centeredHeight: 0,
        centeredLeft: 0,
        centeredTop: 0,
        centeredWidth: 0,
      };

      gsap.set(transitionCardRef.current, {
        autoAlpha: 0,
        borderRadius: "0.16rem",
        height: 1,
        left: 0,
        padding: 0,
        rotation: -7,
        scale: 1,
        top: 0,
        transformOrigin: "50% 50%",
        width: 1,
        x: 0,
        y: 0,
      });
      // La foto nace cubierta de negro + partículas blancas (cine).
      gsap.set(".hero-transition-black", { opacity: 1 });
      gsap.set(".hero-transition-particle", { opacity: 0, scale: 0.6 });

      gsap
        .timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            setShowWeddingHero(true);

            window.setTimeout(() => {
              gsap.to(transitionCardRef.current, {
                autoAlpha: 0,
                duration: 0.72,
                ease: "sine.out",
                onComplete: () => setIsHeroTransitioning(false),
              });
            }, 160);
          },
        })
        .to(homeSceneRef.current, { duration: 0.42, opacity: 0.98, scale: 0.996 }, 0)
        // el sobre se va desvaneciendo mientras la carta termina de salir
        // (despues de que el flap termina su animacion de framer ~0.96s)
        .to(".envelope-shell, .envelope-top-flap", { autoAlpha: 0, duration: 0.5, ease: "sine.inOut" }, 0.95)
        .call(
          () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const letterEl = envelopeLetterRef.current;
            const aabb = letterEl?.getBoundingClientRect();
            let measuredRect: { height: number; left: number; top: number; width: number };

            if (letterEl && aabb?.width && aabb?.height) {
              // getBoundingClientRect devuelve la caja alineada a los ejes de
              // la carta rotada (-7deg), mas grande que la carta visual: se
              // despeja la escala real para igualar tamano y centro exactos
              // y que el intercambio no pegue un salto.
              const angle = (7 * Math.PI) / 180;
              const scale = aabb.width / (letterEl.offsetWidth * Math.cos(angle) + letterEl.offsetHeight * Math.sin(angle));
              const width = letterEl.offsetWidth * scale;
              const height = letterEl.offsetHeight * scale;

              measuredRect = {
                width,
                height,
                left: aabb.left + (aabb.width - width) / 2,
                top: aabb.top + (aabb.height - height) / 2,
              };
            } else {
              measuredRect = {
                height: Math.min(viewportWidth * 0.43, 186),
                left: viewportWidth * 0.19,
                top: viewportHeight * 0.39,
                width: Math.min(viewportWidth * 0.62, 265),
              };
            }

            const centeredWidth = Math.min(viewportWidth * 0.78, 335);
            const centeredHeight = centeredWidth * (measuredRect.height / measuredRect.width);

            cardGeometry.centeredWidth = centeredWidth;
            cardGeometry.centeredHeight = centeredHeight;
            cardGeometry.centeredLeft = (viewportWidth - centeredWidth) / 2;
            cardGeometry.centeredTop = (viewportHeight - centeredHeight) / 2;

            gsap.set(transitionCardRef.current, {
              autoAlpha: 1,
              height: measuredRect.height,
              left: measuredRect.left,
              rotation: -7,
              scale: 1,
              scaleX: 1,
              scaleY: 1,
              top: measuredRect.top,
              width: measuredRect.width,
              x: 0,
              y: 0,
            });
            gsap.set(envelopeLetterRef.current, { opacity: 1 });
          },
          [],
          1.42,
        )
        .to(envelopeLetterRef.current, { autoAlpha: 0, duration: 0.04, ease: "sine.out" }, 1.44)
        .to(homeSceneRef.current, { duration: 0.55, opacity: 0, y: -10, ease: "sine.inOut" }, 1.44)
        .to(
          transitionCardRef.current,
          {
            boxShadow: "0 1.25rem 2.6rem rgba(28, 25, 18, 0.28)",
            duration: 0.58,
            height: () => cardGeometry.centeredHeight,
            left: () => cardGeometry.centeredLeft,
            rotation: 0,
            scale: 1,
            scaleX: 1,
            scaleY: 1,
            top: () => cardGeometry.centeredTop,
            width: () => cardGeometry.centeredWidth,
            x: 0,
            y: 0,
          },
          1.5,
        )
        .to(
          transitionCardRef.current,
          {
            "--photo-frame": "0rem",
            "--photo-frame-bottom": "0rem",
            borderRadius: 0,
            duration: 0.95,
            height: "100svh",
            left: 0,
            padding: 0,
            rotation: 0,
            scale: 1,
            scaleX: 1,
            scaleY: 1,
            top: 0,
            width: "100vw",
            x: 0,
            y: 0,
          },
          2.0,
        )
        // Las partículas aparecen al salir del sobre (titilan al frente)...
        .to(
          ".hero-transition-particle",
          {
            opacity: "random(0.5, 1)",
            scale: 1,
            duration: 0.5,
            ease: "power1.out",
            stagger: { each: 0.012, from: "random" },
          },
          1.44,
        )
        // ...aguantan durante el centrado y, al disparar el zoom a pantalla
        // completa, el negro se disuelve y las partículas se dispersan para
        // "revelar" la foto (el revelado va sincronizado con el zoom).
        .to(".hero-transition-black", { opacity: 0, duration: 1.05, ease: "power2.inOut" }, 1.96)
        .to(
          ".hero-transition-particle",
          {
            opacity: 0,
            scale: "random(1.4, 2.6)",
            x: "random(-70, 70)",
            y: "random(-90, 50)",
            duration: 1.0,
            ease: "power2.out",
            stagger: { each: 0.006, from: "center" },
          },
          2.02,
        );
    });

    return () => ctx.revert();
  }, [isEnvelopeOpen]);

  useEffect(() => {
    const pauseAudio = () => {
      const audio = audioRef.current;

      if (!audio || audio.paused) {
        return;
      }

      audio.pause();
      setIsMusicPlaying(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAudio();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", pauseAudio);
    window.addEventListener("blur", pauseAudio);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", pauseAudio);
      window.removeEventListener("blur", pauseAudio);
    };
  }, []);

  useEffect(() => {
    // App-shell: con el hero visible, el scroll vive dentro del <main> fijo
    // (.details-scroll), no en el documento. Bloquear el scroll de html/body
    // evita que Chrome móvil oculte/muestre su barra al desplazarse, que es lo
    // que hacía saltar el contenido. Se restaura al desmontar.
    if (!showWeddingHero) {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyHeight: body.style.height,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.height = "100%";

    return () => {
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      body.style.height = previous.bodyHeight;
    };
  }, [showWeddingHero]);

  useEffect(() => {
    // Pull-to-refresh propio. El app-shell bloquea el scroll del documento, así
    // que el PTR nativo de Chrome no se dispara; este lo reemplaza dentro del
    // contenedor de scroll fijo: al jalar hacia abajo desde el tope, muestra un
    // indicador y recarga al soltar si se supera el umbral.
    if (!showWeddingHero) {
      return;
    }

    const scroller = mainRef.current;
    const indicator = pullIndicatorRef.current;

    if (!scroller || !indicator) {
      return;
    }

    const THRESHOLD = 70;
    const MAX = 130;
    let startY = 0;
    let pulling = false;
    let distance = 0;
    let refreshing = false;

    const paint = (d: number) => {
      indicator.style.opacity = String(Math.min(d / 26, 1));
      indicator.style.transform = `translateX(-50%) translateY(${Math.min(d, MAX)}px)`;
    };

    const reset = () => {
      indicator.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      indicator.style.opacity = "0";
      indicator.style.transform = "translateX(-50%) translateY(0)";
      window.setTimeout(() => {
        if (indicator) {
          indicator.style.transition = "";
        }
      }, 280);
    };

    const onStart = (event: TouchEvent) => {
      if (refreshing || event.touches.length !== 1 || scroller.scrollTop > 0) {
        pulling = false;
        return;
      }

      startY = event.touches[0].clientY;
      pulling = true;
      distance = 0;
      indicator.style.transition = "";
    };

    const onMove = (event: TouchEvent) => {
      if (!pulling || refreshing) {
        return;
      }

      const dy = event.touches[0].clientY - startY;

      if (dy <= 0 || scroller.scrollTop > 0) {
        pulling = false;
        reset();
        return;
      }

      distance = dy * 0.5;
      paint(distance);

      if (event.cancelable) {
        event.preventDefault();
      }
    };

    const onEnd = () => {
      if (!pulling || refreshing) {
        return;
      }

      pulling = false;

      if (distance >= THRESHOLD) {
        refreshing = true;
        indicator.querySelector("svg")?.classList.add("animate-spin");
        indicator.style.transition = "transform 0.2s ease";
        indicator.style.opacity = "1";
        indicator.style.transform = `translateX(-50%) translateY(${THRESHOLD}px)`;
        window.setTimeout(() => window.location.reload(), 220);
      } else {
        reset();
      }
    };

    scroller.addEventListener("touchstart", onStart, { passive: true });
    scroller.addEventListener("touchmove", onMove, { passive: false });
    scroller.addEventListener("touchend", onEnd, { passive: true });
    scroller.addEventListener("touchcancel", onEnd, { passive: true });

    return () => {
      scroller.removeEventListener("touchstart", onStart);
      scroller.removeEventListener("touchmove", onMove);
      scroller.removeEventListener("touchend", onEnd);
      scroller.removeEventListener("touchcancel", onEnd);
    };
  }, [showWeddingHero]);

  const openInvitation = () => {
    if (!isEnvelopeOpen) {
      setIsHeroIntroDone(false);
      setIsHeroTransitioning(true);
      setIsEnvelopeOpen(true);

      const audio = audioRef.current;

      if (audio) {
        // Fade-in: la música entra desde silencio hasta su volumen normal,
        // acompañando la apertura del sobre en vez de arrancar de golpe.
        audio.volume = 0;
        audio
          .play()
          .then(() => {
            setHasMusicStarted(true);
            setIsMusicPlaying(true);
            gsap.to(audio, { volume: 0.58, duration: 1.8, ease: "sine.out" });
          })
          .catch(() => {
            setHasMusicStarted(true);
            setIsMusicPlaying(false);
          });
      }
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      // Restaura el volumen por si el fade-in inicial quedó a medias.
      gsap.killTweensOf(audio);
      audio.volume = 0.58;
      audio
        .play()
        .then(() => {
          setHasMusicStarted(true);
          setIsMusicPlaying(true);
        })
        .catch(() => setIsMusicPlaying(false));
      return;
    }

    audio.pause();
    setIsMusicPlaying(false);
  };

  const musicControl = (
    <AnimatePresence>
      {hasMusicStarted ? (
        <m.button
          key="music-control"
          type="button"
          className="music-control-button fixed bottom-[calc(env(safe-area-inset-bottom)+1.1rem)] left-4 z-[80] grid size-[2.7rem] place-items-center overflow-hidden rounded-full p-0 outline-none"
          onClick={toggleMusic}
          initial={{ opacity: 0, y: 18, scale: 0.86 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.88 }}
          transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          aria-label={isMusicPlaying ? "Pausar musica" : "Reproducir musica"}
          aria-pressed={isMusicPlaying}
        >
          <MusicToggleIcon isPlaying={isMusicPlaying} />
        </m.button>
      ) : null}
    </AnimatePresence>
  );

  // El scroll está disponible siempre que se muestre el hero (la animación de
  // intro NO bloquea la navegación). El swipe aparece al terminar el intro.
  const showSwipePrompt = showWeddingHero && isHeroIntroDone && !isAttendanceVisible;

  const swipeDownControl = (
    <AnimatePresence>
      {showSwipePrompt ? (
        <m.div
          key="swipe-down"
          className="fixed-swipe-down"
          initial={{ opacity: 0, y: 18, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.94 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        >
          <SwipeDownPrompt />
        </m.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <LazyMotion features={domMax}>
    <main
      ref={mainRef}
      className={
        showWeddingHero
          ? "details-scroll fixed inset-0 w-full overflow-y-auto overflow-x-hidden overscroll-y-contain bg-[#07111f] text-olive"
          : "relative h-svh overflow-hidden bg-paper text-olive"
      }
    >
      <audio ref={audioRef} src="/audio/song1.mp3?v=20260707-athousandyears" preload="none" loop />
      {showWeddingHero ? <SectionNav /> : null}
      {musicControl}
      {swipeDownControl}

      {showWeddingHero ? (
        <div
          ref={pullIndicatorRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-1/2 top-2 z-[85] grid size-9 place-items-center rounded-full border border-[#f3ede3]/25 bg-[#07111f]/90 text-[#cfe4f6] opacity-0 shadow-[0_0.5rem_1.2rem_rgba(7,17,31,0.42)]"
          style={{ transform: "translateX(-50%) translateY(0)" }}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 4v5h-5" />
          </svg>
        </div>
      ) : null}

      {showWeddingHero ? (
        <WeddingHeroSection />
      ) : (
        <>
          <div className="absolute inset-0 z-[1] bg-paper-texture" aria-hidden="true">
            <Image
              src="/images/paper/paper-texture.webp?v=20260525-wedding-home"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-70 mix-blend-multiply"
            />
          </div>
          <FloralCorners />

          <m.section
            ref={homeSceneRef}
            key="home"
            className="wedding-home-scene absolute inset-x-0 top-0 z-[3] mx-auto grid h-svh w-full px-6"
          >
            <DecorativeText guestName={guestName} />

            <div className="wedding-envelope-stage relative z-[5] grid w-full place-items-center">
              <Envelope isOpen={isEnvelopeOpen} letterRef={envelopeLetterRef} onOpen={openInvitation} />

              {!isEnvelopeOpen ? (
                <m.button
                  type="button"
                  className="open-cta relative z-[7] grid place-items-center border-0 bg-transparent font-script leading-none text-olive outline-none"
                  onClick={openInvitation}
                  initial={{ opacity: 0, x: "7%", y: 12, rotate: -7 }}
                  animate={{ opacity: 1, x: "7%", y: 0, rotate: -7 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: 0.7, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                  aria-label="Clic para abrir"
                >
                  <span>Clic para abrir</span>
                </m.button>
              ) : null}
            </div>

            <Verse />
          </m.section>
        </>
      )}

      {isHeroTransitioning ? (
        <div ref={transitionCardRef} className="hero-transition-card" aria-hidden="true">
          <div className="hero-transition-photo">
            {/* Misma fuente (AVIF + respaldo WebP) que el fondo CSS del hero:
                una sola descarga para la transición y el hero, sin costura en
                el intercambio card -> hero. El AVIF ya se precarga al inicio. */}
            <picture>
              <source srcSet="/images/couple/couple-photo.avif?v=20260616" type="image/avif" />
              <img
                src="/images/couple/couple-photo.webp?v=20260601-assets-2"
                alt=""
                decoding="async"
                className="hero-transition-image object-cover"
              />
            </picture>
            <div className="hero-transition-reveal">
              <div className="hero-transition-black" />
              <div className="hero-transition-particles">
                {revealParticles.map((particle) => (
                  <span
                    key={particle.id}
                    className="hero-transition-particle"
                    style={{
                      top: `${particle.top}%`,
                      left: `${particle.left}%`,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

    </main>
    </LazyMotion>
  );
}
