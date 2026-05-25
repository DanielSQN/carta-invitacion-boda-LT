"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import DecorativeText from "./DecorativeText";
import Envelope from "./Envelope";
import FloralCorners from "./FloralCorners";
import Verse from "./Verse";

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
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState(initialGuestName);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawName = params.get("para") || params.get("invitado");
    const name = rawName ? normalizeGuestName(rawName) : "";

    if (name && name !== initialGuestName) {
      queueMicrotask(() => setGuestName(name));
    }
  }, [initialGuestName]);

  return (
    <main className="relative h-dvh overflow-hidden bg-paper text-olive">
      <div className="absolute inset-0 z-[1] bg-paper-texture" aria-hidden="true" />
      <FloralCorners />

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.section
            key="home"
            className="wedding-home-scene relative z-[3] mx-auto grid h-dvh w-full max-w-[430px] grid-rows-[minmax(0,1fr)_auto] place-items-center px-6"
            exit={{ opacity: 0, scale: 0.96, filter: "blur(2px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="invitation-hero-stack">
              <DecorativeText guestName={guestName} />

              <div className="wedding-envelope-stage relative z-[5] grid w-full place-items-center">
                <Envelope isOpen={isOpen} onOpen={() => setIsOpen(true)} />

                <motion.button
                  type="button"
                  className="open-cta relative z-[7] grid place-items-center border-0 bg-transparent font-script leading-none text-olive outline-none"
                  onClick={() => setIsOpen(true)}
                  initial={{ opacity: 0, x: "7%", y: 12, rotate: -7 }}
                  animate={{ opacity: 1, x: "7%", y: 0, rotate: -7 }}
                  transition={{ delay: 1.5, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                  aria-label="Clic para abrir"
                >
                  <svg className="open-cta-arrow" viewBox="0 0 88 76" fill="none" aria-hidden="true">
                    <path
                      d="M44 68C55 48 48 27 27 23"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2.4"
                    />
                    <path
                      d="M27 23c8-3 14-8 20-16M27 23c8 3 14 8 20 16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.4"
                    />
                  </svg>
                  <span>Clic para abrir</span>
                </motion.button>
              </div>
            </div>

            <Verse />
          </motion.section>
        ) : (
          <motion.section
            key="placeholder"
            className="relative z-[8] grid min-h-dvh place-items-center px-8 text-center"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.58, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="mb-4 font-serif text-sm uppercase tracking-[0.32em] text-soft-gold">
                Luisa &amp; Tattan
              </p>
              <h2 className="font-script text-[clamp(4rem,20vw,6.8rem)] leading-none text-olive">
                Nuestra boda
              </h2>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
