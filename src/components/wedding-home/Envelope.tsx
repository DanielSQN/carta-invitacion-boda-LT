import { motion } from "framer-motion";
import Image from "next/image";
import type { RefObject } from "react";
import WaxSeal from "./WaxSeal";

const assetVersion = "20260601-assets-1";

type EnvelopeProps = {
  isOpen: boolean;
  letterRef?: RefObject<HTMLDivElement | null>;
  onOpen: () => void;
};

export default function Envelope({ isOpen, letterRef, onOpen }: EnvelopeProps) {
  return (
    <motion.button
      type="button"
      className="envelope-button group relative z-[5] block cursor-pointer border-0 bg-transparent p-0 outline-none"
      data-open={isOpen ? "true" : "false"}
      aria-label="Abrir carta de invitacion"
      onClick={onOpen}
      initial={{ opacity: 0, y: 34, rotate: -10, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, rotate: -7, scale: 1 }}
      transition={{ delay: 0.45, duration: 0.78, ease: [0.18, 1, 0.28, 1] }}
      whileTap={isOpen ? undefined : { scale: 0.985 }}
    >
      <motion.div
        className="envelope-float relative aspect-[1186/829] w-full"
        animate={isOpen ? { y: -34, scale: 1.08 } : { y: [0, -5, 0] }}
        transition={
          isOpen
            ? { duration: 0.95, ease: [0.22, 1, 0.36, 1] }
            : { duration: 5.4, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <div className="envelope-shell absolute inset-x-[5%] bottom-[-10%] h-[34%] rounded-[50%] bg-stone-900/20 blur-2xl" />

        <motion.div
          ref={letterRef}
          className="envelope-letter-insert absolute left-1/2 top-[8%] z-[4] h-[78%] w-[77%] -translate-x-1/2 overflow-hidden rounded-sm"
          initial={false}
          animate={isOpen ? { y: -178, scale: 1, scaleY: 1, opacity: 1 } : { y: 18, scale: 1, scaleY: 0.68, opacity: 1 }}
          transition={{ duration: 1.08, delay: isOpen ? 0.26 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-sm">
            <Image
              src="/images/couple/couple-photo.webp?v=20260601-assets-2"
              alt=""
              fill
              priority
              sizes="(max-width: 430px) 58vw, 245px"
              className="hero-transition-image object-cover"
            />
          </div>
          <div className="envelope-letter-wash hero-transition-blue-wash" aria-hidden="true" />
        </motion.div>

        <div className="envelope-shell absolute inset-0 z-[5]">
          <Image
            className="object-contain drop-shadow-[0_24px_28px_rgba(77,58,35,0.22)]"
            src={`/images/ui/envelope.webp?v=${assetVersion}`}
            alt=""
            fill
            sizes="(max-width: 430px) 86vw, 385px"
            priority
          />
        </div>

        <motion.div
          className="envelope-top-flap absolute left-[6%] top-[7%] z-[7] h-[47%] w-[88%]"
          initial={false}
          animate={isOpen ? { rotateX: -118, y: -8, opacity: 0.96 } : { rotateX: 0, y: 0, opacity: 0 }}
          transition={{ duration: 0.78, delay: isOpen ? 0.18 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="h-full w-full bg-[#fbf1dc] shadow-[inset_0_-10px_18px_rgba(123,91,52,0.08)]" />
        </motion.div>

        <WaxSeal isOpen={isOpen} />
      </motion.div>
    </motion.button>
  );
}
