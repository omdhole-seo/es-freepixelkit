import type { MetadataRoute } from "next";
import { indexablePagePaths } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import { SITE_PAGES } from "@/lib/site-pages";
import { getPublishedPosts } from "@/lib/blog-data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = SITE_PAGES.filter((page) =>
    indexablePagePaths.includes(page.path),
  ).map((page) => ({
    url: `${SITE_URL}${page.path}`,
    changeFrequency: page.path === "/" ? "weekly" as const : "monthly" as const,
    priority:
      page.path === "/"
        ? 1
        : page.path === "/image-resizer/" || page.path === "/all-tools/"
          ? 0.8
          : 0.6,
  }));
  const posts = await getPublishedPosts();
  return [
    ...pages,
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}/`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
