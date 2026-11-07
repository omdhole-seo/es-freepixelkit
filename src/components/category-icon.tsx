import {
  ArrowLeftRight,
  Crop,
  Image as ImageIcon,
  Minimize2,
  Scaling,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CategoryInfo } from "@/lib/tools";

const icons: Record<CategoryInfo["icon"], LucideIcon> = {
  image: ImageIcon,
  compress: Minimize2,
  resize: Scaling,
  convert: ArrowLeftRight,
  edit: Crop,
};

export default function CategoryIcon({
  name,
  size = 21,
}: {
  name: CategoryInfo["icon"];
  size?: number;
}) {
  const Icon = icons[name];
  return <Icon size={size} aria-hidden="true" />;
}
