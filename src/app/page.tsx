"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Gift,
  Heart,
  MapPinned,
  MessageCircle,
  Volume2,
  VolumeX,
} from "lucide-react";

function BotanicalCorner({ side }: { side: "left" | "right" }) {
  return (
    <svg
      className={`botanical botanical-${side}`}
      viewBox="0 0 210 320"
      role="img"
      aria-label="Ramas florales decorativas"
    >
      <path
        d="M104 302 C74 246 82 197 108 144 C128 101 144 63 132 20"
        fill="none"
      />
      <path d="M93 252 C48 248 25 224 14 188" fill="none" />
      <path d="M105 211 C146 204 173 181 191 139" fill="none" />
      <path d="M112 156 C71 145 45 119 31 82" fill="none" />
      <path d="M124 102 C163 94 184 70 197 36" fill="none" />
      <ellipse cx="72" cy="243" rx="12" ry="29" transform="rotate(-54 72 243)" />
      <ellipse cx="44" cy="222" rx="10" ry="24" transform="rotate(-39 44 222)" />
      <ellipse cx="150" cy="196" rx="11" ry="28" transform="rotate(48 150 196)" />
      <ellipse cx="174" cy="166" rx="10" ry="25" transform="rotate(35 174 166)" />
      <ellipse cx="72" cy="133" rx="12" ry="28" transform="rotate(-47 72 133)" />
      <ellipse cx="48" cy="101" rx="10" ry="24" transform="rotate(-35 48 101)" />
      <ellipse cx="158" cy="85" rx="11" ry="26" transform="rotate(48 158 85)" />
      <ellipse cx="181" cy="56" rx="9" ry="22" transform="rotate(32 181 56)" />
      <circle cx="117" cy="127" r="8" />
      <circle cx="130" cy="118" r="7" />
      <circle cx="102" cy="118" r="6" />
      <circle cx="118" cy="109" r="6" />
    </svg>
  );
}

function EnvelopeDrawing() {
  return (
    <svg
      className="envelope-drawing"
      viewBox="0 0 620 390"
      aria-hidden="true"
    >
      <path className="draw-line draw-outline" d="M2 2 H618 V388 H2 Z" />
      <path className="draw-line draw-flap" d="M2 2 L310 205 L618 2" />
      <path className="draw-line draw-fold" d="M2 388 L228 207" />
      <path className="draw-line draw-fold" d="M618 388 L392 207" />
      <path className="draw-line draw-front" d="M2 388 L310 178 L618 388" />
      <path className="draw-line draw-soft" d="M248 262 H372" />
    </svg>
  );
}

const particles = [
  { x: 7, size: 4, delay: 1.05, duration: 12, drift: -22, spin: 44 },
  { x: 12, size: 3, delay: 1.8, duration: 14, drift: 18, spin: -38 },
  { x: 18, size: 4, delay: 1.35, duration: 13, drift: -16, spin: 58 },
  { x: 24, size: 3, delay: 2.2, duration: 15, drift: 26, spin: -30 },
  { x: 31, size: 5, delay: 1.6, duration: 16, drift: -24, spin: 54 },
  { x: 38, size: 3, delay: 2.85, duration: 12.5, drift: 16, spin: -52 },
  { x: 45, size: 4, delay: 2.05, duration: 14.5, drift: -20, spin: 36 },
  { x: 52, size: 3, delay: 1.2, duration: 13.5, drift: 22, spin: -42 },
  { x: 59, size: 4, delay: 2.45, duration: 15.5, drift: -18, spin: 48 },
  { x: 66, size: 3, delay: 1.95, duration: 12.8, drift: 20, spin: -34 },
  { x: 73, size: 4, delay: 3.05, duration: 14.8, drift: -26, spin: 52 },
  { x: 80, size: 3, delay: 1.55, duration: 13.8, drift: 14, spin: -46 },
  { x: 87, size: 4, delay: 2.3, duration: 15.2, drift: -18, spin: 40 },
  { x: 94, size: 3, delay: 3.35, duration: 12.9, drift: 16, spin: -50 },
  
];

