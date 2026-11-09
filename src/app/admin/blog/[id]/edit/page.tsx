import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import BlogAdminForm from "@/components/blog-admin-form";
import { getAdminSession } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";
import { getPostById } from "@/lib/blog-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    ...createPageMetadata("/admin/blog/[id]/edit/"),
    title: { absolute: "Edit Post | FreePixelKit" },
    alternates: { canonical: `/admin/blog/${id}/edit/` },
  };
}

export default async function AdminEditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login/");
  }

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    notFound();
  }

  return (
    <main className="admin-page" id="contenido-principal">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="brand__mark" aria-hidden="true" />
          <span>FreePixelKit</span>
        </div>
        <nav aria-label="Admin navigation" className="admin-sidebar__nav">
          <Link href="/admin/">Dashboard</Link>
          <Link href="/admin/blog/">Blog</Link>
          <Link className="is-active" href={`/admin/blog/${id}/edit/`}>
            Edit Post
          </Link>
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Edit Post</p>
            <h1>{post.title}</h1>
          </div>
        </header>

        <div className="admin-section-card">
          <BlogAdminForm initialPost={post} mode="edit" />
        </div>
      </section>
    </main>
  );
}
