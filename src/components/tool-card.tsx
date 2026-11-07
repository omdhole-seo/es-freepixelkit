import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import type { ToolInfo } from "@/lib/tools";

const categoryLabels = {
  convert: "Convertir",
  compress: "Comprimir",
  resize: "Redimensionar",
  edit: "Editar",
};

export default function ToolCard({ tool }: { tool: ToolInfo }) {
  return (
    <Link
      className="tool-card"
      href={tool.href}
      aria-label={`${tool.name}: abrir herramienta`}
    >
      <span className="tool-card__top">
        <span className="tool-card__icon" aria-hidden="true">
          <ImageIcon size={20} />
        </span>
        <span className="tool-card__status tool-card__status--available">
          Disponible
        </span>
      </span>
      <span className="tool-card__title">{tool.name}</span>
      <span className="tool-card__description">{tool.description}</span>
      <span className="tool-card__category">{categoryLabels[tool.category]}</span>
      <ArrowRight className="tool-card__arrow" size={18} aria-hidden="true" />
    </Link>
  );
}
