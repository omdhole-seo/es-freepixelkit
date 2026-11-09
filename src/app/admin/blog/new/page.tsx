import Link from "next/link";
import { redirect } from "next/navigation";
import BlogAdminForm from "@/components/blog-admin-form";
import { getAdminSession } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("/admin/blog/new/");

export default async function AdminCreateBlogPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login/");
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
          <Link className="is-active" href="/admin/blog/new/">
            Create New Post
          </Link>
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Create New Post</p>
            <h1>New Blog Post</h1>
          </div>
        </header>

        <div className="admin-section-card">
          <BlogAdminForm mode="create" />
        </div>
      </section>
    </main>
  );
}
