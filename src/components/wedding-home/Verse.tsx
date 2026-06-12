import { motion } from "framer-motion";

export default function Verse() {
  return (
    <motion.blockquote
      className="verse-block relative z-[3] mx-auto w-full text-center font-serif text-olive"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="verse-copy relative font-semibold leading-snug">
        <span className="verse-quote verse-quote-left absolute font-serif leading-none text-soft-gold/70" aria-hidden="true">
          &ldquo;
        </span>
        Y sobre todo, v&iacute;stanse de amor,
        <br />
        que es el v&iacute;nculo perfecto.
        <span className="verse-quote verse-quote-right absolute font-serif leading-none text-soft-gold/70" aria-hidden="true">
          &rdquo;
        </span>
      </p>
      <span className="verse-reference block font-semibold">
        &ndash; Colosenses 3:14 &ndash;
      </span>
    </motion.blockquote>
  );
}
