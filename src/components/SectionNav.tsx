"use client";

import { useEffect, useState } from "react";

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
  { label: "En vivo", selector: ".live-section" },
  { label: "Confirmar", selector: ".attendance-section" },
];

export default function SectionNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>(".details-scroll");

    if (!scroller) {
      return;
    }

    // Aparece al pasar el hero (más del ~65% del alto de pantalla).
    const onScroll = () => setVisible(scroller.scrollTop > window.innerHeight * 0.65);
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });

    // El hero se carga de forma diferida, así que las secciones aparecen después
    // de montarse este menú: se reintenta hasta que existan para conectar el
    // observer que marca la sección activa (la que cruza el centro del viewport).
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
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
      observer?.disconnect();
    };
  }, []);

  const goTo = (selector: string) => {
    const scroller = document.querySelector<HTMLElement>(".details-scroll");
    const target = document.querySelector<HTMLElement>(selector);

    if (!scroller || !target) {
      return;
    }

    const top =
      target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;

    scroller.scrollTo({ top: Math.max(top - 2, 0), behavior: "smooth" });
  };

  return (
    <nav className={`section-nav${visible ? " section-nav--visible" : ""}`} aria-label="Secciones de la invitación" aria-hidden={!visible}>
      <ul className="section-nav-list">
        {NAV_ITEMS.map((item) => (
          <li key={item.selector}>
            <button
              type="button"
              className={`section-nav-link${active === item.selector ? " section-nav-link--active" : ""}`}
              onClick={() => goTo(item.selector)}
              tabIndex={visible ? 0 : -1}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
