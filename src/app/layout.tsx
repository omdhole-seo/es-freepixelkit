import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Imágenes a tu medida | FreePixelKit",
    template: "%s | FreePixelKit",
  },
  description:
    "Explora herramientas claras para tus imágenes. Redimensiona una foto localmente en tu navegador con FreePixelKit.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Imágenes a tu medida | FreePixelKit",
    description:
      "Explora herramientas claras para tus imágenes. Redimensiona una foto localmente en tu navegador.",
    url: "/",
    siteName: SITE_NAME,
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <a className="skip-link" href="#contenido-principal">
          Saltar al contenido principal
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
