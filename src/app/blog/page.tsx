import Breadcrumbs from "@/components/breadcrumbs";
import BlogListing from "@/components/blog-listing";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedPosts } from "@/lib/blog-data";

export const metadata = createPageMetadata("/blog/");
export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const posts = await getPublishedPosts();
  const params = (await searchParams) ?? {};
  const initialQuery = typeof params.q === "string" ? params.q : "";

  return (
    <main id="contenido-principal">
      <div className="container blog-listing-breadcrumb">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Blog" },
          ]}
        />
      </div>
      <BlogListing initialQuery={initialQuery} posts={posts} />
    </main>
  );
}
