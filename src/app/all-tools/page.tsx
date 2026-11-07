import type { Metadata } from "next";
import InfoPage from "@/components/info-page";
import ToolsDirectory from "@/components/tools-directory";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Todas las herramientas",
  description:
    "Busca y filtra las herramientas disponibles en FreePixelKit. Consulta su categoría y abre funciones implementadas.",
  path: "/all-tools/",
});

export default function AllToolsPage() {
  return (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Todas las herramientas" },
      ]}
      description="Busca por nombre o tarea y filtra por categoría. Este directorio solo incluye herramientas que ya se pueden utilizar."
      eyebrow="Directorio"
      title="Todas las herramientas"
    >
      <ToolsDirectory />
    </InfoPage>
  );
}
