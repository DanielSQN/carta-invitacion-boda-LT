import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Playfair_Display } from "next/font/google";
import "./globals.css";

// Sin pinch-zoom: la invitacion usa un contenedor de scroll propio y el
// zoom del visual viewport en Android causaba estados rotos / recargas
// (pull-to-refresh) al volver a la escala normal.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#071827",
};

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
const metadataBase = new URL(
  siteUrl.startsWith("http://") || siteUrl.startsWith("https://")
    ? siteUrl
    : `https://${siteUrl}`,
);
const title = "Boda Luisa & Tattan";
const description = "Estas invitado a celebrar con nosotros este dia tan especial.";
const previewImage = "/preview-boda-v2.webp";

export const metadata: Metadata = {
  metadataBase,
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    type: "website",
    locale: "es_CO",
    siteName: title,
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [previewImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
