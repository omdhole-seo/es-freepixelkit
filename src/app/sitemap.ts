import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SITE_PAGES } from "@/lib/site-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    changeFrequency:
      page.path === "/" || page.path === "/blog/" ? "weekly" : "monthly",
    priority:
      page.path === "/"
        ? 1
        : page.path === "/image-resizer/" || page.path === "/all-tools/"
          ? 0.8
          : 0.6,
  }));
}
