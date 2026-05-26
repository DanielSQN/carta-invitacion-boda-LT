import { motion } from "framer-motion";
import Image from "next/image";

const assetVersion = "20260525-assets-refresh-2";

type WaxSealProps = {
  isOpen: boolean;
};

export default function WaxSeal({ isOpen }: WaxSealProps) {
  return (
    <motion.div
      className="wax-seal absolute left-1/2 top-[58.5%] z-[8] grid aspect-square place-items-center"
      initial={{ opacity: 0, scale: 0.72, x: "-50%", y: "calc(-50% + 8px)" }}
      animate={
        isOpen
          ? { opacity: 0, scale: 0.35, x: "-50%", y: "calc(-50% - 8px)" }
          : { opacity: 1, scale: 1, x: "-50%", y: "-50%" }
      }
      transition={{ delay: isOpen ? 0 : 1.18, duration: isOpen ? 0.42 : 0.58, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <Image
        className="object-contain drop-shadow-[0_14px_18px_rgba(76,48,18,0.28)]"
        src={`/images/ui/wax-seal.png?v=${assetVersion}`}
        alt=""
        fill
        sizes="108px"
        priority
        unoptimized
      />
      <span className="sr-only">L&amp;T</span>
    </motion.div>
  );
}
