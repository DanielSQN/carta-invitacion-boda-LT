"use client";

import Image from "next/image";
import SectionFrameDecor from "./SectionFrameDecor";

const dressColors = ["#56799a", "#ffffff", "#071827", "#2c86c7", "#8ab7ce"];

export default function DressCodeSection() {
  return (
    <section className="dress-section" aria-labelledby="dress-title">
      <SectionFrameDecor variant="dress" />
      <div className="dress-bg" aria-hidden="true">
        <Image src="/images/details/background-dress-code.webp" alt="" fill sizes="100vw" className="dress-bg-image" />
      </div>
      <div className="dress-overlay" aria-hidden="true" />

      <div className="dress-inner">
        <div className="dress-heading">
          <span className="section-kicker">Vestimenta</span>
          <h2 id="dress-title">Código de vestimenta</h2>
        </div>

        <div className="dress-column dress-column--attire">
          <div className="dress-figure" aria-hidden="true">
            <Image src="/images/details/dress-code.webp" alt="" fill sizes="(max-width: 760px) 74vw, 24rem" className="dress-image" />
          </div>
          <h3>Formal</h3>
        </div>

        <div className="dress-column dress-column--reserved">
          <h3>Nos reservamos</h3>
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
