import type { Metadata } from "next";
import CategoryLanding from "@/components/category-landing";
import { createPageMetadata } from "@/lib/metadata";
import { categories } from "@/lib/tools";

export const metadata: Metadata = createPageMetadata({
  title: "Herramientas de imagen online",
  description:
    "Explora las herramientas de imagen disponibles en FreePixelKit y consulta qué funciones están listas para usar.",
  path: "/image-tools/",
});

export default function ImageToolsPage() {
  const category = categories.find((item) => item.slug === "image-tools");
  if (!category) throw new Error("No se encontró la categoría de imágenes.");
  return <CategoryLanding category={category} />;
}
