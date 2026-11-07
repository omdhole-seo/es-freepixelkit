import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";
import InfoPage from "@/components/info-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("/blog/");

export default function BlogPage() {
  return (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Blog" },
      ]}
      description="Guías y novedades sobre herramientas digitales, publicadas solo cuando exista contenido listo para compartir."
      eyebrow="Blog"
      title="Ideas y guías para trabajar con imágenes"
    >
      <section className="empty-editorial">
        <span className="empty-editorial__icon" aria-hidden="true">
          <BookOpenText size={26} />
        </span>
        <p className="eyebrow">Sin publicaciones por ahora</p>
        <h2>Aún no hay artículos publicados</h2>
        <p>
          Esta sección mostrará artículos reales cuando estén disponibles. No
          contiene publicaciones, autores, fechas ni enlaces de ejemplo.
        </p>
        <Link className="button button--primary" href="/image-resizer/">
          Probar el redimensionador <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </InfoPage>
  );
}
