import { motion } from "framer-motion";

export default function Verse() {
  return (
    <motion.blockquote
      className="verse-block relative z-[3] mx-auto w-full text-center font-serif text-olive"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="verse-quote verse-quote-left absolute font-serif leading-none text-soft-gold/70">
        &ldquo;
      </span>
      <p className="verse-copy font-semibold leading-snug">
        Y sobre todo, v&iacute;stanse de amor,
        <br />
        que es el v&iacute;nculo perfecto.
      </p>
      <span className="verse-reference block font-semibold">
        &ndash; Colosenses 3:14 &ndash;
      </span>
      <span className="verse-quote verse-quote-right absolute font-serif leading-none text-soft-gold/70">
        &rdquo;
      </span>
    </motion.blockquote>
  );
}
