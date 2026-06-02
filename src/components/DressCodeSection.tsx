"use client";

import Image from "next/image";

const dressColors = ["#56799a", "#ffffff", "#071827", "#2c86c7", "#8ab7ce"];

export default function DressCodeSection() {
  return (
    <section className="dress-section" aria-labelledby="dress-title">
      <div className="dress-inner">
        <div className="dress-figure" aria-hidden="true">
          <Image src="/images/details/dress-code.webp" alt="" fill sizes="(max-width: 760px) 74vw, 28rem" className="dress-image" />
        </div>

        <div className="dress-copy">
          <span className="section-kicker">Vestimenta</span>
          <h2 id="dress-title">Código de vestimenta</h2>
          <p>Nos reservamos</p>

          <div className="dress-palette" aria-label="Paleta de colores reservados">
            {dressColors.map((color) => (
              <span key={color} className="dress-swatch" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
