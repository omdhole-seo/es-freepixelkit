import type { Metadata } from "next";
import CategoryLanding from "@/components/category-landing";
import { createPageMetadata } from "@/lib/metadata";
import { categories } from "@/lib/tools";

export const metadata: Metadata = createPageMetadata({
  title: "Redimensionar imágenes online",
  description:
    "Cambia las dimensiones de una imagen en píxeles y conserva su proporción con el redimensionador disponible.",
  path: "/resize/",
});

export default function ResizePage() {
  const category = categories.find((item) => item.slug === "resize");
  if (!category) throw new Error("No se encontró la categoría de tamaño.");
  return <CategoryLanding category={category} />;
}
