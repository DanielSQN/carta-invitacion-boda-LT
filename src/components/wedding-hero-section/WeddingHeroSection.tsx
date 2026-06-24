"use client";

import { m } from "framer-motion";
import gsap from "gsap";
import { CalendarPlus, Check, Heart, Pencil, User, Users } from "lucide-react";
import Image from "next/image";
import { type CSSProperties, type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CelebrationSection from "../CelebrationSection";
import CountdownSection from "../CountdownSection";
import LiveStreamSection from "../LiveStreamSection";
import SectionFrameDecor from "../SectionFrameDecor";
import DetailsSection from "../DetailsSection";
import DressCodeSection from "../DressCodeSection";
import OurStorySection from "../OurStorySection";
import { createSectionReveal, getSectionScroller } from "../sectionFx";

function EditorialRule({ className = "" }: { className?: string }) {
  return (
    <svg className={`hero-rule-svg ${className}`} viewBox="0 0 214 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 10H86" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M128 10H210" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path
        d="M107 14.8C101.8 11.1 98.8 8.1 99.7 5.3C100.5 2.9 103.8 2.5 107 6.2C110.2 2.5 113.5 2.9 114.3 5.3C115.2 8.1 112.2 11.1 107 14.8Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Rama de laurel para el sello de confirmación. Se dibuja una vez y se refleja
// con CSS (scaleX) para el lado opuesto.
function LaurelBranch({ className = "" }: { className?: string }) {
  const leaves = [
    { cx: 27, cy: 66, rot: -58 },
    { cx: 21, cy: 56, rot: -50 },
    { cx: 16.5, cy: 45, rot: -40 },
    { cx: 13.5, cy: 34, rot: -28 },
    { cx: 13, cy: 23, rot: -15 },
    { cx: 15.5, cy: 12.5, rot: -2 },
  ];

  return (
    <svg className={`rsvp-laurel ${className}`} viewBox="0 0 34 74" fill="currentColor" aria-hidden="true" focusable="false">
      <path
        d="M30 72C16 58 11 32 21 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.85"
      />
      {leaves.map((leaf, index) => (
        <ellipse
          key={index}
          cx={leaf.cx}
          cy={leaf.cy}
          rx="5.4"
          ry="2.2"
          transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
        />
      ))}
    </svg>
  );
}

// Confeti que se dispara una sola vez al enviar el RSVP. "happy" (corazones de
// colores) al confirmar asistencia; "sad" (emojis tristes, caída más lenta y
// suave) cuando la persona indica que no podrá asistir.
function ConfettiBurst({ mood = "happy" }: { mood?: "happy" | "sad" }) {
  const [pieces] = useState(() => {
    const sad = mood === "sad";
    const symbols = sad ? ["😢", "🥺", "💔", "💧", "🤍"] : ["♥", "❀", "•", "♥"];
    const colors = ["#e0566a", "#5f8fb4", "#c6a24f", "#fffaf1"];
    const count = sad ? 30 : 48;

    return Array.from({ length: count }, (_, id) => ({
      id,
      left: Math.random() * 100,
      delay: Math.random() * (sad ? 1 : 0.8),
      duration: (sad ? 3.4 : 2.6) + Math.random() * 1.6,
      drift: (Math.random() - 0.5) * (sad ? 70 : 150),
      rotate: (Math.random() - 0.5) * (sad ? 160 : 720),
      size: (sad ? 1.1 : 0.85) + Math.random() * 0.9,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  });

  if (typeof document === "undefined") {
    return null;
  }

  // Portal a <body> para que el confeti quede sobre todo y no lo recorte el
  // overflow/stacking del contenedor de scroll del app-shell.
  return createPortal(
    <div className="rsvp-confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="rsvp-confetti-piece"
          style={
            {
              left: `${piece.left}%`,
              color: piece.color,
              fontSize: `${piece.size}rem`,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              "--confetti-drift": `${piece.drift}px`,
              "--confetti-rot": `${piece.rotate}deg`,
            } as CSSProperties
          }
        >
          {piece.symbol}
        </span>
      ))}
    </div>,
    document.body,
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const luisaRef = useRef<HTMLSpanElement>(null);
  const ampRef = useRef<HTMLSpanElement>(null);
  const jhonnatanRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, { scale: 1, force3D: true });
      // Mantiene continuidad con el wash azul de la transicion del sobre:
      // el hero ya nace con su tratamiento final y solo aparece el contenido.
      gsap.set(overlayRef.current, { opacity: 0.28 });
      gsap.set(glowRef.current, { opacity: 0.42 });
      gsap.set(fadeRef.current, { opacity: 0.92 });
      gsap.set(contentRef.current, { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 40 });

      if (luisaRef.current) luisaRef.current.textContent = reduceMotion ? "Luisa" : "";
      if (jhonnatanRef.current) jhonnatanRef.current.textContent = reduceMotion ? "Jhonnatan" : "";

      if (reduceMotion) {
        gsap.set([introRef.current, ampRef.current, dateRef.current], {
          opacity: 1,
          y: 0,
        });
        gsap.set(cursorRef.current, { opacity: 0 });
        window.setTimeout(() => window.dispatchEvent(new Event("hero-intro-complete")), 350);
        return undefined;
      }

      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        delay: 0.18,
        duration: 1.15,
        ease: "power3.out",
      });

      const typeText = (element: HTMLSpanElement | null, text: string, duration: number) => {
        if (!element) return gsap.timeline();

        const proxy = { count: 0 };
        return gsap.to(proxy, {
          count: text.length,
          duration,
          ease: "none",
          onStart: () => {
            element.textContent = "";
          },
          onUpdate: () => {
            element.textContent = text.slice(0, Math.round(proxy.count));
          },
          onComplete: () => {
            element.textContent = text;
          },
        });
      };

      gsap
        .timeline({ delay: 0.45 })
        .fromTo(introRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.72, ease: "power2.out" })
        .set(cursorRef.current, { opacity: 1 }, ">-0.08")
        .add(typeText(luisaRef.current, "Luisa", 0.82), ">")
        .fromTo(ampRef.current, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.48, ease: "power2.out" }, ">+0.16")
        .add(typeText(jhonnatanRef.current, "Jhonnatan", 1.15), ">+0.14")
        .fromTo(dateRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.78, ease: "power2.out" }, ">+0.18")
        .call(() => window.dispatchEvent(new Event("hero-intro-complete")), [], ">+0.05")
        .to(cursorRef.current, { opacity: 0.18, duration: 0.72, repeat: -1, yoyo: true, ease: "sine.inOut" }, ">");

      // Zoom-in al hacer scroll. Arranca en scale 1 para que la foto del hero
      // coincida 1:1 con la foto de la transicion del sobre.
      const scroller = getSectionScroller(heroRef.current);
      gsap.fromTo(
        imageRef.current,
        { scale: 1, yPercent: 0, transformOrigin: "50% 30%" },
        {
          scale: 1.16,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
            ...(scroller ? { scroller } : {}),
          },
        },
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero" aria-labelledby="wedding-hero-title">
      <div className="hero-sticky">
        <div ref={imageRef} className="hero-image" aria-hidden="true" />
        <div ref={overlayRef} className="hero-overlay" aria-hidden="true" />
        <div ref={glowRef} className="hero-glow" aria-hidden="true" />
        <div ref={fadeRef} className="hero-fade" aria-hidden="true" />

        <div ref={contentRef} className="hero-content">
          <p ref={introRef} className="hero-kicker">
            <EditorialRule />
            <span>¡Nos casamos!</span>
            <EditorialRule className="hero-rule-svg--reverse" />
          </p>

          <h1 id="wedding-hero-title" className="hero-title" aria-label="Luisa y Jhonnatan">
            <span className="hero-name-slot hero-name-slot--luisa">
              <span ref={luisaRef} />
            </span>
            <span className="hero-title-middle">
              <EditorialRule className="hero-amp-rule" />
              <span ref={ampRef} className="hero-amp">
                &amp;
              </span>
              <EditorialRule className="hero-amp-rule hero-rule-svg--reverse" />
            </span>
            <span className="hero-name-slot hero-name-slot--jhonnatan">
              <span ref={jhonnatanRef} />
              <span ref={cursorRef} className="hero-type-cursor" aria-hidden="true" />
            </span>
          </h1>

          <p ref={dateRef} className="hero-date">
            26 <span>SEP</span> 2026
          </p>
        </div>
      </div>
    </section>
  );
}

