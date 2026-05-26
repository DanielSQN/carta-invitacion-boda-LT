"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import DecorativeText from "./DecorativeText";
import Envelope from "./Envelope";
import FloralCorners from "./FloralCorners";
import Verse from "./Verse";
import WeddingHeroSection from "../wedding-hero-section/WeddingHeroSection";

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawName = params.get("para") || params.get("invitado");
    const name = rawName ? normalizeGuestName(rawName) : "";

    if (name && name !== initialGuestName) {
      queueMicrotask(() => setGuestName(name));
    }
  }, [initialGuestName]);

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
    }
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-paper text-olive">
      <div className="absolute inset-0 z-[1] bg-paper-texture" aria-hidden="true">
        <Image
          src="/images/paper-texture.webp?v=20260525-wedding-home"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70 mix-blend-multiply"
        />
      </div>
      <FloralCorners />

      <AnimatePresence>
        {!showWeddingHero ? (
          <motion.section
            key="home"
            className="wedding-home-scene absolute inset-x-0 top-0 z-[3] mx-auto grid h-dvh w-full max-w-[430px] grid-rows-[minmax(0,1fr)_auto] place-items-center px-6"
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
                    transition={{ delay: 1.5, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
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
