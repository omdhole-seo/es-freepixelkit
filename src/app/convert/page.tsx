import type { Metadata } from "next";
import CategoryLanding from "@/components/category-landing";
import { createPageMetadata } from "@/lib/metadata";
import { categories } from "@/lib/tools";

export const metadata: Metadata = createPageMetadata({
  title: "Convertir imágenes: formatos y compatibilidad",
  description:
    "Consulta qué opciones de conversión de imágenes están disponibles y cómo influyen los formatos en la transparencia.",
  path: "/convert/",
});

export default function ConvertPage() {
  const category = categories.find((item) => item.slug === "convert");
  if (!category) throw new Error("No se encontró la categoría de conversión.");
  return <CategoryLanding category={category} />;
}
