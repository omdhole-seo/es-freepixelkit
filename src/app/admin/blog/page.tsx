import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ConfirmDeleteForm from "@/components/confirm-delete-form";
import { getAdminSession } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";
import { getAllPosts } from "@/lib/blog-data";

export const metadata = createPageMetadata("/admin/blog/");

function getCategoryLabel(category: string) {
  const knownCategories: Record<string, string> = {
    ["Gu\u00edas"]: "Guides",
    ["Dise\u00f1o"]: "Design",
    Herramientas: "Tools",
  };
  return knownCategories[category] ?? category;
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    category?: string;
    page?: string;
    deleted?: string;
    saved?: string;
  }>;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login/");
  }

  const params = (await searchParams) ?? {};
  const q = (params.q ?? "").toString().trim().toLowerCase();
  const category = (params.category ?? "all").toString();
  const status = (params.status ?? "all").toString();
  const requestedPage = Number(params.page ?? "1");
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const posts = await getAllPosts();
  const filteredPosts = posts.filter((post) => {
    const queryMatches =
      !q || `${post.title} ${post.excerpt}`.toLowerCase().includes(q);
    const categoryMatches = category === "all" || category === "todas" || post.category === category;
    const statusMatches = status === "all" || status === "todos" || post.status === status;
    return queryMatches && categoryMatches && statusMatches;
  });

  const categories = ["all", ...new Set(posts.map((post) => post.category))];
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const visiblePosts = filteredPosts.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <main className="admin-page" id="contenido-principal">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="brand__mark" aria-hidden="true" />
          <span>FreePixelKit</span>
        </div>
        <nav aria-label="Admin navigation" className="admin-sidebar__nav">
          <Link href="/admin/">Dashboard</Link>
          <Link className="is-active" href="/admin/blog/">
            Blog
          </Link>
          <Link href="/admin/blog/new/">Create New Post</Link>
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Blog Management</p>
            <h1>Posts</h1>
          </div>
          <Link className="button button--primary" href="/admin/blog/new/">
            Create New Post
          </Link>
        </header>

        {params.deleted === "1" || params.saved === "1" ? (
          <p className="form-success" role="status">
            {params.deleted === "1"
              ? "Post deleted successfully."
              : "Post saved successfully."}
          </p>
        ) : null}

        <div className="admin-filter-bar">
          <form className="admin-filter-form" method="get">
            <input
              aria-label="Search posts by title or content"
              defaultValue={q}
              name="q"
              placeholder="Search posts"
              type="search"
            />
            <select aria-label="Filter by category" defaultValue={category} name="category">
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "All categories" : getCategoryLabel(item)}
                </option>
              ))}
            </select>
            <select aria-label="Filter by status" defaultValue={status} name="status">
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button className="button button--secondary" type="submit">
              Filter
            </button>
          </form>
        </div>

        <div className="admin-section-card admin-table-card">
          <div className="admin-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visiblePosts.length === 0 ? (
                  <tr>
                    <td colSpan={8}>No posts found.</td>
                  </tr>
                ) : (
                  visiblePosts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        {post.featuredImage ? (
                          <Image
                            alt={post.featuredImageAlt}
                            className="admin-table-image"
                            height={80}
                            src={post.featuredImage}
                            unoptimized
                            width={120}
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{post.title}</td>
                      <td>{post.slug}</td>
                      <td>{getCategoryLabel(post.category)}</td>
                      <td>{post.status === "published" ? "Published" : "Draft"}</td>
                      <td>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US")
                          : "—"}
                      </td>
                      <td>{new Date(post.updatedAt).toLocaleDateString("en-US")}</td>
                      <td>
                        <div className="admin-actions-inline">
                          <Link href={`/admin/blog/${post.id}/edit/`}>Edit</Link>
                          {post.status === "published" ? (
                            <Link href={`/blog/${post.slug}/`} rel="noreferrer" target="_blank">
                              View
                            </Link>
                          ) : null}
                          <ConfirmDeleteForm
                            action={`/api/admin/blog/${post.id}`}
                            title={post.title}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="admin-pagination">
            <a aria-disabled={safePage <= 1} href={`?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}&status=${encodeURIComponent(status)}&page=${Math.max(1, safePage - 1)}`}>
              Previous
            </a>
            <span>
              Page {safePage} of {totalPages}
            </span>
            <a aria-disabled={safePage >= totalPages} href={`?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}&status=${encodeURIComponent(status)}&page=${Math.min(totalPages, safePage + 1)}`}>
              Next
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
