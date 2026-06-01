import { motion } from "framer-motion";
import Image from "next/image";
import WaxSeal from "./WaxSeal";

const assetVersion = "20260601-assets-1";

type EnvelopeProps = {
  isOpen: boolean;
  onOpen: () => void;
};

export default function Envelope({ isOpen, onOpen }: EnvelopeProps) {
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
        <div className="absolute inset-x-[5%] bottom-[-10%] h-[34%] rounded-[50%] bg-stone-900/20 blur-2xl" />

        <motion.div
          className="envelope-letter-insert absolute left-1/2 top-[8%] z-[4] h-[78%] w-[77%] -translate-x-1/2 rounded-sm border border-soft-gold/25 bg-[#fff9eb] shadow-[0_20px_42px_rgba(77,58,35,0.16)]"
          initial={false}
          animate={isOpen ? { y: -46, scaleY: 1.18, opacity: 1 } : { y: 18, scaleY: 0.7, opacity: 0 }}
          transition={{ duration: 0.85, delay: isOpen ? 0.34 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-4 border border-soft-gold/15" />
        </motion.div>

        <div className="absolute inset-0 z-[5]">
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
