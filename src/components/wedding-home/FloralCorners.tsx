import { motion } from "framer-motion";
import Image from "next/image";

const assetVersion = "20260526-performance-1";

export default function FloralCorners() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <motion.div
        className="floral-corner floral-corner-top"
        initial={{ opacity: 0, x: 20, y: -16, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ delay: 0.28, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={`/images/florals/floral-top.webp?v=${assetVersion}`}
          alt=""
          width={640}
          height={427}
          priority
        />
      </motion.div>
      <motion.div
        className="floral-corner floral-corner-bottom"
        initial={{ opacity: 0, x: -24, y: 22, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ delay: 0.44, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={`/images/florals/floral-bottom.webp?v=${assetVersion}`}
          alt=""
          width={560}
          height={660}
          priority
        />
      </motion.div>
      <motion.div
        className="floral-corner floral-corner-bottom-right"
        initial={{ opacity: 0, x: 22, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        transition={{ delay: 0.54, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={`/images/florals/floral-bottom-right.webp?v=${assetVersion}`}
          alt=""
          width={440}
          height={660}
          priority
        />
      </motion.div>
    </div>
  );
}
