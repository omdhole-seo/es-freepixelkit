import Link from "next/link";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import CategoryIcon from "@/components/category-icon";
import FaqSection from "@/components/faq-section";
import ToolCard from "@/components/tool-card";
import ToolSearch from "@/components/tool-search";
import { createPageMetadata } from "@/lib/metadata";
import { availableTools, categories } from "@/lib/tools";

export const metadata = createPageMetadata("/");

const homepageFaqs = [
  {
    question: "¿Qué herramientas puedo usar ahora?",
    answer:
      "Puedes redimensionar imágenes JPEG, PNG y WebP. El resto de las categorías informa sobre funciones que aún no están disponibles y no ofrece controles de procesamiento.",
  },
  {
    question: "¿Cómo redimensiono una imagen sin deformarla?",
    answer:
      "En el redimensionador, activa «Mantener la proporción». Al cambiar el ancho o el alto, la otra dimensión se ajusta automáticamente.",
  },
  {
    question: "¿Mis imágenes se envían a un servidor?",
    answer:
      "El redimensionador procesa la imagen en tu navegador con Canvas y no la envía a nuestros servidores. Esta descripción se refiere al funcionamiento de esa herramienta.",
  },
  {
    question: "¿Puedo convertir o comprimir imágenes aquí?",
    answer:
      "Todavía no hay herramientas independientes para comprimir o convertir imágenes. El redimensionador permite elegir entre los formatos de salida que admite el navegador.",
  },
  {
    question: "¿Se publican artículos en el blog?",
    answer:
      "Los artículos se muestran en el blog cuando se publican desde el panel de administración.",
  },
  {
    question: "¿El formulario de contacto envía mensajes?",
    answer:
      "No. El formulario solo valida el texto en tu navegador; no se envía ningún dato porque el sitio aún no tiene un servicio de envío configurado.",
  },
];

const steps = [
  {
    number: "01",
    title: "Encuentra tu herramienta",
    description:
      "Busca por nombre o explora las categorías. Las funciones disponibles están claramente identificadas.",
    icon: MousePointer2,
  },
  {
    number: "02",
    title: "Ajusta las opciones",
    description:
      "Añade tu imagen y configura las dimensiones con controles sencillos.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Revisa y descarga",
    description:
      "Comprueba la vista previa y guarda el resultado real en tu dispositivo.",
    icon: Check,
  },
];

