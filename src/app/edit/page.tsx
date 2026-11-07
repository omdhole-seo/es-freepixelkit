import type { Metadata } from "next";
import CategoryLanding from "@/components/category-landing";
import { createPageMetadata } from "@/lib/metadata";
import { categories } from "@/lib/tools";

export const metadata: Metadata = createPageMetadata({
  title: "Editar imágenes: herramientas disponibles",
  description:
    "Consulta el estado de las funciones de edición de imágenes y accede al redimensionador que sí está disponible.",
  path: "/edit/",
});

export default function EditPage() {
  const category = categories.find((item) => item.slug === "edit");
  if (!category) throw new Error("No se encontró la categoría de edición.");
  return <CategoryLanding category={category} />;
}
