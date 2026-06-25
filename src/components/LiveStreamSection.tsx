"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import SectionFrameDecor from "./SectionFrameDecor";
import { createSectionReveal } from "@/lib/sectionFx";
import { isLiveNow, YOUTUBE_LIVE_URL } from "@/lib/liveStream";
import YouTubeIcon from "./YouTubeIcon";

gsap.registerPlugin(ScrollTrigger);

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
            <YouTubeIcon className="live-youtube-icon" />
            {isLive ? "Ver transmisión" : "Próximamente"}
          </a>
        </div>
      </div>
    </section>
  );
}
