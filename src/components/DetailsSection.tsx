"use client";

import { Gift, Mail, MonitorPlay } from "lucide-react";
import Image from "next/image";

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
    icon: MonitorPlay,
    title: "Opción virtual",
    text: "Transferencia",
  },
];

export default function DetailsSection() {
  return (
    <section className="details-section" aria-labelledby="details-title">
      <div className="details-bg" aria-hidden="true">
        <Image src="/images/couple/_DSC1252.webp" alt="" fill sizes="100vw" className="details-bg-image" />
      </div>
      <div className="details-overlay" aria-hidden="true" />

      <div className="details-inner">
        <h2 id="details-title">Detalles</h2>

        <div className="details-card-grid">
          {detailCards.map(({ icon: Icon, title, text }) => (
            <article key={title} className="details-info-card">
              <Icon className="details-card-icon" aria-hidden="true" strokeWidth={1.4} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
