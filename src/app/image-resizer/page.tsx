import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import FaqSection from "@/components/faq-section";
import CategoryIcon from "@/components/category-icon";
import ImageResizer from "@/components/image-resizer";
import ToolPageShell from "@/components/tool-page-shell";
import { categories } from "@/lib/tools";

const resizerFaqs = [
  {
    question: "¿Cómo redimensiono una imagen sin deformarla?",
    answer:
      "Selecciona la imagen y deja activada la opción «Mantener la proporción». Al cambiar el ancho, el alto se ajusta automáticamente, y viceversa. También puedes usar los tamaños preestablecidos.",
  },
  {
    question: "¿Qué formatos puedo cargar y descargar?",
    answer:
      "Puedes cargar imágenes JPEG, PNG y WebP. El redimensionador comprueba qué formatos de salida admite tu navegador y solo muestra esas opciones.",
  },
  {
    question: "¿Qué pasa con la transparencia al guardar en JPEG?",
    answer:
      "JPEG no admite transparencia. Si eliges ese formato, las áreas transparentes de la imagen se rellenan con blanco. Elige PNG o WebP para conservar la transparencia cuando el navegador lo permita.",
  },
  {
    question: "¿Se envía mi imagen a un servidor?",
    answer:
      "No. La imagen se lee y procesa localmente en tu navegador con Canvas. No se envía a nuestros servidores.",
  },
];

export const metadata: Metadata = {
  title: "Redimensionar imagen online gratis",
  description:
    "Redimensiona imágenes online: cambia el ancho y el alto, conserva la proporción y descarga en JPEG, PNG o WebP compatible con tu navegador.",
  alternates: {
    canonical: "/image-resizer/",
  },
  openGraph: {
    title: "Redimensionar imagen online gratis | FreePixelKit",
    description:
      "Cambia las dimensiones de una imagen y descárgala con procesamiento local en tu navegador.",
    url: "/image-resizer/",
    siteName: "FreePixelKit",
    locale: "es_ES",
    type: "website",
  },
};

export default function ImageResizerPage() {
  const otherCategories = categories.filter(
    (category) =>
      category.slug !== "image-tools" && category.slug !== "resize",
  );

  return (
    <ToolPageShell
      title="Redimensionar imagen online"
      description="Cambia el ancho y el alto de tus imágenes, mantén la proporción cuando lo necesites y guarda el resultado en un formato compatible. El procesamiento se realiza en tu navegador."
    >
      <ImageResizer />

      <div className="tool-content">
        <section className="content-section">
          <h2>Cómo redimensionar una imagen</h2>
          <p>
            Ajusta el tamaño en píxeles para preparar una imagen para una
            página, un documento o para compartirla. Elige un archivo JPEG,
            PNG o WebP y revisa la vista previa antes de descargar la copia
            redimensionada.
          </p>
          <div className="content-list">
            <div className="content-list__item">
              <Check size={16} aria-hidden="true" />
              Selecciona una imagen o arrástrala al área de carga.
            </div>
            <div className="content-list__item">
              <Check size={16} aria-hidden="true" />
              Introduce el ancho y el alto o utiliza un tamaño preestablecido.
            </div>
            <div className="content-list__item">
              <Check size={16} aria-hidden="true" />
              Elige un formato disponible y descarga el archivo resultante.
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>Una herramienta de imagen en tu navegador</h2>
          <p>
            El tamaño de salida se expresa en píxeles. Mantener la proporción
            evita que la imagen se estire, aunque un cambio de dimensiones puede
            afectar a la nitidez si se amplía mucho. Las imágenes se procesan
            localmente con Canvas; el navegador puede limitar la cantidad de
            píxeles disponible según el dispositivo.
          </p>
        </section>

        <section className="related-tools">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Más opciones</p>
              <h2>Explora otras categorías</h2>
            </div>
          </div>
          <div className="category-card-grid">
            {otherCategories.map((category) => (
              <Link
                className="category-card"
                href={category.href}
                key={category.slug}
              >
                <span className="category-card__icon">
                  <CategoryIcon name={category.icon} />
                </span>
                <span className="category-card__copy">
                  <strong>{category.title}</strong>
                  <small>{category.description}</small>
                </span>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <FaqSection items={resizerFaqs} />
    </ToolPageShell>
  );
}
