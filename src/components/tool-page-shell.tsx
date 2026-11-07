import type { ReactNode } from "react";
import Breadcrumbs from "@/components/breadcrumbs";

export default function ToolPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="tool-page" id="contenido-principal">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Herramientas de imagen", href: "/#herramientas-imagen" },
            { label: title },
          ]}
        />
        <header className="tool-page-heading">
          <p className="eyebrow">Herramienta de imagen</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </header>
        {children}
      </div>
    </main>
  );
}
