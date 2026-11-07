import Breadcrumbs, { type BreadcrumbItem } from "@/components/breadcrumbs";

export default function PageIntro({
  breadcrumbs,
  eyebrow,
  title,
  description,
}: {
  breadcrumbs: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-intro">
      <Breadcrumbs items={breadcrumbs} />
      <div className="page-intro__copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  );
}
