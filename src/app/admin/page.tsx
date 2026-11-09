import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";
import { getAllPosts } from "@/lib/blog-data";

export const metadata = createPageMetadata("/admin/");

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login/");
  }

  const posts = await getAllPosts();
  const publishedPosts = posts.filter((post) => post.status === "published");
  const draftPosts = posts.filter((post) => post.status === "draft");
  const recentPosts = posts.slice(0, 4);
  const updatedAfterPublishing = posts.filter(
    (post) => Date.parse(post.updatedAt) > Date.parse(post.publishedAt),
  ).length;

  return (
    <main className="admin-page" id="contenido-principal">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="brand__mark" aria-hidden="true" />
          <span>FreePixelKit</span>
        </div>
        <nav aria-label="Admin navigation" className="admin-sidebar__nav">
          <Link className="is-active" href="/admin/">
            Dashboard
          </Link>
          <Link href="/admin/blog/">Blog</Link>
          <Link href="/admin/blog/new/">Create New Post</Link>
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Blog Overview</h1>
          </div>
          <div className="admin-topbar__actions">
            <Link className="button button--secondary" href="/">
              View Website
            </Link>
            <form action="/api/admin/logout" method="post">
              <button className="button button--primary" type="submit">
                Logout
              </button>
            </form>
          </div>
        </header>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span>Total Posts</span>
            <strong>{posts.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Published</span>
            <strong>{publishedPosts.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Drafts</span>
            <strong>{draftPosts.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Updated After Publishing</span>
            <strong>{updatedAfterPublishing}</strong>
          </div>
        </div>

        <div className="admin-section-card">
          <div className="admin-section-card__header">
            <h2>Recently Updated</h2>
            <Link className="text-link" href="/admin/blog/">
              Manage Blog
            </Link>
          </div>
          <div className="admin-list">
            {recentPosts.map((post) => (
              <div className="admin-list__item" key={post.id}>
                <div>
                  <strong>{post.title}</strong>
                  <small>{post.status === "published" ? "Published" : "Draft"}</small>
                </div>
                <Link href={`/admin/blog/${post.id}/edit/`}>Edit</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
