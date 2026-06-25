"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Copy, Gift, Mail } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { blurData } from "@/lib/blur";
import SectionFrameDecor from "./SectionFrameDecor";
import { createSectionReveal, getSectionScroller, prefersReducedMotion } from "@/lib/sectionFx";

gsap.registerPlugin(ScrollTrigger);

const virtualQrSrc = "/images/details/qr-transferencia.svg";
const brebKey = "@miBodaLT";

const detailCards = [
  {
    icon: Gift,
    title: "Tu presencia",
    text: "Más que cualquier obsequio, lo que de verdad anhelamos es tenerte a nuestro lado. Tu presencia es, sin duda, el regalo más grande que podríamos recibir.",
    wide: true,
  },
  {
    icon: Mail,
    title: "Lluvia de sobres",
    text: "Tu compañía ya lo es todo para nosotros. Si además deseas darnos un detalle, una lluvia de sobres el día del evento la recibiremos con el corazón.",
    wide: true,
  },
  {
    title: "Opción virtual",
    text: "Escanea el QR y transfiere desde tu celular.",
    qr: true,
    wide: true,
  },
];

export default function DetailsSection() {
  const [hasCopiedBrebKey, setHasCopiedBrebKey] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = getSectionScroller(sectionRef.current);

    const ctx = gsap.context(() => {
      createSectionReveal(sectionRef.current, { stagger: 0.16 });

      // Las tarjetas usan backdrop-filter: se revelan solo con transform
      // (sin opacity) para que el blur no "reviente" al final del fade.
      if (prefersReducedMotion()) {
        gsap.set(".details-info-card", { y: 0 });
        return;
      }

      gsap.fromTo(
        ".details-info-card",
        { y: 38 },
        {
          y: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none none",
            ...(scroller ? { scroller } : {}),
          },
        },
      );
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
        <Image
          src="/images/couple/_DSC1252.webp"
          alt=""
          fill
          sizes="100vw"
          quality={50}
          placeholder="blur"
          blurDataURL={blurData["couple/_DSC1252"]}
          className="details-bg-image"
        />
      </div>
      <div className="details-overlay" aria-hidden="true" />

      <div className="details-inner">
        <h2 id="details-title" data-reveal>
          Detalles
        </h2>

        <div className="details-card-grid">
          {detailCards.map(({ icon: Icon, qr, title, text, wide }) => (
            <article key={title} className={`details-info-card${wide ? " details-info-card--wide" : ""}`}>
              {qr ? (
                <>
                  <h3>{title}</h3>
                  <div className="details-qr-split">
                    <div className="details-qr-col details-qr-col--left">
                      <Image className="details-card-qr-image" src={virtualQrSrc} alt="QR para transferencia" width={148} height={148} />
                    </div>
                    <div className="details-qr-col details-qr-col--right">
                      <button className="details-card-qr-badge" type="button" onClick={copyBrebKey} aria-label="Copiar llave Bre-B @miBodaLT">
                        {hasCopiedBrebKey ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                        {hasCopiedBrebKey ? "Copiado" : `Llave: ${brebKey}`}
                      </button>
                      <p>{text}</p>
                    </div>
                  </div>
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
