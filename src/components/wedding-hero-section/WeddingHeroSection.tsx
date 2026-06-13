"use client";

import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Heart, User } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useEffect, useRef, useState } from "react";
import CelebrationSection from "../CelebrationSection";
import CountdownSection from "../CountdownSection";
import LiveBanner from "../LiveBanner";
import LiveStreamSection from "../LiveStreamSection";
import SectionFrameDecor from "../SectionFrameDecor";
import DetailsSection from "../DetailsSection";
import DressCodeSection from "../DressCodeSection";
import OurStorySection from "../OurStorySection";
import { createSectionReveal, getSectionScroller, prefersReducedMotion } from "../sectionFx";

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
      gsap.set(overlayRef.current, { opacity: reduceMotion ? 0.28 : 0 });
      gsap.set(glowRef.current, { opacity: reduceMotion ? 0.42 : 0 });
      gsap.set(fadeRef.current, { opacity: reduceMotion ? 0.92 : 0 });
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

      gsap
        .timeline({ delay: 0.06 })
        .to(overlayRef.current, { opacity: 0.28, duration: 1.35, ease: "sine.out" }, 0.12)
        .to(glowRef.current, { opacity: 0.42, duration: 1.45, ease: "sine.out" }, 0.3)
        .to(fadeRef.current, { opacity: 0.92, duration: 1.65, ease: "sine.out" }, 0.44)
        .to(contentRef.current, { opacity: 1, y: 0, duration: 1.35, ease: "power3.out" }, 0.28);

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

// Clave de localStorage para recordar la respuesta de esta invitación (?para=).
function getStoredRsvpKey(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  const para = (params.get("para") || params.get("invitado") || "").trim().toLowerCase();
  return para ? `rsvp:${para}` : null;
}

function AttendanceSection() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [guestNames, setGuestNames] = useState([""]);
  const [declineName, setDeclineName] = useState("");
  const [declineMessage, setDeclineMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const confirmInnerRef = useRef<HTMLDivElement>(null);
  const footerEnvelopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = getSectionScroller(sectionRef.current);

    const ctx = gsap.context(() => {
      createSectionReveal(sectionRef.current);

      if (prefersReducedMotion()) {
        return;
      }

      gsap.fromTo(
        footerEnvelopeRef.current,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerEnvelopeRef.current,
            start: "top 96%",
            toggleActions: "play none none none",
            ...(scroller ? { scroller } : {}),
          },
        },
      );

      // La seccion de confirmacion se encoge hacia el sobre al hacer scroll,
      // como si la carta se metiera dentro del sobre del footer.
      gsap.to(confirmInnerRef.current, {
        scale: 0.66,
        y: 22,
        autoAlpha: 0.28,
        ease: "none",
        transformOrigin: "bottom center",
        scrollTrigger: {
          trigger: confirmInnerRef.current,
          start: "bottom bottom-=120",
          end: "+=240",
          scrub: 0.6,
          ...(scroller ? { scroller } : {}),
        },
      });

      // Cierre: los nombres de los novios se "escriben" de izquierda a derecha.
      const names = sectionRef.current?.querySelector(".footer-letter-names");
      if (names) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".footer-letter-note",
              start: "top 82%",
              toggleActions: "play none none none",
              ...(scroller ? { scroller } : {}),
            },
          })
          .fromTo(
            names,
            { clipPath: "inset(0 100% 0 0)", opacity: 1 },
            { clipPath: "inset(0 0% 0 0)", duration: 1.05, ease: "power1.inOut" },
          )
          .fromTo(
            names,
            { scale: 1.07 },
            { scale: 1, duration: 0.5, ease: "back.out(2.6)", transformOrigin: "center bottom" },
            "-=0.22",
          );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // El alto del formulario cambia con el paso/cantidad: recalcular ScrollTrigger.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, [attending, guestCount, status]);

  // Si esta invitación (?para=) ya respondió antes en este dispositivo, se
  // pre-llena el formulario para que vea/edite lo que confirmó y vuelva a
  // enviar (el servidor reemplaza su registro, no crea duplicados).
  useEffect(() => {
    const key = getStoredRsvpKey();
    if (!key) {
      return;
    }

    try {
      const saved = window.localStorage.getItem(key);
      if (!saved) {
        return;
      }

      const data = JSON.parse(saved) as {
        attending: boolean;
        names?: string[];
        message?: string | null;
      };
      const names = Array.isArray(data.names) ? data.names.filter(Boolean) : [];

      queueMicrotask(() => {
        setAttending(data.attending);
        setAlreadyResponded(true);
        if (data.attending) {
          const list = names.length ? names : [""];
          setGuestCount(Math.min(list.length, 6));
          setGuestNames(list.slice(0, 6));
        } else {
          setDeclineName(names[0] ?? "");
          setDeclineMessage(data.message ?? "");
        }
      });
    } catch {
      // ignora datos corruptos
    }
  }, []);

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
      window.requestAnimationFrame(() => {
        sectionRef.current?.querySelector(".attendance-confirmed")?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "center",
        });
      });
    } catch {
      setStatus("error");
    }
  };

  const submitting = status === "submitting";

  return (
    <section ref={sectionRef} className="attendance-section finale-section" aria-labelledby="attendance-title">
      <SectionFrameDecor variant="attendance" />
      <div className="finale-section-bg finale-section-bg--attendance" aria-hidden="true" />
      <div ref={confirmInnerRef} className="finale-inner attendance-inner">
        <div className="finale-heading" data-reveal>
          <span>RSVP</span>
          <h2 id="attendance-title">Confirmar tu asistencia</h2>
          <p>Ayudanos a preparar cada detalle con amor.</p>
        </div>

        {status === "success" ? (
          <div className="attendance-form attendance-form--result" data-reveal>
            <div className="attendance-confirmed" role="status">
              <span className={`attendance-confirmed-icon${attending ? "" : " attendance-confirmed-icon--no"}`} aria-hidden="true">
                <Check strokeWidth={2.6} />
              </span>
              {attending ? (
                <>
                  <p>¡Gracias por confirmar{guestCount > 1 ? ` por ${guestCount} personas` : ""}!</p>
                  <span>Nos vemos el 26 de septiembre de 2026 ♥</span>
                </>
              ) : (
                <>
                  <p>Gracias por avisarnos 💛</p>
                  <span>Te vamos a extrañar. ¡Estarás en nuestros corazones!</span>
                </>
              )}
            </div>
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
          <form className="attendance-form" data-reveal onSubmit={handleSubmit}>
            <button type="button" className="attendance-back" onClick={() => setAttending(null)}>
              ‹ Cambiar respuesta
            </button>

            {alreadyResponded ? (
              <p className="attendance-prefilled">
                Ya habías respondido — aquí está lo que enviaste. Puedes editarlo y volver a enviar.
              </p>
            ) : null}

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
          </form>
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
    <motion.div
      className="paper-stack relative z-[8] mx-auto w-full bg-[#07111f] text-olive"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="wedding-hero-title"
    >
      <LiveBanner />
      <HeroSection />
      <CountdownSection />
      <CelebrationSection />
      <OurStorySection />
      <DressCodeSection />
      <DetailsSection />
      <LiveStreamSection />
      <AttendanceSection />
    </motion.div>
  );
}
