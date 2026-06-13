"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import SectionFrameDecor from "./SectionFrameDecor";
import { createSectionReveal } from "./sectionFx";
import { isLiveNow, YOUTUBE_LIVE_URL } from "./liveStream";

gsap.registerPlugin(ScrollTrigger);

function YouTubeIcon() {
  return (
    <svg className="live-youtube-icon" viewBox="0 0 28 20" aria-hidden="true" focusable="false">
      <path
        d="M27.2 3.1a3.5 3.5 0 0 0-2.46-2.48C22.57 0 14 0 14 0S5.43 0 3.26.62A3.5 3.5 0 0 0 .8 3.1 36.5 36.5 0 0 0 .2 10c0 2.32.2 4.64.6 6.9a3.5 3.5 0 0 0 2.46 2.48C5.43 20 14 20 14 20s8.57 0 10.74-.62a3.5 3.5 0 0 0 2.46-2.48c.4-2.26.6-4.58.6-6.9 0-2.32-.2-4.64-.6-6.9Z"
        fill="#FF0000"
      />
      <path d="M11.2 14.29 18.34 10 11.2 5.71v8.58Z" fill="#fff" />
    </svg>
  );
}

export default function LiveStreamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Se calcula en cliente para evitar desajustes de hidratacion por la hora.
    queueMicrotask(() => setIsLive(isLiveNow()));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      createSectionReveal(sectionRef.current, { stagger: 0.16 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="live-section" aria-labelledby="live-title">
      <SectionFrameDecor variant="dress" />
      <div className="live-overlay" aria-hidden="true" />

      <div className="live-inner">
        <div className="live-heading" data-reveal>
          <span className="section-kicker">Transmisión en vivo</span>
          <h2 id="live-title">Acompáñanos a la distancia</h2>
          <p>
            Si no puedes estar presente, transmitiremos la ceremonia en vivo para que celebres con nosotros desde donde te
            encuentres.
          </p>
        </div>

        <div className="live-card" data-reveal>
          {isLive ? (
            <span className="live-badge" role="status">
              <i className="live-badge-dot" aria-hidden="true" />
              EN VIVO
            </span>
          ) : (
            <span className="live-badge live-badge--soon">
              <i aria-hidden="true" />
              Disponible el 26 de septiembre
            </span>
          )}

          <p className="live-card-copy">
            {isLive
              ? "¡La transmisión está al aire! Toca el botón para verla en YouTube."
              : "El enlace se activará el día del evento. ¡Aparta la fecha!"}
          </p>

          <a
            className={`live-youtube-button${isLive ? "" : " is-disabled"}`}
            href={isLive ? YOUTUBE_LIVE_URL : undefined}
            target={isLive ? "_blank" : undefined}
            rel={isLive ? "noopener noreferrer" : undefined}
            aria-disabled={isLive ? undefined : true}
            tabIndex={isLive ? undefined : -1}
          >
            <YouTubeIcon />
            {isLive ? "Ver transmisión" : "Próximamente"}
          </a>
        </div>
      </div>
    </section>
  );
}
