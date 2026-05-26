"use client";

import { motion } from "framer-motion";
import { CalendarHeart, ChevronsDown, Clock3, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const assetVersion = "20260525-wedding-hero-7";
const weddingDate = new Date("2026-09-26T00:00:00-05:00");

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
    <motion.p
      className="wedding-hero-logo mx-auto mt-2 font-display text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-soft-gold"
      variants={fadeUp}
      transition={{ ...smoothTransition, delay: 0.44 }}
    >
      LUISA &amp; TATTAN
    </motion.p>
  );
}

function FloralTopDecorations() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[18dvh] min-h-24 overflow-hidden" aria-hidden="true">
      <Image
        src={`/images/floral-top.webp?v=${assetVersion}`}
        alt=""
        width={360}
        height={240}
        priority
        className="absolute -left-3 -top-3 w-48 rotate-[-5deg] scale-x-[-1] object-contain opacity-95"
      />
      <Image
        src={`/images/floral-top.webp?v=${assetVersion}`}
        alt=""
        width={360}
        height={240}
        priority
        className="absolute -right-3 -top-3 w-48 rotate-[5deg] object-contain opacity-92"
      />
    </div>
  );
}

function DecorativeHeartRule() {
  return (
    <div className="mx-auto flex w-full max-w-[285px] items-center justify-center gap-3 text-soft-gold" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-soft-gold/80 to-soft-gold" />
      <span className="grid size-6 place-items-center">
        <span className="font-serif text-lg leading-none">♡</span>
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-soft-gold/80 to-soft-gold" />
    </div>
  );
}

function WeddingTitleBlock() {
  return (
    <div className="relative z-[4] text-center">
      <motion.h1
        id="wedding-hero-title"
        className="wedding-hero-title whitespace-nowrap font-script text-[clamp(3.35rem,15.8vw,5.35rem)] leading-[0.84] text-olive drop-shadow-[0_2px_0_rgba(255,252,244,0.72)]"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.36 }}
      >
        Nuestra Boda
      </motion.h1>

      <LTLogo />

      <motion.div
        className="wedding-logo-divider relative mx-auto mt-1 h-8 w-28"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.5 }}
      >
        <Image
          src={`/images/floral-divider-horizontal.webp?v=${assetVersion}`}
          alt=""
          fill
          sizes="112px"
          className="object-contain opacity-75"
        />
      </motion.div>

      <motion.div
        className="wedding-heart-rule mt-3"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.56 }}
      >
        <DecorativeHeartRule />
      </motion.div>

      <motion.div
        className="wedding-date-block mt-4 text-center"
        variants={fadeUp}
        transition={{ ...smoothTransition, delay: 0.66 }}
      >
        <CalendarHeart className="wedding-info-icon mx-auto mb-1.5 size-7 text-soft-gold" strokeWidth={1.55} />
        <p className="wedding-hero-date whitespace-nowrap font-display text-[clamp(2rem,9.8vw,3.1rem)] font-medium leading-none tracking-[0.04em] text-olive">
          26 <span className="text-soft-gold">·</span> 09 <span className="text-soft-gold">·</span> 26
        </p>
      </motion.div>
    </div>
  );
}

function WeddingInfoBlock() {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const updateDaysRemaining = () => {
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const days = Math.ceil((weddingDate.getTime() - Date.now()) / millisecondsPerDay);

      setDaysRemaining(Math.max(days, 0));
    };

    updateDaysRemaining();
    const interval = window.setInterval(updateDaysRemaining, 60 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="wedding-info-block relative z-[4] mx-auto mt-5 grid w-full max-w-[350px] grid-cols-[1fr_auto_1fr] items-center gap-4 text-center"
      variants={fadeUp}
      transition={{ ...smoothTransition, delay: 0.76 }}
    >
      <div className="min-w-0 px-1">
        <MapPin className="wedding-info-icon mx-auto mb-2 size-7 text-soft-gold" strokeWidth={1.65} />
        <p className="wedding-place-name text-[0.98rem] font-semibold leading-tight text-olive">El lugar de su presencia</p>
        <p className="wedding-place-city mt-1 text-[0.9rem] leading-tight text-olive/85">Bogotá</p>
      </div>

      <div className="wedding-info-separator h-20 w-px bg-gradient-to-b from-transparent via-soft-gold/75 to-transparent" aria-hidden="true" />

      <div className="min-w-0 px-1">
        <Clock3 className="wedding-info-icon mx-auto mb-1 size-7 text-soft-gold" strokeWidth={1.65} />
        <p className="wedding-count-number font-display text-[2.55rem] font-semibold leading-none text-olive">
          {daysRemaining}
        </p>
        <p className="wedding-count-copy mt-1 text-[0.9rem] leading-tight text-olive/85">días para nuestra boda</p>
      </div>
    </motion.div>
  );
}

function TornPaperDivider() {
  return (
    <div
      className="wedding-torn-divider pointer-events-none absolute inset-x-0 bottom-[-28px] z-20 h-[5.8dvh] min-h-9 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-x-[-6%] top-0 h-full bg-[#f6ead7] [clip-path:polygon(0_0,100%_0,100%_42%,93%_49%,84%_41%,75%_55%,66%_44%,56%_58%,46%_48%,36%_61%,26%_45%,17%_56%,8%_47%,0_54%)]" />
      <Image
        src={`/images/torn-paper-edge.png?v=${assetVersion}`}
        alt=""
        fill
        sizes="(max-width: 430px) 100vw, 430px"
        className="w-full object-cover object-center opacity-35 mix-blend-multiply [clip-path:polygon(0_0,100%_0,100%_50%,90%_54%,80%_47%,70%_58%,60%_49%,50%_61%,40%_51%,30%_62%,20%_48%,10%_57%,0_51%)]"
        priority
      />
    </div>
  );
}

function ScrollHint() {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.35rem)] z-20 grid place-items-center text-center text-[#fff8eb]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smoothTransition, delay: 1.22 }}
    >
      <p className="font-script text-[1.65rem] leading-none opacity-90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.42)]">
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
        className="object-cover object-[58%_2%]"
      />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(20,18,12,0.14)_0%,rgba(20,18,12,0)_14%,rgba(20,18,12,0)_86%,rgba(20,18,12,0.14)_100%)] [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_18%,black_52%)] backdrop-blur-[0.2px]" />
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
        className="wedding-hero-paper relative z-10 flex h-[45dvh] shrink-0 items-start justify-center px-5 pb-12 pt-[calc(env(safe-area-inset-top)+1.35rem)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250, 242, 229, 0.28), rgba(246, 234, 215, 0.42)), url('/images/paper-texture.webp?v=20260525-wedding-hero-7')",
          backgroundPosition: "center top",
          backgroundSize: "cover",
        }}
      >
        <FloralTopDecorations />
        <motion.div initial="hidden" animate="visible" className="wedding-hero-content relative z-[30] w-full">
          <WeddingTitleBlock />
          <WeddingInfoBlock />
        </motion.div>
        <TornPaperDivider />
      </section>

      <CouplePhotoSection />
    </motion.section>
  );
}
