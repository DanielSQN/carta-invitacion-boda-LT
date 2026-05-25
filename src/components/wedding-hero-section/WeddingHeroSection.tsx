"use client";

import { motion } from "framer-motion";
import { CalendarHeart, ChevronsDown, Clock3, MapPin } from "lucide-react";
import Image from "next/image";

const assetVersion = "20260525-wedding-hero-3";

const fadeUp = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const smoothTransition = {
  duration: 0.78,
  ease: [0.22, 1, 0.36, 1] as const,
};

function LTLogo() {
  return (
    <motion.div
      className="wedding-hero-logo relative mx-auto h-14 w-28"
      variants={fadeUp}
      transition={{ ...smoothTransition, delay: 0.12 }}
    >
      <Image
        src={`/images/lt-logo.webp?v=${assetVersion}`}
        alt="L&T"
        fill
        priority
        sizes="112px"
        className="object-contain drop-shadow-[0_8px_14px_rgba(139,100,41,0.14)]"
      />
    </motion.div>
  );
}

function FloralTopDecorations() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[21dvh] min-h-28 overflow-hidden" aria-hidden="true">
      <Image
        src={`/images/floral-top.webp?v=${assetVersion}`}
        alt=""
        width={360}
        height={240}
        priority
        className="absolute -left-24 -top-16 w-64 rotate-[-8deg] object-contain opacity-95"
      />
      <Image
        src={`/images/floral-top.webp?v=${assetVersion}`}
        alt=""
        width={360}
        height={240}
        priority
        className="absolute -right-24 -top-16 w-64 rotate-[8deg] scale-x-[-1] object-contain opacity-92"
      />
    </div>
  );
}

function DecorativeHeartRule() {
  return (
    <div className="mx-auto flex w-full max-w-[285px] items-center justify-center gap-3 text-soft-gold" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-soft-gold/80 to-soft-gold" />
      <span className="relative grid size-6 place-items-center">
        <span className="absolute size-5 rotate-45 rounded-[6px] border border-soft-gold/65" />
        <span className="font-serif text-lg leading-none">♡</span>
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-soft-gold/80 to-soft-gold" />
    </div>
  );
}

function WeddingTitleBlock() {
  return (
    <div className="relative z-[4] text-center">
      <LTLogo />

      <motion.div
        className="wedding-logo-divider relative mx-auto -mt-1 h-8 w-28"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.22 }}
      >
        <Image
          src={`/images/floral-divider-horizontal.webp?v=${assetVersion}`}
          alt=""
          fill
          sizes="112px"
          className="object-contain opacity-75"
        />
      </motion.div>

      <motion.h1
        id="wedding-hero-title"
        className="wedding-hero-title mt-2 whitespace-nowrap font-script text-[clamp(3.35rem,15.8vw,5.35rem)] leading-[0.84] text-olive drop-shadow-[0_2px_0_rgba(255,252,244,0.72)]"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.36 }}
      >
        Nuestra Boda
      </motion.h1>

      <motion.div
        className="wedding-heart-rule mt-5"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.5 }}
      >
        <DecorativeHeartRule />
      </motion.div>

      <motion.div
        className="wedding-date-block mt-4 text-center"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.62 }}
      >
        <CalendarHeart className="wedding-info-icon mx-auto mb-1.5 size-7 text-soft-gold" strokeWidth={1.55} />
        <p className="wedding-hero-date whitespace-nowrap font-display text-[clamp(2.25rem,10.6vw,3.5rem)] font-medium leading-none tracking-[0.04em] text-olive">
          26 <span className="text-soft-gold">·</span> 09 <span className="text-soft-gold">·</span> 26
        </p>
      </motion.div>
    </div>
  );
}

function WeddingInfoBlock() {
  return (
    <motion.div
      className="wedding-info-block relative z-[4] mx-auto mt-5 grid w-full max-w-[350px] grid-cols-[1fr_auto_1fr] items-center gap-4 text-center"
      variants={fadeUp}
      transition={{ ...smoothTransition, delay: 0.76 }}
    >
      <div className="min-w-0 px-1">
        <MapPin className="wedding-info-icon mx-auto mb-2 size-7 text-soft-gold" strokeWidth={1.65} />
        <p className="wedding-place-name text-[0.98rem] font-semibold leading-tight text-olive">Jardín Las Bugambilias</p>
        <p className="wedding-place-city mt-1 text-[0.9rem] leading-tight text-olive/85">Guadalajara, Jalisco</p>
      </div>

      <div className="wedding-info-separator h-20 w-px bg-gradient-to-b from-transparent via-soft-gold/75 to-transparent" aria-hidden="true" />

      <div className="min-w-0 px-1">
        <Clock3 className="wedding-info-icon mx-auto mb-1 size-7 text-soft-gold" strokeWidth={1.65} />
        <p className="wedding-count-number font-display text-[2.55rem] font-semibold leading-none text-olive">100</p>
        <p className="wedding-count-copy mt-1 text-[0.9rem] leading-tight text-olive/85">días para nuestra boda</p>
      </div>
    </motion.div>
  );
}

function TornPaperDivider() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[-4.2dvh] z-20 h-[9dvh] min-h-14 overflow-hidden" aria-hidden="true">
      <Image
        src={`/images/torn-paper-edge.webp?v=${assetVersion}`}
        alt=""
        fill
        sizes="(max-width: 430px) 100vw, 430px"
        className="w-full object-cover object-bottom"
        priority
      />
    </div>
  );
}

function ScrollHint() {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-20 grid place-items-center text-center text-[#fff8eb]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smoothTransition, delay: 1.22 }}
    >
      <p className="font-script text-[1.9rem] leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
        Desliza para continuar
      </p>
      <motion.div
        className="mt-2 text-soft-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.36)]"
        animate={{ y: [0, 7, 0], opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 1.85, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronsDown className="size-8" strokeWidth={1.9} />
      </motion.div>
    </motion.div>
  );
}

function CouplePhotoSection() {
  return (
    <motion.section
      className="relative min-h-0 flex-1 overflow-hidden bg-olive"
      initial={{ opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.05, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Foto de la pareja"
    >
      <Image
        src={`/images/couple-photo-1.jpg?v=${assetVersion}`}
        alt="Luisa y Tattan"
        fill
        priority
        sizes="(max-width: 430px) 100vw, 430px"
        className="object-cover object-[center_22%]"
      />
      <div className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-black/58 via-black/18 to-transparent" />
      <ScrollHint />
    </motion.section>
  );
}

export default function WeddingHeroSection() {
  return (
    <motion.section
      className="absolute inset-x-0 top-0 z-[8] mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[#f6ead7] text-olive shadow-[0_0_45px_rgba(77,58,35,0.16)]"
      initial={{ opacity: 0, y: 72, scale: 0.975 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.05, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="wedding-hero-title"
    >
      <section
        className="wedding-hero-paper relative z-10 flex h-[45dvh] shrink-0 items-start justify-center px-5 pb-12 pt-[calc(env(safe-area-inset-top)+0.75rem)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250, 242, 229, 0.88), rgba(246, 234, 215, 0.93)), url('/images/paper-texture.webp?v=20260525-wedding-hero-3')",
          backgroundPosition: "center top",
          backgroundSize: "cover",
        }}
      >
        <FloralTopDecorations />
        <motion.div initial="hidden" animate="visible" className="wedding-hero-content relative z-[4] w-full">
          <WeddingTitleBlock />
          <WeddingInfoBlock />
        </motion.div>
        <TornPaperDivider />
      </section>

      <CouplePhotoSection />
    </motion.section>
  );
}
