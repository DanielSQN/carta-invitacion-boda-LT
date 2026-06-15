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
  // Caché de larga duración para los assets estáticos de /public (imágenes
  // servidas por URL directa como los fondos CSS, y el audio). Por defecto se
  // entregaban con `max-age=0, must-revalidate`, así que cada visita los
  // revalidaba contra el servidor; ahora el navegador los reutiliza sin pedir
  // nada de vuelta. (No afecta a /_next/image, que ya cachea por minimumCacheTTL.)
  //
  // Al REEMPLAZAR un asset: con `immutable` el navegador no vuelve a pedir un
  // archivo de la misma ruta hasta que expire el año. Para que tome uno nuevo,
  // usa un nombre distinto o súbele la versión en la query (`?v=...`), como ya
  // se hace con `couple-photo.webp?v=...`. Subir fotos *nuevas* con nombres
  // nuevos (p. ej. 34 fotos de galería) las toma automáticamente.
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/audio/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
