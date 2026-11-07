import type { MetadataRoute } from "next";
import { indexablePagePaths } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import { SITE_PAGES } from "@/lib/site-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_PAGES.filter((page) =>
    indexablePagePaths.includes(page.path),
  ).map((page) => ({
    url: `${SITE_URL}${page.path}`,
    changeFrequency: page.path === "/" ? "weekly" : "monthly",
    priority:
      page.path === "/"
        ? 1
        : page.path === "/image-resizer/" || page.path === "/all-tools/"
          ? 0.8
          : 0.6,
  }));
}
