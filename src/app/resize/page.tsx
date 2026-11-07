import CategoryLanding from "@/components/category-landing";
import { createPageMetadata } from "@/lib/metadata";
import { categories } from "@/lib/tools";

export const metadata = createPageMetadata("/resize/");

export default function ResizePage() {
  const category = categories.find((item) => item.slug === "resize");
  if (!category) throw new Error("No se encontró la categoría de tamaño.");
  return <CategoryLanding category={category} />;
}
