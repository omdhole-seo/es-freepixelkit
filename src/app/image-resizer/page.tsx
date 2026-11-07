import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import FaqSection from "@/components/faq-section";
import CategoryIcon from "@/components/category-icon";
import ImageResizer from "@/components/image-resizer";
import ToolPageShell from "@/components/tool-page-shell";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import { categories } from "@/lib/tools";

export const metadata = createPageMetadata("/image-resizer/");

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
  {
    question: "¿Qué dimensiones admite el redimensionador?",
    answer:
      "Cada lado puede medir hasta 12.000 píxeles y la salida no puede superar los 100 millones de píxeles. El navegador o el dispositivo pueden imponer límites menores.",
  },
  {
    question: "¿Ampliar una foto mejora su calidad?",
    answer:
      "No. Aumentar las dimensiones no recupera los detalles que no están en la imagen original y puede hacer que se vea menos nítida.",
  },
];

export default function ImageResizerPage() {
  const otherCategories = categories.filter(
    (category) =>
      category.slug !== "image-tools" && category.slug !== "resize",
  );
  const applicationStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Redimensionar imagen online",
    url: `${SITE_URL}/image-resizer/`,
    description:
      "Cambia el ancho y el alto de una imagen y descarga una copia procesada con Canvas en el navegador.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Cualquier sistema con un navegador compatible",
    inLanguage: "es",
  };

  return (
    <ToolPageShell
      title="Redimensionar imagen online"
      description="Cambia el ancho y el alto de tus imágenes, mantén la proporción cuando lo necesites y guarda el resultado en un formato compatible. El procesamiento se realiza en tu navegador."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(applicationStructuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
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
          <h2>Cómo mantener la proporción de una imagen</h2>
          <p>
            El ancho y el alto se miden en píxeles. Activa «Mantener la
            proporción» para conservar la relación entre ambos lados y evitar
            que la foto se vea estirada. Si necesitas un tamaño distinto para
            un diseño, puedes desactivar esa opción, pero cambiar solo una
            dimensión puede deformar el contenido.
          </p>
          <p>
            Redimensionar no es lo mismo que recortar: el redimensionador cambia
            las dimensiones de toda la imagen y no elimina los bordes. Tampoco
            recupera detalle al ampliar una foto pequeña; para conservar la
            nitidez, evita superar mucho la resolución original.
          </p>
        </section>

        <section className="content-section">
          <h2>Formatos de imagen compatibles</h2>
          <p>
            Puedes cargar archivos JPEG, PNG y WebP. La lista de formatos de
            salida se comprueba en tu navegador, así que las opciones pueden
            variar según el dispositivo. PNG suele ser útil cuando necesitas
            conservar zonas transparentes; JPEG no admite transparencia y el
            redimensionador rellena esas zonas con blanco al exportar en ese
            formato.
          </p>
          <p>
            El archivo descargado es una copia nueva: conserva el original si
            quieres comparar resultados o repetir el ajuste. Cambiar las
            dimensiones no garantiza que el archivo pese menos; el tamaño final
            también depende del formato y del contenido de la imagen.
          </p>
        </section>

        <section className="content-section">
          <h2>Procesamiento local y límites del navegador</h2>
          <p>
            La imagen se lee y se redimensiona con Canvas en el navegador; el
            código de esta herramienta no la envía a nuestros servidores. El
            redimensionador limita cada lado a 12.000 píxeles y la salida a 100
            millones de píxeles. El navegador y la memoria disponible en tu
            dispositivo también pueden afectar al procesamiento de imágenes
            grandes.
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
