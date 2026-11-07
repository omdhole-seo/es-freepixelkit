import CategoryLanding from "@/components/category-landing";
import { createPageMetadata } from "@/lib/metadata";
import { categories } from "@/lib/tools";

export const metadata = createPageMetadata("/compress/");

export default function CompressPage() {
  const category = categories.find((item) => item.slug === "compress");
  if (!category) throw new Error("No se encontró la categoría de compresión.");
  return <CategoryLanding category={category} />;
}
