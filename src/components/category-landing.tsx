import Link from "next/link";
import { ArrowRight, Compass, Image as ImageIcon } from "lucide-react";
import FaqSection from "@/components/faq-section";
import ToolCard from "@/components/tool-card";
import CategoryIcon from "@/components/category-icon";
import InfoPage from "@/components/info-page";
import { categories, tools, type CategoryInfo } from "@/lib/tools";

export default function CategoryLanding({
  category,
}: {
  category: CategoryInfo;
}) {
  const matchingTools =
    category.slug === "image-tools"
      ? tools
      : tools.filter((tool) => tool.category === category.slug);
  const otherCategories = categories.filter(
    (item) => item.slug !== category.slug && item.slug !== "image-tools",
  );
  const isImageCategory = category.slug === "image-tools";

  return (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Todas las herramientas", href: "/all-tools/" },
        { label: category.name },
      ]}
      description={category.description}
      eyebrow="Explora por tarea"
      title={category.title}
    >
      <p className="category-intro">{category.intro}</p>

      <section
        className="category-tools"
        aria-labelledby="category-tools-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {matchingTools.length ? "Lista para usar" : "Estado actual"}
            </p>
            <h2 id="category-tools-heading">
              {matchingTools.length
                ? "Herramientas disponibles"
                : "Aún no hay herramientas disponibles"}
            </h2>
          </div>
          <Link className="text-link" href="/all-tools/">
            Ver todas las herramientas <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        {matchingTools.length ? (
          <div className="tool-grid">
            {matchingTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="empty-tools">
            <span className="empty-tools__icon" aria-hidden="true">
              {isImageCategory ? (
                <ImageIcon size={22} />
              ) : (
                <Compass size={22} />
              )}
            </span>
            <div>
              <h3>
                {isImageCategory
                  ? "Estamos preparando más herramientas de imagen"
                  : `La categoría «${category.name}» todavía no tiene una herramienta activa`}
              </h3>
              <p>
                No mostramos controles ni descargas hasta que la función esté
                implementada y probada.
              </p>
              <Link className="text-link" href="/image-resizer/">
                Usar el redimensionador disponible{" "}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="category-neighbors">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Sigue explorando</p>
            <h2>Otras categorías</h2>
          </div>
        </div>
        <div className="category-card-grid">
          {otherCategories.map((item) => (
            <Link
              className="category-card"
              href={item.href}
              key={item.slug}
            >
              <span className="category-card__icon">
                <CategoryIcon name={item.icon} />
              </span>
              <span className="category-card__copy">
                <strong>{item.name}</strong>
                <small>{item.description}</small>
              </span>
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
      <FaqSection items={category.faqs} />
    </InfoPage>
  );
}
