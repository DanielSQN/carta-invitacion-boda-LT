"use client";

import { useState } from "react";
import {
  CalendarDays,
  Gift,
  Heart,
  MapPin,
  MessageCircle,
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

function EnvelopeSprig({ side }: { side: "left" | "right" }) {
  return (
    <svg
      className={`envelope-sprig envelope-sprig-${side}`}
      viewBox="0 0 120 170"
      aria-hidden="true"
    >
      <path className="sprig-line" d="M55 160 C42 118 44 75 76 12" />
      <path className="sprig-line" d="M52 126 C31 115 20 99 15 75" />
      <path className="sprig-line" d="M61 96 C86 91 100 78 108 54" />
      <path className="sprig-line" d="M64 67 C43 59 30 45 23 24" />
      <ellipse cx="35" cy="112" rx="7" ry="18" transform="rotate(-48 35 112)" />
      <ellipse cx="24" cy="85" rx="6" ry="16" transform="rotate(-36 24 85)" />
      <ellipse cx="88" cy="88" rx="7" ry="18" transform="rotate(42 88 88)" />
      <ellipse cx="101" cy="62" rx="6" ry="16" transform="rotate(30 101 62)" />
      <ellipse cx="42" cy="54" rx="7" ry="17" transform="rotate(-42 42 54)" />
      <circle cx="58" cy="108" r="4" />
      <circle cx="66" cy="102" r="4" />
      <circle cx="54" cy="99" r="3.5" />
    </svg>
  );
}

function WeddingCard() {
  return (
    <div className="card-shell">
      <div className="card-heading">
        <span>Nuestra boda</span>
        <p>26 de septiembre</p>
        <h1>Luisa &amp; Tatian</h1>
        <p className="card-intro">
          Con la bendicion de Dios tenemos el honor de invitarte a nuestra boda
        </p>
      </div>

      <div className="card-details">
        <div className="event-grid">
          <article>
            <h2>Ceremonia</h2>
            <p>
              <CalendarDays aria-hidden="true" />
              5:00 PM
            </p>
            <p>
              <MapPin aria-hidden="true" />
              <span>
                Iglesia de la Unidad
                <br />
                Calle 123 #45 - 67
                <br />
                Ciudad
              </span>
            </p>
          </article>
          <article>
            <h2>Recepcion</h2>
            <p>
              <Gift aria-hidden="true" />
              7:30 PM
            </p>
            <p>
              <MapPin aria-hidden="true" />
              <span>
                Hacienda San Miguel
                <br />
                Km 12 via al Sol
                <br />
                Ciudad
              </span>
            </p>
          </article>
        </div>

        <div className="dress-code">
          <span>Vestimenta</span>
          <p>Formal / Elegante</p>
        </div>

        <a
          className="whatsapp-button"
          href="https://wa.me/?text=Confirmo%20mi%20asistencia%20a%20la%20boda%20de%20Luisa%20y%20Tatian"
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
    </div>
  );
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const openInvitation = () => setIsOpen(true);

  return (
    <main className={`wedding-page ${isOpen ? "invitation-open" : ""}`}>
      <BotanicalCorner side="left" />
      <BotanicalCorner side="right" />

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
            <div className="card-pocket">
              <WeddingCard />
            </div>
            <div className="flap flap-top" />
            <div className="flap flap-left" />
            <div className="flap flap-right" />
            <div className="flap flap-bottom" />
            <EnvelopeDrawing />
            <EnvelopeSprig side="left" />
            <EnvelopeSprig side="right" />
            <div className="wax-seal" aria-hidden="true">
              L&amp;T
            </div>
            <div className="recipient">
              Para: <span />
            </div>
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
    </main>
  );
}
