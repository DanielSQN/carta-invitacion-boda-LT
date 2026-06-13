type YouTubeIconProps = {
  className?: string;
};

// Logo oficial de YouTube (rectangulo redondeado rojo + play blanco).
export default function YouTubeIcon({ className }: YouTubeIconProps) {
  return (
    <svg className={className} viewBox="0 0 28 20" aria-hidden="true" focusable="false">
      <path
        d="M27.2 3.1a3.5 3.5 0 0 0-2.46-2.48C22.57 0 14 0 14 0S5.43 0 3.26.62A3.5 3.5 0 0 0 .8 3.1 36.5 36.5 0 0 0 .2 10c0 2.32.2 4.64.6 6.9a3.5 3.5 0 0 0 2.46 2.48C5.43 20 14 20 14 20s8.57 0 10.74-.62a3.5 3.5 0 0 0 2.46-2.48c.4-2.26.6-4.58.6-6.9 0-2.32-.2-4.64-.6-6.9Z"
        fill="#FF0000"
      />
      <path d="M11.2 14.29 18.34 10 11.2 5.71v8.58Z" fill="#fff" />
    </svg>
  );
}
