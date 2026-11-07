import type { Metadata } from "next";
import CategoryLanding from "@/components/category-landing";
import { createPageMetadata } from "@/lib/metadata";
import { categories } from "@/lib/tools";

export const metadata: Metadata = createPageMetadata({
  title: "Comprimir imágenes: herramientas y opciones",
  description:
    "Consulta el estado de las herramientas para comprimir imágenes y conoce las diferencias entre peso y calidad.",
  path: "/compress/",
});

export default function CompressPage() {
  const category = categories.find((item) => item.slug === "compress");
  if (!category) throw new Error("No se encontró la categoría de compresión.");
  return <CategoryLanding category={category} />;
}
