import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import pages from "@/lib/seo-pages.json";

export const indexablePagePaths = pages
  .filter((page) => page.indexable)
  .map((page) => page.path);

export function createPageMetadata(path: string): Metadata {
  const page = pages.find((item) => item.path === path);
  if (!page) {
    throw new Error(`No hay metadatos SEO definidos para la ruta ${path}.`);
  }

  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: path,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    ...(!page.indexable
      ? { robots: { index: false, follow: page.follow ?? true } }
      : {}),
  };
}
