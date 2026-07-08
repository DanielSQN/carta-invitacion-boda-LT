import { m } from "framer-motion";

type DecorativeTextProps = {
  guestName: string;
};

export default function DecorativeText({ guestName }: DecorativeTextProps) {
  // La letra se reduce según el largo del nombre para que los "para" largos
  // no pasen de 2-3 líneas ni invadan el "Para:" o las esquinas decoradas.
  const sizeClass =
    guestName.length > 32 ? " decorative-name--sm" : guestName.length > 18 ? " decorative-name--md" : "";

  return (
    <m.header
      className="decorative-text relative z-[3] w-full text-olive"
      initial={{ opacity: 0, y: 10, rotate: -7 }}
      animate={{ opacity: 1, y: 0, rotate: -7 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="decorative-label font-script leading-none">
        Para:
      </p>
      <h1 className={`decorative-name${sizeClass} font-script leading-[0.88] tracking-normal`}>
        <span className="decorative-name-line">
          <span>{guestName}</span>
          <svg
            className="calligraphy-heart"
            viewBox="0 0 88 48"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M2 27C14 27 20 23 29 18C36 14 43 16 48 24C52 15 59 11 67 14C76 17 80 27 76 36C72 44 62 49 49 52C36 47 25 39 24 30C23 23 28 18 35 17C42 16 47 21 49 29C52 21 58 17 65 18C72 20 75 27 72 33C69 40 60 45 50 48"
            />
          </svg>
        </span>
      </h1>

      <div
        className="decorative-rule mx-auto flex w-[74%] max-w-[330px] items-center justify-center gap-3 text-soft-gold"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-gradient-to-l from-soft-gold to-transparent" />
        <svg className="h-5 w-12 shrink-0" viewBox="0 0 96 34" fill="none">
          <path
            d="M7 17h25m32 0h25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M48 25C39 19 35 15 35 10.8C35 7.5 37.6 5 40.9 5C43.7 5 46 6.7 48 9.1C50 6.7 52.3 5 55.1 5C58.4 5 61 7.5 61 10.8C61 15 57 19 48 25Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M42 28c3.8 2.3 8.2 2.3 12 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <span className="h-px flex-1 bg-gradient-to-r from-soft-gold to-transparent" />
      </div>
    </m.header>
  );
}
