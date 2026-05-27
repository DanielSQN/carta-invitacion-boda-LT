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
  "/images/couple/couple-photo.webp?v=20260526-performance-1",
  "/images/florals/floral-top.webp?v=20260526-performance-1",
  "/images/florals/floral-bottom.webp?v=20260526-performance-1",
  "/images/florals/floral-bottom-right.webp?v=20260526-performance-1",
  "/images/venues/ceremony-venue.webp?v=20260526-performance-1",
  "/images/venues/reception-venue.webp?v=20260526-performance-1",
  "/images/ui/music-on.webp?v=20260526-audio-2",
  "/images/ui/music-muted.webp?v=20260526-audio-2",
  "/images/paper/tear-1.webp",
  "/images/paper/tear-2.webp",
];

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

    const timer = window.setTimeout(() => setShowWeddingHero(true), 980);

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

  return (
    <main
      className={
        showWeddingHero
          ? "relative min-h-svh overflow-x-hidden bg-paper text-olive"
          : "relative h-svh overflow-hidden bg-paper text-olive"
      }
    >
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
      <audio ref={audioRef} src="/audio/song1.mp3" preload="auto" loop />

      <AnimatePresence>
        {hasMusicStarted ? (
          <motion.button
            key="music-control"
            type="button"
            className="music-control-button fixed bottom-[calc(env(safe-area-inset-bottom)+1.1rem)] right-4 z-[80] size-14 overflow-hidden rounded-full border border-soft-gold/45 bg-transparent p-0 shadow-[0_0.85rem_1.8rem_rgba(35,30,22,0.22)] outline-none"
            onClick={toggleMusic}
            initial={{ opacity: 0, y: 18, scale: 0.86 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.88 }}
            transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
            aria-label={isMusicPlaying ? "Pausar musica" : "Reproducir musica"}
            aria-pressed={isMusicPlaying}
          >
            <Image
              src={isMusicPlaying ? "/images/ui/music-on.webp?v=20260526-audio-2" : "/images/ui/music-muted.webp?v=20260526-audio-2"}
              alt=""
              fill
              sizes="64px"
              className="object-contain"
            />
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {!showWeddingHero ? (
          <motion.section
            key="home"
            className="wedding-home-scene absolute inset-x-0 top-0 z-[3] mx-auto grid h-svh w-full max-w-[430px] grid-rows-[minmax(0,1fr)_auto] place-items-center px-6"
            exit={{ opacity: 0, y: -34, scale: 0.94, filter: "blur(3px)" }}
            transition={{ duration: 0.88, ease: [0.22, 1, 0.36, 1] }}
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
        ) : (
          <WeddingHeroSection key="wedding-hero" />
        )}
      </AnimatePresence>
    </main>
  );
}
