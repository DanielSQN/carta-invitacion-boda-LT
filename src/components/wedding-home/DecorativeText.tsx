import { motion } from "framer-motion";

type DecorativeTextProps = {
  guestName: string;
};

export default function DecorativeText({ guestName }: DecorativeTextProps) {
  return (
    <motion.header
      className="decorative-text relative z-[3] w-full text-olive"
      initial={{ opacity: 0, y: 10, rotate: -7 }}
      animate={{ opacity: 1, y: 0, rotate: -7 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="decorative-label font-script leading-none">
        Para:
      </p>
      <h1 className="decorative-name whitespace-nowrap font-script leading-[0.88] tracking-normal">
        {guestName}
      </h1>

      <div
        className="decorative-rule mx-auto flex w-[74%] max-w-[330px] items-center justify-center gap-3 text-soft-gold"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-gradient-to-l from-soft-gold to-transparent" />
        <svg className="h-5 w-12 shrink-0" viewBox="0 0 96 34" fill="none">
          <path
            d="M7 17h23m36 0h23M33 17c8-13 22-13 30 0-8 13-22 13-30 0Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M43 10c-3 2-5 4-5 7s2 5 5 7m10-14c3 2 5 4 5 7s-2 5-5 7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="48" cy="17" r="2.8" fill="currentColor" />
        </svg>
        <span className="h-px flex-1 bg-gradient-to-r from-soft-gold to-transparent" />
      </div>
    </motion.header>
  );
}
