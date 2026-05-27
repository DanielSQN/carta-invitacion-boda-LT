"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronsDown,
  Church,
  Clock3,
  Hourglass,
  MessageCircle,
  Navigation,
  TimerReset,
  Wine,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const assetVersion = "20260526-performance-1";
const weddingDate = new Date("2026-09-26T00:00:00-05:00");

const fadeUp = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const smoothTransition = {
  duration: 0.78,
  ease: [0.22, 1, 0.36, 1] as const,
};

type CountdownTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdownTime(): CountdownTime {
  const totalSeconds = Math.max(Math.floor((weddingDate.getTime() - Date.now()) / 1000), 0);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function LTLogo() {
  return (
    <motion.p
      className="wedding-hero-logo mx-auto mt-2 font-display text-[0.94rem] font-semibold uppercase tracking-[0.18em] text-[#9a7132]"
      variants={fadeUp}
      transition={{ ...smoothTransition, delay: 0.44 }}
    >
      LUISA &amp; TATTAN
    </motion.p>
  );
}

function FloralTopDecorations() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[19dvh] min-h-24 overflow-hidden"
      aria-hidden="true"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.22 } },
      }}
    >
      <motion.div
        className="absolute -left-3 -top-4 w-48 origin-top-left rotate-[-6deg]"
        variants={{
          hidden: { opacity: 0, x: -18, y: -14, scale: 0.94 },
          visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { ...smoothTransition, duration: 0.95 } },
        }}
      >
        <Image
          src={`/images/florals/floral-top.webp?v=${assetVersion}`}
          alt=""
          width={360}
          height={240}
          priority
          className="w-full scale-x-[-1] object-contain opacity-95"
        />
      </motion.div>
      <motion.div
        className="absolute -right-3 -top-4 w-48 origin-top-right rotate-[6deg]"
        variants={{
          hidden: { opacity: 0, x: 18, y: -14, scale: 0.94 },
          visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { ...smoothTransition, duration: 0.95 } },
        }}
      >
        <Image
          src={`/images/florals/floral-top.webp?v=${assetVersion}`}
          alt=""
          width={360}
          height={240}
          priority
          className="w-full object-contain opacity-94"
        />
      </motion.div>
    </motion.div>
  );
}

function DecorativeHeartRule() {
  return (
    <div className="mx-auto flex w-full max-w-[285px] items-center justify-center gap-3 text-soft-gold" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-soft-gold/80 to-soft-gold" />
      <span className="grid size-6 place-items-center">
        <span className="font-serif text-lg leading-none">♡</span>
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-soft-gold/80 to-soft-gold" />
    </div>
  );
}

function WeddingTitleBlock() {
  return (
    <div className="relative z-[4] text-center">
      <motion.h1
        id="wedding-hero-title"
        className="wedding-hero-title whitespace-nowrap font-script text-[clamp(3.35rem,15.8vw,5.35rem)] leading-[0.84] text-olive drop-shadow-[0_2px_0_rgba(255,252,244,0.72)]"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.36 }}
      >
        Nuestra Boda
      </motion.h1>

      <LTLogo />

      <motion.div
        className="wedding-heart-rule mt-5"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.56 }}
      >
        <DecorativeHeartRule />
      </motion.div>

      <motion.div
        className="wedding-date-block mt-5 text-center"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.66 }}
      >
        <p className="wedding-hero-date whitespace-nowrap font-display text-[clamp(2rem,9.8vw,3.1rem)] font-medium leading-none tracking-[0.04em] text-olive">
          26 <span className="text-soft-gold">·</span> 09 <span className="text-soft-gold">·</span> 26
        </p>
      </motion.div>
    </div>
  );
}

