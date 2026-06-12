"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Copy, Gift, Mail } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SectionFrameDecor from "./SectionFrameDecor";
import { createSectionReveal } from "./sectionFx";

gsap.registerPlugin(ScrollTrigger);

const virtualQrSrc = "/images/details/qr-transferencia.svg";
const brebKey = "@miBodaLT";

const detailCards = [
  {
    icon: Gift,
    title: "Tu presencia",
    text: "Compartir este día contigo es el regalo que más nos ilusiona",
    wide: true,
  },
  {
    title: "Opción virtual",
    text: "Escanea el QR y transfiere desde tu celular",
    qr: true,
  },
  {
    icon: Mail,
    title: "Lluvia de sobres",
    text: "Tu cariño en un sobre, el día del evento",
  },
];

export default function DetailsSection() {
  const [hasCopiedBrebKey, setHasCopiedBrebKey] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      createSectionReveal(sectionRef.current, { stagger: 0.16 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const copyBrebKey = async () => {
    try {
      await navigator.clipboard.writeText(brebKey);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = brebKey;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    setHasCopiedBrebKey(true);
    window.setTimeout(() => setHasCopiedBrebKey(false), 1800);
  };

  return (
    <section ref={sectionRef} className="details-section" aria-labelledby="details-title">
      <SectionFrameDecor variant="details" />
      <div ref={bgRef} className="details-bg" aria-hidden="true">
        <Image src="/images/couple/_DSC1252.webp" alt="" fill sizes="100vw" className="details-bg-image" />
      </div>
      <div className="details-overlay" aria-hidden="true" />

      <div className="details-inner">
        <h2 id="details-title" data-reveal>
          Detalles
        </h2>

        <div className="details-card-grid">
          {detailCards.map(({ icon: Icon, qr, title, text, wide }) => (
            <article key={title} className={`details-info-card${wide ? " details-info-card--wide" : ""}`} data-reveal>
              {qr ? (
                <>
                  <h3>{title}</h3>
                  <div className="details-card-qr-block" aria-label="QR llave Bre-B">
                    <Image className="details-card-qr-image" src={virtualQrSrc} alt="QR para transferencia" width={148} height={148} />
                    <button className="details-card-qr-badge" type="button" onClick={copyBrebKey} aria-label="Copiar llave Bre-B @miBodaLT">
                      {hasCopiedBrebKey ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                      {hasCopiedBrebKey ? "Copiado" : `Llave: ${brebKey}`}
                    </button>
                  </div>
                  <p>{text}</p>
                </>
              ) : (
                <>
                  {Icon ? <Icon className="details-card-icon" aria-hidden="true" strokeWidth={1.4} /> : null}
                  <h3>{title}</h3>
                  <p>{text}</p>
                </>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
