"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Accesos rápidos a las secciones. El scroll vive en el contenedor fijo del
// app-shell (.details-scroll), así que tanto la visibilidad como el salto a cada
// sección se calculan contra ese contenedor (no el documento).
const NAV_ITEMS: Array<{ label: string; selector: string }> = [
  { label: "Inicio", selector: ".hero" },
  { label: "Cuenta regresiva", selector: ".countdown-section" },
  { label: "Celebración", selector: ".celebration-section" },
  { label: "Nuestra historia", selector: ".story-section" },
  { label: "Vestimenta", selector: ".dress-section" },
  { label: "Detalles", selector: ".details-section" },
  { label: "Confirmar", selector: ".attendance-section" },
];

export default function SectionNav() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    // Cierra el panel con Escape y devuelve el foco al botón del menú.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>(".details-scroll");

    if (!scroller) {
      return;
    }

    // El botón aparece al pasar el hero (más del ~65% del alto de pantalla) y,
    // una vez visible, ya no se vuelve a ocultar (se deja de escuchar el scroll).
    const onScroll = () => {
      if (scroller.scrollTop > window.innerHeight * 0.65) {
        show();
      }
    };

    const show = () => {
      setVisible(true);
      scroller.removeEventListener("scroll", onScroll);
    };

    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });

    // Si esta invitación ya respondió, el menú aparece de una vez: quien
    // vuelve suele venir a consultar datos (lugar, hora, vestimenta) y el
    // menú es su atajo. Dos señales: la respuesta guardada en este navegador
    // (mismo dispositivo, inmediata) y el aviso del formulario cuando el
    // servidor confirma la respuesta (otro dispositivo).
    try {
      const params = new URLSearchParams(window.location.search);
      const para = (params.get("para") || params.get("invitado") || "").trim().toLowerCase();

      if (para && window.localStorage.getItem(`rsvp:${para}`)) {
        show();
      }
    } catch {
      // sin almacenamiento disponible: queda el aviso del servidor
    }

    window.addEventListener("rsvp-already-responded", show);

    // El hero se carga de forma diferida: se reintenta hasta que existan las
    // secciones para conectar el observer que marca la sección activa.
    let observer: IntersectionObserver | undefined;
    let raf = 0;
    let attempts = 0;

    const attach = () => {
      const sections = NAV_ITEMS.map((item) => document.querySelector<HTMLElement>(item.selector)).filter(
        (el): el is HTMLElement => Boolean(el),
      );

      if (sections.length < NAV_ITEMS.length) {
        attempts += 1;
        if (attempts < 180) {
          raf = window.requestAnimationFrame(attach);
        }
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          const top = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (top?.target) {
            const match = NAV_ITEMS.find((item) => (top.target as HTMLElement).matches(item.selector));
            if (match) {
              setActive(match.selector);
            }
          }
        },
        { root: scroller, rootMargin: "-45% 0px -45% 0px", threshold: 0 },
      );

      sections.forEach((section) => observer?.observe(section));
    };

    attach();

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("rsvp-already-responded", show);
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
      observer?.disconnect();
    };
  }, []);

  const goTo = (selector: string) => {
    const scroller = document.querySelector<HTMLElement>(".details-scroll");
    const target = document.querySelector<HTMLElement>(selector);

    setOpen(false);

    if (!scroller || !target) {
      return;
    }

    const top =
      target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;

    scroller.scrollTo({ top: Math.max(top - 2, 0), behavior: "smooth" });
  };

  return (
    <div className={`section-nav${visible ? " section-nav--visible" : ""}`}>
      <button
        ref={toggleRef}
        type="button"
        className="section-nav-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Cerrar menú de secciones" : "Abrir menú de secciones"}
        tabIndex={visible ? 0 : -1}
      >
        {open ? <X strokeWidth={2} aria-hidden="true" /> : <Menu strokeWidth={2} aria-hidden="true" />}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="section-nav-backdrop"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <nav className="section-nav-panel" aria-label="Secciones de la invitación">
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.selector}>
                  <button
                    type="button"
                    className={`section-nav-item${active === item.selector ? " section-nav-item--active" : ""}`}
                    onClick={() => goTo(item.selector)}
                    aria-current={active === item.selector ? "true" : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  );
}
