"use client";

import { Check, Copy, Gift, Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const virtualQrSrc = "/images/details/qr-transferencia.svg";
const brebKey = "@miBodaLT";

const detailCards = [
  {
    icon: Gift,
    title: "Tu presencia",
    text: "Es nuestro mejor regalo",
  },
  {
    icon: Mail,
    title: "Lluvia de sobres",
    text: "En el evento",
  },
  {
    title: "Opción virtual",
    text: "Transferencia",
    qr: true,
  },
];

export default function DetailsSection() {
  const [hasCopiedBrebKey, setHasCopiedBrebKey] = useState(false);

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
    <section className="details-section" aria-labelledby="details-title">
      <div className="details-bg" aria-hidden="true">
        <Image src="/images/couple/_DSC1252.webp" alt="" fill sizes="100vw" className="details-bg-image" />
      </div>
      <div className="details-overlay" aria-hidden="true" />

      <div className="details-inner">
        <h2 id="details-title">Detalles</h2>

        <div className="details-card-grid">
          {detailCards.map(({ icon: Icon, qr, title, text }) => (
            <article key={title} className="details-info-card">
              {qr ? (
                <div className="details-card-qr-block" aria-label="QR llave Bre-B">
                  <span className="details-card-qr-label">QR llave Bre-B</span>
                  <Image className="details-card-qr-image" src={virtualQrSrc} alt="QR para transferencia" width={148} height={148} />
                  <button className="details-card-qr-badge" type="button" onClick={copyBrebKey} aria-label="Copiar llave Bre-B @miBodaLT">
                    {hasCopiedBrebKey ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                    {hasCopiedBrebKey ? "Copiado" : `Llave: ${brebKey}`}
                  </button>
                </div>
              ) : (
                Icon && <Icon className="details-card-icon" aria-hidden="true" strokeWidth={1.4} />
              )}
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
