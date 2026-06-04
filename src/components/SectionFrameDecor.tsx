"use client";

import Image from "next/image";

type SectionFrameDecorProps = {
  variant: "countdown" | "celebration" | "story" | "dress" | "details" | "memories" | "attendance";
};

const floralAssets = {
  cornerTop: "/images/florals/generated/blue-breath-corner-top.webp",
  cornerBottom: "/images/florals/generated/blue-breath-corner-bottom.webp",
  sprig: "/images/florals/generated/blue-breath-sprig.webp",
};

export default function SectionFrameDecor({ variant }: SectionFrameDecorProps) {
  return (
    <div className={`section-frame-decor section-frame-decor--${variant}`} aria-hidden="true">
      <div className="section-gold-frame">
        <span className="section-frame-heart section-frame-heart--top">♥</span>
        <span className="section-frame-heart section-frame-heart--bottom">♥</span>
      </div>

      <div className="section-blue-florals">
        <Image
          src={floralAssets.cornerTop}
          alt=""
          width={691}
          height={760}
          className="section-blue-floral section-blue-floral--corner-top"
        />
        <Image
          src={floralAssets.sprig}
          alt=""
          width={507}
          height={760}
          className="section-blue-floral section-blue-floral--sprig"
        />
        <Image
          src={floralAssets.cornerBottom}
          alt=""
          width={507}
          height={760}
          className="section-blue-floral section-blue-floral--corner-bottom"
        />
      </div>
    </div>
  );
}
