"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarPlus } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { blurData } from "@/lib/blur";
import SectionFrameDecor from "./SectionFrameDecor";

gsap.registerPlugin(ScrollTrigger);

const weddingDate = new Date("2026-09-26T00:00:00-05:00");

type CountdownTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const initialCountdown: CountdownTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function getCountdownTime(): CountdownTime {
  const totalSeconds = Math.max(Math.floor((weddingDate.getTime() - Date.now()) / 1000), 0);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const googleCalendarUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda%20Luisa%20%26%20Jhonnatan&dates=20260926T190000Z/20260927T050000Z&details=Celebramos%20nuestra%20boda%20con%20ustedes.&location=Hacienda%20Santa%20Elena%20-%20Sal%C3%B3n%20Antonino%2C%20Cota%2C%20Cundinamarca";
const icsCalendarUrl = "/boda-luisa-jhonnatan.ics";

// El tick de cada segundo vive en este componente: así solo se re-renderizan
// el título y los dígitos, y no la sección completa (fondo con next/image,
// cita, botón de calendario) 60 veces por minuto. `meta` llega ya renderizado
// por el padre (referencia estable), así que React lo salta en cada tick.
function CountdownTicker({ meta }: { meta: ReactNode }) {
  const [countdown, setCountdown] = useState<CountdownTime>(initialCountdown);
  // El estado inicial (todo en cero) es solo el placeholder de SSR: hasta el
  // primer tick real no se puede saber si la cuenta de verdad llegó a cero.
  const [hasTicked, setHasTicked] = useState(false);

  useEffect(() => {
    const tick = () => {
      setCountdown(getCountdownTime());
      setHasTicked(true);
    };
    const initialTimer = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, []);

  const items = [
    { label: "DÍAS", value: countdown.days },
    { label: "HORAS", value: countdown.hours },
    { label: "MINUTOS", value: countdown.minutes },
    { label: "SEGUNDOS", value: countdown.seconds },
  ];
  // Cuando la cuenta llega a cero (26 de septiembre de 2026) la cuadrícula se
  // reemplaza por el mensaje del gran día.
  const isWeddingDay =
    hasTicked && countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0;

  return (
    <>
      <div className="countdown-title-block">
        <h2 id="countdown-title">{isWeddingDay ? "¡Es hoy!" : "Faltan"}</h2>
        <span aria-hidden="true" />
      </div>

      <div className="countdown-row">
        {isWeddingDay ? (
          <p className="countdown-today" role="status">
            ¡Llegó el gran día! Nos vemos a las 2:00 p.m. en la ceremonia.
          </p>
        ) : (
          <div className="countdown-grid" aria-label="Cuenta regresiva para la boda">
            {items.map((item) => (
              <div key={item.label} className="countdown-unit">
                {/* La key con el valor remonta el nodo para relanzar la
                    animación de subida del dígito */}
                <strong key={`${item.label}-${item.value}`} className="countdown-unit-value">
                  {String(item.value).padStart(2, "0")}
                </strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
        {meta}
      </div>
    </>
  );
}

export default function CountdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const [calendarHref, setCalendarHref] = useState(googleCalendarUrl);

  useEffect(() => {
    // Mismo boton para todos: en iOS abre el .ics (Apple Calendar),
    // en Android/desktop abre Google Calendar.
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);

    if (isIOS) {
      queueMicrotask(() => setCalendarHref(icsCalendarUrl));
    }
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scroller = sectionRef.current?.closest(".details-scroll") as HTMLElement | null;
    const triggerDefaults = scroller ? { scroller } : {};

    // Los selectores (".countdown-title-block", ".countdown-unit") quedan
    // scopeados a la sección por gsap.context: el título y los dígitos viven
    // en CountdownTicker y no exponen refs.
    const ctx = gsap.context(() => {
      gsap.set(topRef.current, { opacity: 1 });
      gsap.set([".countdown-title-block", metaRef.current, ".countdown-unit"], { opacity: 0 });

      if (reduceMotion) {
        gsap.set([".countdown-title-block", metaRef.current, ".countdown-unit"], {
          opacity: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
            ...triggerDefaults,
          },
        })
        .fromTo(".countdown-title-block", { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.86, ease: "power2.out" }, 0.22)
        .fromTo(
          ".countdown-unit",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.72, stagger: 0.08, ease: "power2.out" },
          0.36,
        )
        .fromTo(metaRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.72, ease: "power2.out" }, 0.58);

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const isIcsCalendar = calendarHref === icsCalendarUrl;

  return (
    <section ref={sectionRef} className="countdown-section" aria-labelledby="countdown-title">
      <SectionFrameDecor variant="countdown" />
      <div ref={imageRef} className="countdown-bg" aria-hidden="true">
        <Image
          src="/images/couple/_DSC0723.webp?v=20260601-assets-1"
          alt=""
          fill
          sizes="100vw"
          quality={50}
          placeholder="blur"
          blurDataURL={blurData["couple/_DSC0723"]}
          className="countdown-bg-image"
          priority={false}
        />
      </div>
      <div className="countdown-overlay" aria-hidden="true" />
      <div className="countdown-vignette" aria-hidden="true" />

      <div className="countdown-layout">
        <div ref={topRef} className="countdown-quote-panel">
          <p className="countdown-quote-static">
            Desde aquel <span className="countdown-quote-yes">Sí</span>, empezó nuestra aventura favorita
          </p>
        </div>

        <div className="countdown-content">
          <CountdownTicker
            meta={
              <div ref={metaRef} className="countdown-meta">
                <p className="countdown-date">26 · SEP · 2026</p>
                <div className="countdown-actions" aria-label="Agregar la fecha al calendario">
                  <a
                    href={calendarHref}
                    {...(isIcsCalendar ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    <CalendarPlus className="countdown-action-icon" aria-hidden="true" strokeWidth={1.8} />
                    Agregar al calendario
                  </a>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