export default function Home() {
  return (
    <main id="contenido-principal">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />
              Herramientas útiles, sin complicaciones
            </p>
            <h1>
              Tus imágenes,
              <br />
              <span>a tu medida.</span>
            </h1>
            <p className="hero__description">
              Encuentra herramientas claras para preparar tus imágenes.
              Redimensiona una foto en tu navegador y descarga el resultado.
            </p>
            <ToolSearch
              inputId="home-tool-search"
              tools={availableTools}
            />
            <div className="hero__actions">
              <Link className="button button--primary" href="/all-tools/">
                Explorar herramientas <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link className="text-link" href="/image-resizer/">
                Redimensionar imagen
              </Link>
            </div>
            <p className="hero__note">
              <LockKeyhole size={14} aria-hidden="true" />
              El redimensionador procesa imágenes localmente en tu navegador.
            </p>
          </div>
          <div
            className="hero-art"
            role="img"
            aria-label="Ilustración de una imagen con dimensiones ajustables"
          >
            <div className="hero-art__topline">
              <span className="hero-art__window-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>FreePixelKit</span>
              <span className="hero-art__live">
                <span aria-hidden="true" />
                Disponible
              </span>
            </div>
            <div className="hero-art__canvas">
              <div className="hero-art__image-frame">
                <div className="hero-art__sun" />
                <div className="hero-art__hill hero-art__hill--back" />
                <div className="hero-art__hill hero-art__hill--front" />
                <span className="hero-art__frame-handle hero-art__frame-handle--tl" />
                <span className="hero-art__frame-handle hero-art__frame-handle--tr" />
                <span className="hero-art__frame-handle hero-art__frame-handle--bl" />
                <span className="hero-art__frame-handle hero-art__frame-handle--br" />
              </div>
              <div className="hero-art__dimensions">
                <div className="hero-art__dimension">
                  <span>ANCHO</span>
                  <strong>1200 <small>px</small></strong>
                </div>
                <div className="hero-art__dimension">
                  <span>ALTO</span>
                  <strong>800 <small>px</small></strong>
                </div>
              </div>
            </div>
            <div className="hero-art__bottom">
              <span className="hero-art__format">JPG</span>
              <span>Redimensionar imagen</span>
              <ArrowRight size={17} aria-hidden="true" />
            </div>
            <div className="hero-art__sparkle" aria-hidden="true">
              <Sparkles size={21} />
            </div>
          </div>
        </div>
        <div className="hero__soft-shape" aria-hidden="true" />
      </section>

      <section className="section section--popular" id="herramientas-populares">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Lista para usar</p>
              <h2>Herramientas disponibles</h2>
              <p>
                Cada tarjeta lleva a una función real, no a una promesa.
              </p>
            </div>
            <Link className="text-link section-heading__link" href="/all-tools/">
              Ver todas <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="tool-grid tool-grid--popular">
            {availableTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
            <Link className="popular-note" href="/all-tools/">
              <span className="popular-note__icon" aria-hidden="true">
                <Sparkles size={19} />
              </span>
              <span>
                <strong>Descubre FreePixelKit</strong>
                <span>
                  Consulta las categorías y el estado real de cada herramienta.
                </span>
              </span>
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--tinted" id="categorias">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Explora por tarea</p>
              <h2>Encuentra el tipo de herramienta</h2>
              <p>
                Las páginas de categoría explican qué está disponible y qué
                falta por implementar.
              </p>
            </div>
          </div>
          <div className="category-card-grid">
            {categories.map((category) => (
              <Link
                className="category-card"
                href={category.href}
                key={category.slug}
              >
                <span className="category-card__icon">
                  <CategoryIcon name={category.icon} />
                </span>
                <span className="category-card__copy">
                  <strong>{category.name}</strong>
                  <small>{category.description}</small>
                </span>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            ))}
            <Link className="category-card category-card--all" href="/all-tools/">
              <span className="category-card__icon">
                <ArrowRight size={20} aria-hidden="true" />
              </span>
              <span className="category-card__copy">
                <strong>Todas las herramientas</strong>
                <small>Busca y filtra las funciones implementadas.</small>
              </span>
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="como-funciona">
        <div className="container">
          <div className="section-heading section-heading--center">
            <div>
              <p className="eyebrow">Un flujo sencillo</p>
              <h2>Así funciona</h2>
              <p>Un proceso claro desde la selección hasta la descarga.</p>
            </div>
          </div>
          <div className="steps-grid">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <article className="step-card" key={step.number}>
                  <span className="step-card__number">{step.number}</span>
                  <span className="step-card__icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--privacy" id="ventajas">
        <div className="container privacy-panel">
          <div className="privacy-panel__icon" aria-hidden="true">
            <LockKeyhole size={23} />
          </div>
          <div className="privacy-panel__copy">
            <p className="eyebrow">Una función comprobable</p>
            <h2>El redimensionador trabaja en tu navegador</h2>
            <p>
              La herramienta disponible usa Canvas para leer y procesar la
              imagen localmente. El código no la envía a un servidor; no
              generalizamos esta descripción a integraciones que aún no existen.
            </p>
          </div>
          <Link className="button button--secondary" href="/about/">
            Cómo trabajamos <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section section--featured">
        <div className="container featured-card">
          <div className="featured-card__content">
            <p className="eyebrow">Herramienta disponible</p>
            <h2>Ajusta las dimensiones de una imagen</h2>
            <p>
              Cambia el ancho y el alto, conserva la proporción y exporta un
              archivo en un formato compatible con tu navegador.
            </p>
            <Link className="button button--primary" href="/image-resizer/">
              Abrir redimensionador <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="featured-card__badge" aria-hidden="true">
            <span>Canvas</span>
            <span>en el navegador</span>
          </div>
        </div>
      </section>

      <section className="section section--editorial">
        <div className="container editorial-panel">
          <div>
            <p className="eyebrow">Blog de FreePixelKit</p>
            <h2>Guías y novedades, cuando haya artículos publicados</h2>
            <p>
              Aún no hay publicaciones. No mostramos artículos de ejemplo como
              si fueran contenido real.
            </p>
          </div>
          <Link className="button button--secondary" href="/blog/">
            Visitar el blog <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <FaqSection items={homepageFaqs} />

      <section className="section section--final-cta">
        <div className="container final-cta">
          <div>
            <p className="eyebrow">Empieza con una herramienta real</p>
            <h2>¿Qué quieres hacer con tu imagen?</h2>
            <p>
              Explora el directorio o abre directamente el redimensionador.
            </p>
          </div>
          <div className="final-cta__actions">
            <Link className="button button--primary" href="/all-tools/">
              Todas las herramientas <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="text-link" href="/image-resizer/">
              Redimensionar imagen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
