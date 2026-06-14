import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF (preferido) con WebP de respaldo: imágenes notablemente más livianas
    // en todos los dispositivos/redes sin tocar los componentes.
    formats: ["image/avif", "image/webp"],
    // Calidades permitidas: 50 (fondos detrás de overlays), 60 (fotos de la
    // galería) y 75 (estándar / lightbox).
    qualities: [50, 60, 75],
    // Las fotos no cambian: caché larga de las versiones optimizadas.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
