import CategoryLanding from "@/components/category-landing";
import { createPageMetadata } from "@/lib/metadata";
import { categories } from "@/lib/tools";

export const metadata = createPageMetadata("/edit/");

export default function EditPage() {
  const category = categories.find((item) => item.slug === "edit");
  if (!category) throw new Error("No se encontró la categoría de edición.");
  return <CategoryLanding category={category} />;
}
