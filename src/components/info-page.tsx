import type { ReactNode } from "react";
import PageIntro from "@/components/page-intro";
import type { BreadcrumbItem } from "@/components/breadcrumbs";

export default function InfoPage({
  breadcrumbs,
  eyebrow = "FreePixelKit",
  title,
  description,
  children,
}: {
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="info-page" id="contenido-principal">
      <div className="container">
        <PageIntro
          breadcrumbs={breadcrumbs}
          description={description}
          eyebrow={eyebrow}
          title={title}
        />
        <div className="info-page__content">{children}</div>
      </div>
    </main>
  );
}
