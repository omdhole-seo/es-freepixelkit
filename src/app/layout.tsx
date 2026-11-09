import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import SiteChrome from "@/components/site-chrome";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "MdoSmCtNjdXtRjMIO9DRwyQKeoaQ9kTGqAyp0V4qS8w",
  },
  title: {
    default: "Herramientas de imagen online | FreePixelKit",
    template: "%s | FreePixelKit",
  },
  description:
    "Explora herramientas claras para tus imágenes. Redimensiona una foto localmente en tu navegador con FreePixelKit.",
  openGraph: {
    title: "Imágenes a tu medida | FreePixelKit",
    description:
      "Explora herramientas claras para tus imágenes. Redimensiona una foto localmente en tu navegador.",
    url: "/",
    siteName: SITE_NAME,
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imágenes a tu medida | FreePixelKit",
    description:
      "Explora herramientas claras para tus imágenes. Redimensiona una foto localmente en tu navegador.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: SITE_NAME,
                  url: `${SITE_URL}/`,
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  name: SITE_NAME,
                  url: `${SITE_URL}/`,
                  inLanguage: "es",
                  publisher: { "@id": `${SITE_URL}/#organization` },
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <SiteChrome header={<SiteHeader />} footer={<SiteFooter />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
