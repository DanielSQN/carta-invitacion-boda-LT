"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarPlus } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda%20Luisa%20%26%20Tattan&dates=20260926T200000Z/20260927T050000Z&details=Celebramos%20nuestra%20boda%20con%20ustedes.&location=Hacienda%20Santa%20Elena%2C%20Cota%2C%20Cundinamarca";
const icsCalendarUrl = "/boda-luisa-jhonnatan.ics";

export default function CountdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [countdown, setCountdown] = useState<CountdownTime>(initialCountdown);
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
    const initialTimer = window.setTimeout(() => setCountdown(getCountdownTime()), 0);
    const interval = window.setInterval(() => setCountdown(getCountdownTime()), 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scroller = sectionRef.current?.closest(".details-scroll") as HTMLElement | null;
    const triggerDefaults = scroller ? { scroller } : {};

    const ctx = gsap.context(() => {
      gsap.set(topRef.current, { opacity: 1 });
      gsap.set([titleRef.current, metaRef.current, ...itemRefs.current], { opacity: 0 });

      if (reduceMotion) {
        gsap.set([titleRef.current, metaRef.current, ...itemRefs.current], {
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
        .fromTo(titleRef.current, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.86, ease: "power2.out" }, 0.22)
        .fromTo(
          itemRefs.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.72, stagger: 0.08, ease: "power2.out" },
          0.36,
        )
        .fromTo(metaRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.72, ease: "power2.out" }, 0.58);

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const items = [
    { label: "DÍAS", value: countdown.days },
    { label: "HORAS", value: countdown.hours },
    { label: "MINUTOS", value: countdown.minutes },
    { label: "SEGUNDOS", value: countdown.seconds },
  ];
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
          <div ref={titleRef} className="countdown-title-block">
            <h2 id="countdown-title">Faltan</h2>
            <span aria-hidden="true" />
          </div>

          <div className="countdown-grid" aria-label="Cuenta regresiva para la boda">
            {items.map((item, index) => (
              <div
                key={item.label}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className="countdown-unit"
              >
                <strong key={`${item.label}-${item.value}`} className="countdown-unit-value">
                  {String(item.value).padStart(2, "0")}
                </strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

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
        </div>
      </div>
    </section>
  );
}
