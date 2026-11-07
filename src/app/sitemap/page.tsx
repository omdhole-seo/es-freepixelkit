import Link from "next/link";
import { ArrowRight } from "lucide-react";
import InfoPage from "@/components/info-page";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_PAGES } from "@/lib/site-pages";

export const metadata = createPageMetadata("/sitemap/");

const groups = [
  {
    title: "Inicio y herramientas",
    paths: [
      "/",
      "/all-tools/",
      "/image-tools/",
      "/image-resizer/",
      "/compress/",
      "/resize/",
      "/convert/",
      "/edit/",
    ],
  },
  {
    title: "Información",
    paths: ["/about/", "/contact/", "/blog/", "/sitemap/"],
  },
  {
    title: "Documentos",
    paths: ["/privacy-policy/", "/terms-and-conditions/", "/disclaimer/"],
  },
];

export default function HtmlSitemapPage() {
  return (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Mapa del sitio" },
      ]}
      description="Accede directamente a las páginas públicas del sitio."
      eyebrow="Navegación"
      title="Mapa del sitio"
    >
      <div className="sitemap-groups">
        {groups.map((group) => (
          <section className="sitemap-group" key={group.title}>
            <h2>{group.title}</h2>
            <ul>
              {group.paths.map((path) => {
                const page = SITE_PAGES.find((item) => item.path === path);
                if (!page) return null;
                return (
                  <li key={page.path}>
                    <Link href={page.path}>
                      {page.label}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </InfoPage>
  );
}