type SavedRsvp = {
  attending: boolean;
  guestCount?: number;
  names?: string[];
  message?: string | null;
};

type RsvpLookupResponse = {
  ok: boolean;
  persisted?: boolean;
  rsvp?: SavedRsvp | null;
};

function getInvitationParam(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const para = (params.get("para") || params.get("invitado") || "").trim();
  return para || null;
}

// Clave de localStorage para recordar la respuesta de esta invitación (?para=).
function getStoredRsvpKey(): string | null {
  const para = getInvitationParam()?.toLowerCase();
  return para ? `rsvp:${para}` : null;
}

const googleCalendarUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda%20Luisa%20%26%20Tattan&dates=20260926T200000Z/20260927T050000Z&details=Celebramos%20nuestra%20boda%20con%20ustedes.&location=Hacienda%20Santa%20Elena%2C%20Cota%2C%20Cundinamarca";
const icsCalendarUrl = "/boda-luisa-jhonnatan.ics";

function AttendanceSection() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [guestNames, setGuestNames] = useState([""]);
  const [declineName, setDeclineName] = useState("");
  const [declineMessage, setDeclineMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [calendarHref, setCalendarHref] = useState(googleCalendarUrl);
  const [isIcsCalendar, setIsIcsCalendar] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const confirmInnerRef = useRef<HTMLDivElement>(null);
  const footerEnvelopeRef = useRef<HTMLDivElement>(null);

  const applySavedRsvp = useCallback((data: SavedRsvp) => {
    const names = Array.isArray(data.names) ? data.names.map((name) => name.trim()).filter(Boolean) : [];

    setAttending(data.attending);
    setAlreadyResponded(true);

    if (data.attending) {
      const savedGuestCount = data.guestCount ?? names.length;
      const count = Math.min(Math.max(savedGuestCount || 1, 1), 6);
      setGuestCount(count);
      setGuestNames(Array.from({ length: count }, (_, index) => names[index] ?? ""));
      return;
    }

    setDeclineName(names[0] ?? "");
    setDeclineMessage(data.message ?? "");
  }, []);

  // Revelado suave del formulario; el footer queda siempre visible (sin animar).
  useEffect(() => {
    const ctx = gsap.context(() => {
      createSectionReveal(sectionRef.current);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // En iOS el botón "Agregar al calendario" abre el .ics (Apple Calendar); en
  // Android/escritorio abre Google Calendar.
  useEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);

    if (isIOS) {
      queueMicrotask(() => {
        setCalendarHref(icsCalendarUrl);
        setIsIcsCalendar(true);
      });
    }
  }, []);

  // Si esta invitación (?para=) ya respondió, se consulta primero el servidor.
  // localStorage queda solo como respaldo para vista previa sin Supabase.
  useEffect(() => {
    const readLocalRsvp = () => {
      const key = getStoredRsvpKey();

      if (!key) {
        return null;
      }

      try {
        const saved = window.localStorage.getItem(key);
        return saved ? (JSON.parse(saved) as SavedRsvp) : null;
      } catch {
        return null;
      }
    };

    const key = getStoredRsvpKey();
    const invitedAs = getInvitationParam();

    if (!key && !invitedAs) {
      return;
    }

    if (!invitedAs) {
      const localRsvp = readLocalRsvp();

      if (localRsvp) {
        queueMicrotask(() => applySavedRsvp(localRsvp));
      }

      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const loadExistingRsvp = async () => {
      try {
        const response = await fetch(`/api/rsvp?invitedAs=${encodeURIComponent(invitedAs)}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("lookup failed");
        }

        const result = (await response.json()) as RsvpLookupResponse;

        if (cancelled) {
          return;
        }

        if (result.rsvp) {
          applySavedRsvp(result.rsvp);
          return;
        }

        if (result.persisted === false) {
          const localRsvp = readLocalRsvp();

          if (localRsvp) {
            applySavedRsvp(localRsvp);
          }
        }
      } catch {
        if (cancelled) {
          return;
        }

        const localRsvp = readLocalRsvp();

        if (localRsvp) {
          applySavedRsvp(localRsvp);
        }
      }
    };

    void loadExistingRsvp();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [applySavedRsvp]);

  const updateGuestCount = (value: number) => {
    const nextValue = Math.min(Math.max(value, 1), 6);
    setGuestCount(nextValue);
    setGuestNames((names) => Array.from({ length: nextValue }, (_, index) => names[index] ?? ""));
  };

  const updateGuestName = (index: number, value: string) => {
    setGuestNames((names) => names.map((name, nameIndex) => (nameIndex === index ? value : name)));
  };

  const chooseAttending = (value: boolean) => {
    setAttending(value);
    setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    const params = new URLSearchParams(window.location.search);
    const invitedAs = params.get("para") || params.get("invitado") || null;
    const names = attending ? guestNames.map((name) => name.trim()).filter(Boolean) : [declineName.trim()].filter(Boolean);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attending,
          guestCount: attending ? guestCount : 0,
          names,
          invitedAs,
          message: attending ? null : declineMessage.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("submit failed");
      }

      // Recuerda la respuesta en este dispositivo para pre-llenar si reabre.
      const key = getStoredRsvpKey();
      if (key) {
        try {
          window.localStorage.setItem(
            key,
            JSON.stringify({ attending, names, message: attending ? null : declineMessage.trim() || null }),
          );
        } catch {
          // sin almacenamiento disponible: no es crítico
        }
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const submitting = status === "submitting";

  // La misma pantalla de confirmación se muestra justo al enviar el formulario
  // y cuando esta invitación vuelve a entrar habiendo respondido antes.
  const showConfirmation = status === "success" || (alreadyResponded && !editing);

  const startEditing = () => {
    setStatus("idle");
    setEditing(true);

    // Si había confirmado que SÍ, va directo al formulario de asistentes (para
    // ajustar cantidad/nombres). Si había declinado, vuelve a la pregunta
    // inicial (sí/no) por si ahora quiere cambiar a "sí".
    if (!attending) {
      setAttending(null);
    }
  };

  return (
    <section ref={sectionRef} className="attendance-section finale-section" aria-labelledby="attendance-title">
      <SectionFrameDecor variant="attendance" />
      <div className="finale-section-bg finale-section-bg--attendance" aria-hidden="true" />
      <div ref={confirmInnerRef} className="finale-inner attendance-inner">
        <div className="finale-heading" data-reveal>
          <span>RSVP</span>
          {showConfirmation ? (
            <h2 id="attendance-title" className="sr-only">
              Confirmación de asistencia
            </h2>
          ) : (
            <>
              <h2 id="attendance-title">Confirmar tu asistencia</h2>
              <p>Ayudanos a preparar cada detalle con amor.</p>
            </>
          )}
        </div>

        {showConfirmation ? (
          <div className="rsvp-done" data-reveal>
            {status === "success" ? <ConfettiBurst mood={attending ? "happy" : "sad"} /> : null}
            <div className={`rsvp-done-badge${attending ? "" : " rsvp-done-badge--no"}`} role="status">
              <LaurelBranch className="rsvp-laurel--left" />
              <span className="rsvp-done-check" aria-hidden="true">
                {attending ? <Check strokeWidth={2.8} /> : <Heart strokeWidth={2.4} />}
              </span>
              <LaurelBranch className="rsvp-laurel--right" />
            </div>

            <h3 className="rsvp-done-title">{attending ? "¡Gracias por confirmar!" : "Gracias por avisarnos"}</h3>
            <p className="rsvp-done-subtitle">
              {attending
                ? "Tu respuesta nos ayuda a seguir preparando este día tan especial."
                : "Te vamos a extrañar. Estarás en nuestros corazones."}
            </p>

            <div className="rsvp-done-card">
              <div className="rsvp-done-row">
                <span className="rsvp-done-row-icon" aria-hidden="true">
                  {attending ? <Users strokeWidth={1.9} /> : <Heart strokeWidth={1.9} />}
                </span>
                <span className="rsvp-done-row-text">
                  {attending
                    ? `Asistirán ${guestCount} ${guestCount === 1 ? "persona" : "personas"}`
                    : "Lamentamos que no puedas asistir"}
                </span>
              </div>
              {attending ? (
                <div className="rsvp-done-row">
                  <span className="rsvp-done-row-icon" aria-hidden="true">
                    <CalendarPlus strokeWidth={1.9} />
                  </span>
                  <span className="rsvp-done-row-text">26 de septiembre de 2026</span>
                </div>
              ) : null}
            </div>

            <div className="rsvp-done-actions">
              {attending ? (
                <a
                  className="rsvp-done-action rsvp-done-action--primary"
                  href={calendarHref}
                  {...(isIcsCalendar ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <CalendarPlus aria-hidden="true" strokeWidth={1.9} />
                  Agregar al calendario
                </a>
              ) : null}
              <button type="button" className="rsvp-done-action rsvp-done-action--ghost" onClick={startEditing}>
                <Pencil aria-hidden="true" strokeWidth={1.9} />
                Modificar respuesta
              </button>
            </div>

            <p className="rsvp-done-footer">
              {attending ? "Nos vemos pronto " : "Con cariño "}
              <span aria-hidden="true">♥</span>
            </p>
          </div>
        ) : attending === null ? (
          <div className="attendance-form attendance-choice" data-reveal>
            <p className="attendance-hint">¿Nos acompañarás en este gran día?</p>
            <div className="attendance-choice-buttons">
              <button type="button" className="attendance-choice-btn attendance-choice-btn--yes" onClick={() => chooseAttending(true)}>
                <Heart aria-hidden="true" strokeWidth={2.2} />
                ¡Sí, allí estaré!
              </button>
              <button type="button" className="attendance-choice-btn attendance-choice-btn--no" onClick={() => chooseAttending(false)}>
                No podré asistir
              </button>
            </div>
          </div>
        ) : (
          <div className="attendance-edit" data-reveal>
            <button type="button" className="attendance-back" onClick={() => setAttending(null)}>
              ‹ Cambiar respuesta
            </button>

            <form className="attendance-form" onSubmit={handleSubmit}>
            {attending ? (
              <>
                <p className="attendance-hint">
                  ¡Qué alegría! Cuéntanos <strong>cuántos asistirán</strong> y sus nombres.
                </p>

                <div className="attendance-step">
                  <div className="attendance-step-head">
                    <span className="attendance-step-number" aria-hidden="true">
                      1
                    </span>
                    <span className="attendance-step-title">¿Cuántas personas asisten?</span>
                  </div>

                  <div className="attendance-stepper" role="group" aria-label="Cantidad de asistentes">
                    <button
                      type="button"
                      onClick={() => updateGuestCount(guestCount - 1)}
                      disabled={guestCount <= 1}
                      aria-label="Disminuir cantidad de asistentes"
                    >
                      −
                    </button>
                    <output aria-live="polite" aria-label={`${guestCount} asistentes`}>
                      {guestCount}
                      <small>{guestCount === 1 ? "persona" : "personas"}</small>
                    </output>
                    <button
                      type="button"
                      onClick={() => updateGuestCount(guestCount + 1)}
                      disabled={guestCount >= 6}
                      aria-label="Aumentar cantidad de asistentes"
                    >
                      +
                    </button>
                  </div>

                  <p className="attendance-step-note">Incluyete a ti y a tus acompañantes (máximo 6).</p>
                </div>

                <div className="attendance-step">
                  <div className="attendance-step-head">
                    <span className="attendance-step-number" aria-hidden="true">
                      2
                    </span>
                    <span className="attendance-step-title">¿Quiénes asisten?</span>
                  </div>

                  <div className="attendance-name-grid">
                    {guestNames.map((name, index) => (
                      <label key={index} className="attendance-field">
                        <span>{index === 0 ? "Tu nombre" : `Acompañante ${index}`}</span>
                        <span className="attendance-input-wrap">
                          <User aria-hidden="true" strokeWidth={2} />
                          <input
                            type="text"
                            value={name}
                            onChange={(event) => updateGuestName(index, event.target.value)}
                            placeholder="Nombre completo"
                            required
                          />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="attendance-hint">
                  Lamentamos que no puedas acompañarnos. <strong>¿Nos dejas tu nombre?</strong>
                </p>

                <div className="attendance-step">
                  <label className="attendance-field">
                    <span>Tu nombre</span>
                    <span className="attendance-input-wrap">
                      <User aria-hidden="true" strokeWidth={2} />
                      <input
                        type="text"
                        value={declineName}
                        onChange={(event) => setDeclineName(event.target.value)}
                        placeholder="Nombre completo"
                        required
                      />
                    </span>
                  </label>

                  <label className="attendance-field attendance-field--message">
                    <span>Un mensaje para los novios (opcional)</span>
                    <textarea
                      value={declineMessage}
                      onChange={(event) => setDeclineMessage(event.target.value)}
                      placeholder="Les deseo lo mejor…"
                      rows={3}
                      maxLength={500}
                    />
                  </label>
                </div>
              </>
            )}

            {status === "error" ? (
              <p className="attendance-error" role="alert">
                Hubo un problema al enviar. Intenta de nuevo.
              </p>
            ) : null}

            <button className="attendance-submit" type="submit" disabled={submitting}>
              {attending ? <Heart aria-hidden="true" strokeWidth={2.2} /> : null}
              {submitting ? "Enviando…" : attending ? "Confirmar asistencia" : "Enviar respuesta"}
            </button>

            <p className="attendance-privacy">Tu respuesta es confidencial y segura.</p>
            </form>
          </div>
        )}
      </div>

      <div ref={footerEnvelopeRef} className="footer-letter">
        <div className="footer-envelope">
          <blockquote className="footer-letter-note">
            <cite className="footer-letter-ref">1 Tesalonicenses 3:12 · NVI</cite>
            <p className="footer-letter-verse">
              &ldquo;Que el Se&ntilde;or los haga crecer para que se amen m&aacute;s y m&aacute;s unos a otros, y a todos, tal como
              nosotros los amamos a ustedes.&rdquo;
            </p>
            <p className="footer-letter-sign">
              Con amor <span className="footer-letter-heart" aria-hidden="true">♥</span>
              <span className="footer-letter-names">Luisa &amp; Jhonnatan</span>
            </p>
          </blockquote>

          <div className="footer-envelope-front" aria-hidden="true">
            <span className="footer-envelope-seal">
              <Image src="/images/ui/wax-seal.webp?v=20260601-assets-1" alt="" fill sizes="96px" className="object-contain" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WeddingHeroSection() {
  return (
    <m.div
      className="paper-stack relative z-[8] mx-auto w-full bg-[#07111f] text-olive"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="wedding-hero-title"
    >
      <HeroSection />
      <CountdownSection />
      <CelebrationSection />
      <OurStorySection />
      <DressCodeSection />
      <DetailsSection />
      <LiveStreamSection />
      <AttendanceSection />
    </m.div>
  );
}
