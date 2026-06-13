"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { isLiveNow, YOUTUBE_LIVE_URL } from "./liveStream";
import YouTubeIcon from "./YouTubeIcon";

export default function LiveBanner() {
  const [isLive, setIsLive] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setIsLive(isLiveNow()));
  }, []);

  if (typeof document === "undefined") {
    return null;
  }

  const banner = (
    <AnimatePresence>
      {isLive && !dismissed ? (
        <motion.div
          className="live-banner"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <a className="live-banner-link" href={YOUTUBE_LIVE_URL} target="_blank" rel="noopener noreferrer">
            <span className="live-banner-line">
              <span className="live-banner-chip" aria-hidden="true">
                <YouTubeIcon className="live-banner-yt" />
              </span>
              <span className="live-banner-dot" aria-hidden="true" />
              <strong>EN VIVO</strong>
              <span className="live-banner-text">· Transmisión del evento</span>
            </span>
            <span className="live-banner-sub">da clic aquí para ingresar a la transmisión</span>
          </a>
          <button
            type="button"
            className="live-banner-close"
            onClick={() => setDismissed(true)}
            aria-label="Ocultar aviso de transmisión"
          >
            ✕
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return createPortal(banner, document.body);
}