function WeddingCountdownBlock() {
  const [countdown, setCountdown] = useState<CountdownTime>(() => getCountdownTime());

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdownTime());

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const items = [
    { label: "DIAS", value: countdown.days, icon: CalendarDays },
    { label: "HORAS", value: countdown.hours, icon: Clock3 },
    { label: "MINUTOS", value: countdown.minutes, icon: Hourglass },
    { label: "SEGUNDOS", value: countdown.seconds, icon: TimerReset },
  ];

  return (
    <motion.div
      className="wedding-countdown-block relative z-[4] mx-auto mt-4 w-full max-w-[350px] text-center"
      variants={fadeUp}
      transition={{ ...smoothTransition, delay: 0.76 }}
    >
      <p className="wedding-countdown-copy font-serif text-[0.78rem] leading-none text-olive/78">
        Faltan para nuestra boda
      </p>

      <div className="mt-3 grid grid-cols-4 items-start gap-2">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="wedding-countdown-item min-w-0 text-center">
            <Icon className="wedding-countdown-icon mx-auto mb-1 size-5 text-soft-gold" strokeWidth={1.45} />
            <p className="wedding-countdown-value font-display text-[1.55rem] font-semibold leading-none text-olive">
              {String(value).padStart(2, "0")}
            </p>
            <p className="wedding-countdown-label mt-0.5 text-[0.55rem] font-semibold leading-none tracking-[0.08em] text-[#9a7132]">
              {label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
function ScrollHint() {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.35rem)] z-20 grid place-items-center text-center text-[#fff8eb]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smoothTransition, delay: 1.22 }}
    >
      <p className="font-script text-[1.65rem] leading-none opacity-90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.42)]">
        Desliza para continuar
      </p>
      <motion.div
        className="mt-2 text-soft-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.36)]"
        animate={{ y: [0, 7, 0], opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 1.85, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronsDown className="size-8" strokeWidth={1.9} />
      </motion.div>
    </motion.div>
  );
}

function CouplePhotoSection() {
  return (
    <motion.section
      className="wedding-photo-section relative z-10 -mt-6 h-[calc(56svh+1.5rem)] min-h-0 overflow-hidden bg-[#f6ead7]"
      initial={{ opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.05, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Foto de la pareja"
    >
      <div className="photo-image-top-fade absolute inset-0">
        <Image
          src={`/images/couple/couple-photo.webp?v=${assetVersion}`}
          alt="Luisa y Tattan"
          fill
          priority
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover object-[52%_28%] saturate-[0.9] sepia-[0.12]"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-black/58 via-black/18 to-transparent" />
      <ScrollHint />
    </motion.section>
  );
}

function TearDivider({ variant }: { variant: "one" | "two" }) {
  return <div className={`tear-divider tear-divider--${variant}`} aria-hidden="true" />;
}

function BotanicalDecorations() {
  return (
    <>
      <Image
        src={`/images/florals/floral-top.webp?v=${assetVersion}`}
        alt=""
        width={360}
        height={240}
        className="flowers section-flower section-flower--top reveal-item"
        aria-hidden="true"
      />
      <Image
        src={`/images/florals/floral-bottom.webp?v=${assetVersion}`}
        alt=""
        width={320}
        height={260}
        className="flowers section-flower section-flower--bottom-left reveal-item"
        aria-hidden="true"
      />
      <Image
        src={`/images/florals/floral-bottom-right.webp?v=${assetVersion}`}
        alt=""
        width={280}
        height={220}
        className="flowers section-flower section-flower--bottom-right reveal-item"
        aria-hidden="true"
      />
    </>
  );
}

function ConfirmationSection() {
  return (
    <section className="paper-section paper-section--warm reveal-section" aria-labelledby="confirmation-section-title">
      <BotanicalDecorations />
      <div className="paper-section-frame" aria-hidden="true" />
      <div className="paper-section-content confirmation-content">
        <div className="reveal-item section-heart-knot" aria-hidden="true">
          <span />
          <span>♡</span>
          <span />
        </div>

        <h2 id="confirmation-section-title" className="reveal-item confirmation-title">
          <span>Confirma tu</span>
          <strong>Asistencia</strong>
        </h2>

        <div className="reveal-item section-heart-rule" aria-hidden="true">
          <span />
          <span>♡</span>
          <span />
        </div>

        <p className="reveal-item confirmation-copy">
          Tu presencia es muy importante para nosotros.
          <br />
          Por favor confirma tu asistencia antes del
          <br />
          <span>10 de agosto de 2026.</span>
        </p>

        <a
          className="reveal-item paper-action confirmation-action"
          href="https://wa.me/?text=Confirmo%20mi%20asistencia%20a%20la%20boda%20de%20Luisa%20y%20Tattan"
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle className="size-4" strokeWidth={1.8} />
          Confirmar asistencia
        </a>
      </div>
    </section>
  );
}

function LocationSection() {
  const eventCards = [
    {
      title: "Ceremonia",
      time: "3:00 P. M.",
      place: "El lugar de su presencia",
      city: "Bogota, Colombia",
      image: `/images/venues/ceremony-venue.webp?v=${assetVersion}`,
      icon: Church,
      mapQuery: "El lugar de su presencia Bogota",
    },
    {
      title: "Recepción",
      time: "4:30 P. M.",
      place: "Celebracion",
      city: "Bogota, Colombia",
      image: `/images/venues/reception-venue.webp?v=${assetVersion}`,
      icon: Wine,
      mapQuery: "Bogota Colombia wedding reception venue",
    },
  ];

  return (
    <section className="paper-section paper-section--paper reveal-section" aria-labelledby="location-section-title">
      <BotanicalDecorations />
      <div className="paper-section-content location-content">
        <div className="reveal-item section-heart-knot" aria-hidden="true">
          <span />
          <span>♡</span>
          <span />
        </div>

        <h2 id="location-section-title" className="reveal-item location-title">
          Lugar del evento
        </h2>

        <div className="reveal-item section-heart-rule" aria-hidden="true">
          <span />
          <span>♡</span>
          <span />
        </div>

        <p className="reveal-item location-copy">Información de ceremonia y recepción.</p>

        <div className="event-card-grid">
          {eventCards.map(({ title, time, place, city, image, icon: Icon, mapQuery }) => (
            <article key={title} className="reveal-item event-card">
              <div className="event-card-icon">
                <Icon className="size-8 text-soft-gold" strokeWidth={1.35} />
              </div>
              <h3>{title}</h3>
              <div className="event-card-rule" aria-hidden="true">
                <span />
                <span>♡</span>
                <span />
              </div>
              <p className="event-time">{time}</p>
              <p>{place}</p>
              <p>{city}</p>
              <div className="event-image-frame">
                <Image src={image} alt={`${title} de la boda`} fill sizes="(max-width: 430px) 86vw, 185px" />
              </div>
              <a
                className="paper-action paper-action--light event-card-action"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Navigation className="size-4" strokeWidth={1.8} />
                Ver ubicación
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WeddingHeroSection() {
  useEffect(() => {
    const sections = document.querySelectorAll(".reveal-section");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        }
      },
      {
        threshold: 0.38,
        rootMargin: "-8% 0px -8% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      className="paper-stack relative z-[8] mx-auto w-full max-w-[430px] overflow-hidden bg-[#f6ead7] text-olive shadow-[0_0_45px_rgba(77,58,35,0.16)]"
      initial={{ opacity: 0, y: 72, scale: 0.975 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.05, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="wedding-hero-title"
    >
      <div className="paper-section paper-section--hero reveal-section relative flex h-[100svh] flex-col overflow-hidden">
        <section
          className="wedding-hero-paper relative z-20 flex h-[44svh] shrink-0 items-start justify-center px-5 pb-6 pt-[calc(env(safe-area-inset-top)+3.2rem)]"
        >
          <FloralTopDecorations />
          <motion.div initial="hidden" animate="visible" className="wedding-hero-content relative z-[30] w-full">
            <WeddingTitleBlock />
            <WeddingCountdownBlock />
          </motion.div>
        </section>

        <CouplePhotoSection />
      </div>

      <TearDivider variant="one" />
      <ConfirmationSection />
      <TearDivider variant="two" />
      <LocationSection />
    </motion.section>
  );
}
