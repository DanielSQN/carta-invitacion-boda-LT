"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import DecorativeText from "./DecorativeText";
import Envelope from "./Envelope";
import FloralCorners from "./FloralCorners";
import Verse from "./Verse";
import WeddingHeroSection from "../wedding-hero-section/WeddingHeroSection";

const preloadedInvitationAssets = [
  "/images/couple/couple-photo.webp?v=20260601-assets-2",
  "/images/couple/_DSC0723.webp?v=20260601-assets-1",
  "/images/florals/floral-top.webp?v=20260526-performance-1",
  "/images/florals/floral-bottom.webp?v=20260526-performance-1",
  "/images/florals/floral-bottom-right.webp?v=20260526-performance-1",
  "/images/venues/ceremony-venue.webp?v=20260526-performance-1",
  "/images/venues/reception-venue.webp?v=20260526-performance-1",
  "/images/venues/hacienda_SH.webp",
  "/images/ui/envelope.webp?v=20260601-assets-1",
  "/images/ui/wax-seal.webp?v=20260601-assets-1",
  "/images/paper/tear-1.webp",
  "/images/paper/tear-2.webp",
];

function MusicToggleIcon({ isPlaying }: { isPlaying: boolean }) {
  return (
    <svg className="music-toggle-svg" viewBox="0 0 58 58" fill="none" aria-hidden="true" focusable="false">
      {isPlaying ? (
        <>
          <path d="M23.5 18.5V39.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M34.5 18.5V39.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </>
      ) : (
        <path d="M24 18.2L39.2 29L24 39.8V18.2Z" fill="currentColor" />
      )}
    </svg>
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
  const [guestName, setGuestName] = useState(initialGuestName);
  const [hasMusicStarted, setHasMusicStarted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawName = params.get("para") || params.get("invitado");
    const name = rawName ? normalizeGuestName(rawName) : "";

    if (name && name !== initialGuestName) {
      queueMicrotask(() => setGuestName(name));
    }
  }, [initialGuestName]);

  useEffect(() => {
    const images = preloadedInvitationAssets.map((src) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = src;
      return image;
    });

    return () => {
      images.forEach((image) => {
        image.src = "";
      });
    };
  }, []);

  useEffect(() => {
    if (!isEnvelopeOpen) {
      return;
    }

    const timer = window.setTimeout(() => setShowWeddingHero(true), 1320);

    return () => window.clearTimeout(timer);
  }, [isEnvelopeOpen]);

  const openInvitation = () => {
    if (!isEnvelopeOpen) {
      setIsEnvelopeOpen(true);

      const audio = audioRef.current;

      if (audio) {
        audio.volume = 0.58;
        audio
          .play()
          .then(() => {
            setHasMusicStarted(true);
            setIsMusicPlaying(true);
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
        <motion.button
          key="music-control"
          type="button"
          className="music-control-button fixed bottom-[calc(env(safe-area-inset-bottom)+1.1rem)] right-4 z-[80] size-14 overflow-hidden rounded-full border border-[#f3ede3]/30 bg-[#07111f] p-0 text-[#f3ede3] shadow-[0_0.85rem_1.8rem_rgba(7,17,31,0.32)] outline-none"
          onClick={toggleMusic}
          initial={{ opacity: 0, y: 18, scale: 0.86 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.88 }}
          transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          aria-label={isMusicPlaying ? "Pausar musica" : "Reproducir musica"}
          aria-pressed={isMusicPlaying}
        >
          <MusicToggleIcon isPlaying={isMusicPlaying} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );

  const swipeDownControl = (
    <AnimatePresence>
      {showWeddingHero ? (
        <motion.div
          key="swipe-down"
          className="fixed-swipe-down"
          initial={{ opacity: 0, y: 18, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.94 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        >
          <SwipeDownIcon />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <main
      className={
        showWeddingHero
          ? "details-scroll relative h-svh overflow-x-hidden overflow-y-auto bg-[#07111f] text-olive"
          : "relative h-svh overflow-hidden bg-paper text-olive"
      }
    >
      <audio ref={audioRef} src="/audio/song1.mp3" preload="auto" loop />
      {musicControl}
      {swipeDownControl}

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

          <AnimatePresence>
            {isEnvelopeOpen ? (
              <motion.div
                key="envelope-flash"
                className="envelope-to-hero-flash"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.16 }}
                animate={{ opacity: [0, 0.28, 0.08], scale: [0.2, 1.05, 1.52] }}
                exit={{ opacity: 0, scale: 1.8 }}
                transition={{ duration: 1.34, ease: [0.16, 1, 0.3, 1], times: [0, 0.48, 1] }}
              />
            ) : null}
          </AnimatePresence>

          <motion.section
            key="home"
            className="wedding-home-scene absolute inset-x-0 top-0 z-[3] mx-auto grid h-svh w-full max-w-[430px] grid-rows-[minmax(0,1fr)_auto] place-items-center px-6"
          >
            <div className="invitation-hero-stack">
              <DecorativeText guestName={guestName} />

              <div className="wedding-envelope-stage relative z-[5] grid w-full place-items-center">
                <Envelope isOpen={isEnvelopeOpen} onOpen={openInvitation} />

                {!isEnvelopeOpen ? (
                  <motion.button
                    type="button"
                    className="open-cta relative z-[7] grid place-items-center border-0 bg-transparent font-script leading-none text-olive outline-none"
                    onClick={openInvitation}
                    initial={{ opacity: 0, x: "7%", y: 12, rotate: -7 }}
                    animate={{ opacity: 1, x: "7%", y: 0, rotate: -7 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: 1.18, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                    aria-label="Clic para abrir"
                  >
                    <span>Clic para abrir</span>
                  </motion.button>
                ) : null}
              </div>
            </div>

            <Verse />
          </motion.section>
        </>
      )}
    </main>
  );
}
