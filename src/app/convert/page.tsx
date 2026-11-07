import CategoryLanding from "@/components/category-landing";
import { createPageMetadata } from "@/lib/metadata";
import { categories } from "@/lib/tools";

export const metadata = createPageMetadata("/convert/");

export default function ConvertPage() {
  const category = categories.find((item) => item.slug === "convert");
  if (!category) throw new Error("No se encontró la categoría de conversión.");
  return <CategoryLanding category={category} />;
}