function FloatingParticles() {
  return (
    <div className="floating-particles" aria-hidden="true">
      {particles.map((particle, index) => (
        <span
          key={`${particle.x}-${particle.delay}`}
          className="floating-particle"
          style={
            {
              "--particle-x": `${particle.x}%`,
              "--particle-size": `${particle.size}px`,
              "--particle-delay": `${particle.delay}s`,
              "--particle-duration": `${particle.duration}s`,
              "--particle-drift": `${particle.drift}px`,
              "--particle-spin": `${particle.spin}deg`,
            } as CSSProperties
          }
        >
          <i className={index % 3 === 0 ? "particle-petal" : "particle-dot"} />
        </span>
      ))}
    </div>
  );
}

const MUSIC_SRC = "/audio/musica-fondo.wav";

function useScrollTitles(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const titles = document.querySelectorAll<HTMLElement>(".write-title");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-writing");
          }
        });
      },
      { threshold: 0.45 },
    );

    titles.forEach((title) => observer.observe(title));

    return () => observer.disconnect();
  }, [isOpen]);
}

function TypedTitle({ children }: { children: string }) {
  return (
    <h2
      className="write-title"
      style={{ "--title-characters": children.length } as CSSProperties}
    >
      {children}
    </h2>
  );
}

function WeddingCard({ musicEnabled, onToggleMusic }: {
  musicEnabled: boolean;
  onToggleMusic: () => void;
}) {
  return (
    <div className="details-page">
      <div className="details-photo-backdrop" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="details-photo-image"
          src="/images/foto-pareja.png"
          alt=""
        />
      </div>

      <section className="details-hero">
        <div className="hero-ornament hero-ornament-top" aria-hidden="true" />
        <div className="hero-copy">
          <p>¡Nos casamos!</p>
          <h1>Luisa &amp; Tattan</h1>
          <span>26 ~ 09 ~ 2026</span>
        </div>
        <div className="hero-ornament hero-ornament-bottom" aria-hidden="true">
        </div>
        <div className="scroll-cue">
          <span>Desliza</span>
        </div>
      </section>

      <section className="story-strip">
        <p>Toda aventura comienza con un &quot;Sí&quot;</p>
      </section>

      <section className="overlay-section overlay-dark">
        <div className="wave wave-top" aria-hidden="true" />
        <div className="section-content">
          <TypedTitle>Ceremonia</TypedTitle>
          <h3>Iglesia de la Unidad</h3>
          <p>
            Calle 123 #45 - 67
            <br />
            Ciudad
          </p>
          <time>5:00 PM</time>
          <a
            className="map-link map-link-light"
            href="https://maps.google.com/?q=Iglesia%20de%20la%20Unidad"
            target="_blank"
            rel="noreferrer"
          >
            <MapPinned aria-hidden="true" />
            Pulsa para ver en Maps
          </a>
        </div>
        <div className="wave wave-bottom" aria-hidden="true" />
      </section>

      <section className="overlay-section overlay-paper">
        <div className="section-content">
          <TypedTitle>Celebración</TypedTitle>
          <h3>Hacienda San Miguel</h3>
          <p>
            Km 12 vía al Sol
            <br />
            Ciudad
          </p>
          <time>7:30 PM</time>
          <a
            className="map-link"
            href="https://maps.google.com/?q=Hacienda%20San%20Miguel"
            target="_blank"
            rel="noreferrer"
          >
            <MapPinned aria-hidden="true" />
            Pulsa para ver en Maps
          </a>
        </div>
      </section>

      <section className="overlay-section overlay-light">
        <div className="section-content">
          <TypedTitle>Detalles</TypedTitle>
          <div className="detail-list">
            <p>
              <CalendarDays aria-hidden="true" />
              26 ~ 09 ~ 2026
            </p>
            <p>
              <Heart aria-hidden="true" />
              Vestimenta formal / elegante
            </p>
            <p>
              <Gift aria-hidden="true" />
              Tu presencia es nuestro mejor regalo
            </p>
          </div>
          <a
            className="whatsapp-button"
            href="https://wa.me/?text=Confirmo%20mi%20asistencia%20a%20la%20boda%20de%20Luisa%20y%20Tattan"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle aria-hidden="true" />
            Confirmar por WhatsApp
          </a>
          <blockquote>
            &quot;El que halla esposa halla el bien,
            <br />y alcanza la benevolencia de Jehova.&quot;
            <cite>Proverbios 18:22</cite>
          </blockquote>
        </div>
      </section>

      <div className="floating-controls" aria-label="Controles">
        <button
          type="button"
          onClick={onToggleMusic}
          aria-label={musicEnabled ? "Pausar musica" : "Reproducir musica"}
        >
          {musicEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

function WaxSeal() {
  const [showImage, setShowImage] = useState(true);

  return (
    <div className="wax-seal" aria-hidden="true">
      {showImage ? (
        // Place your exact seal image at public/images/sello-lt.png.
        <Image
          className="wax-seal-image"
          src="/images/sello-lt.png"
          alt=""
          fill
          sizes="118px"
          priority
          unoptimized
          onError={() => setShowImage(false)}
        />
      ) : (
        <span className="seal-fallback">L&amp;T</span>
      )}
    </div>
  );
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [guestName, setGuestName] = useState("Daniel Santiago");
  useScrollTitles(isOpen);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("para")?.trim() || params.get("invitado")?.trim();

    if (name) {
      queueMicrotask(() => setGuestName(name));
    }
  }, []);

  const playMusic = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    try {
      audio.volume = 0.45;
      await audio.play();
      setMusicEnabled(true);
    } catch {
      setMusicEnabled(false);
    }
  };

  const openInvitation = () => {
    setIsOpen(true);
    void playMusic();
  };

  const toggleMusic = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      void playMusic();
      return;
    }

    audio.pause();
    setMusicEnabled(false);
  };

  return (
    <main className={`wedding-page ${isOpen ? "invitation-open" : ""}`}>
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />
      <BotanicalCorner side="left" />
      <BotanicalCorner side="right" />

      <FloatingParticles />

      <section className="initial-scene" aria-label="Carta de invitacion">
        <div className="verse-block">
          <div className="ornament">
            <Heart aria-hidden="true" />
          </div>
          <p>
            El que halla esposa halla el bien,
            <br />y alcanza la benevolencia de Jehova.
          </p>
          <span>Proverbios 18:22</span>
        </div>

        <div
          className="envelope-stage"
          role={isOpen ? undefined : "button"}
          tabIndex={isOpen ? -1 : 0}
          onClick={isOpen ? undefined : openInvitation}
          onKeyDown={(event) => {
            if (!isOpen && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault();
              openInvitation();
            }
          }}
          aria-label="Abrir carta de invitacion"
        >
          <div className="envelope">
            <div className="envelope-back" />
            <div className="envelope-paper-texture" />
            <div className="flap flap-top" />
            <div className="flap flap-left" />
            <div className="flap flap-right" />
            <div className="flap flap-bottom" />
            <EnvelopeDrawing />
            <div className="recipient">
              <span className="recipient-label">Para:</span>
              <span className="recipient-name">{guestName}</span>
              <span className="recipient-line" />
            </div>
            <WaxSeal />
          </div>
        </div>

        <button
          className="open-hint"
          type="button"
          onClick={openInvitation}
        >
          <span>Haz clic en el sello para abrir</span>
          <svg className="pencil-wave" viewBox="0 0 260 34" aria-hidden="true">
            <path d="M8 20 C36 4 55 33 84 18 S132 8 162 18 S212 30 252 10" />
          </svg>
        </button>
      </section>

      <section
        className="invitation-view"
        aria-hidden={!isOpen}
        aria-label="Detalles de la invitacion"
      >
        <WeddingCard musicEnabled={musicEnabled} onToggleMusic={toggleMusic} />
      </section>
    </main>
  );
}
