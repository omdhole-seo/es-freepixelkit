"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import type { BlogPost } from "@/lib/blog-data";

const POSTS_PER_PAGE = 6;

export default function BlogListing({
  posts,
  initialQuery = "",
}: {
  posts: BlogPost[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("Todos");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => [
      "Todos",
      ...BLOG_CATEGORIES,
      ...new Set(
        posts
          .map((post) => post.category)
          .filter(
            (item) =>
              !BLOG_CATEGORIES.includes(item as (typeof BLOG_CATEGORIES)[number]),
          ),
      ),
    ],
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return posts.filter((post) => {
      const matchesCategory = category === "Todos" || post.category === category;
      const haystack = `${post.title} ${post.excerpt}`.toLocaleLowerCase("es");
      return matchesCategory && haystack.includes(normalizedQuery);
    });
  }, [category, posts, query]);

  const featured = filteredPosts.find((post) => post.featured) ?? filteredPosts[0] ?? null;
  const latestPosts = filteredPosts.filter((post) => post.id !== featured?.id);
  const pageCount = Math.max(1, Math.ceil(latestPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const visiblePosts = latestPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
  }

  function updateCategory(nextCategory: string) {
    setCategory(nextCategory);
    setPage(1);
  }

  return (
    <div className="blog-page blog-hub">
      <section className="blog-hub-hero">
        <div className="blog-hub-hero__orb blog-hub-hero__orb--one" aria-hidden="true" />
        <div className="blog-hub-hero__orb blog-hub-hero__orb--two" aria-hidden="true" />
        <div className="container blog-hub-hero__inner">
          <p className="eyebrow">Blog de FreePixelKit</p>
          <h1>Ideas claras para trabajar mejor con tus imágenes</h1>
          <p className="blog-hub-hero__intro">
            Guías prácticas para redimensionar, optimizar y preparar imágenes para cada uso.
          </p>
          <div className="blog-hub-hero__actions">
            <form
              action="/blog/"
              className="blog-search blog-hub-search"
              method="get"
              onSubmit={submitSearch}
              role="search"
            >
              <Search size={19} aria-hidden="true" />
              <label className="sr-only" htmlFor="blog-search">
                Buscar artículos
              </label>
              <input
                id="blog-search"
                name="q"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Buscar guías, formatos o consejos"
                type="search"
                value={query}
              />
              <button aria-label="Buscar" type="submit">
                Buscar
              </button>
            </form>
            <Link className="button button--secondary blog-admin-login" href="/admin/login/">
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      <div className="blog-hub-category-band">
        <nav
          aria-label="Filtrar artículos por categoría"
          className="container blog-category-filter blog-hub-categories"
        >
          {categories.map((option) => (
            <button
              aria-pressed={category === option}
              className={category === option ? "is-selected" : ""}
              key={option}
              onClick={() => updateCategory(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </nav>
      </div>

      <section aria-labelledby="featured-heading" className="blog-hub-featured">
        <div className="container">
          <div className="section-heading blog-hub-section-heading">
            <div>
              <p className="eyebrow">Selección editorial</p>
              <h2 id="featured-heading">Artículo destacado</h2>
            </div>
          </div>
          {featured ? (
            <div className="blog-hub-feature-layout">
              <article className="blog-featured-card blog-featured-card--editorial">
                <Link
                  aria-label={`Leer ${featured.title}`}
                  className="blog-featured-card__media"
                  href={`/blog/${featured.slug}/`}
                >
                  <Image
                    alt={featured.featuredImageAlt}
                    height={760}
                    preload
                    src={featured.featuredImage}
                    unoptimized
                    width={1280}
                  />
                </Link>
                <div className="blog-featured-card__content">
                  <div className="blog-card__meta">
                    <span className="blog-category-label">{featured.category}</span>
                    <span>
                      <Clock3 size={14} aria-hidden="true" />
                      {featured.readingTime} min de lectura
                    </span>
                  </div>
                  <h3>
                    <Link href={`/blog/${featured.slug}/`}>{featured.title}</Link>
                  </h3>
                  <p>{featured.excerpt}</p>
                  <div className="blog-card__footer">
                    <time dateTime={featured.publishedAt}>
                      {new Date(featured.publishedAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <Link href={`/blog/${featured.slug}/`}>
                      Leer artículo <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>

              <aside aria-label="Herramientas relacionadas" className="blog-hub-tool-panel">
                <p className="eyebrow">Ponlo en práctica</p>
                <h3>Prepara tu próxima imagen</h3>
                <p>
                  Aplica estos consejos con herramientas disponibles directamente en tu navegador.
                </p>
                <Link className="blog-hub-tool-link" href="/image-resizer/">
                  Redimensionar imagen <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link className="blog-hub-tool-link" href="/all-tools/">
                  Explorar herramientas <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </aside>
            </div>
          ) : (
            <p className="blog-hub-empty">No hay artículos que coincidan con esta búsqueda.</p>
          )}
        </div>
      </section>

      <section aria-labelledby="latest-heading" className="blog-hub-latest">
        <div className="container">
          <div className="section-heading blog-hub-section-heading">
            <div>
              <p className="eyebrow">Más ideas para tus imágenes</p>
              <h2 id="latest-heading">Últimos artículos</h2>
            </div>
            <span className="blog-hub-result-count">
              {latestPosts.length} {latestPosts.length === 1 ? "artículo" : "artículos"}
            </span>
          </div>

          {visiblePosts.length ? (
            <div className="blog-latest-list">
              {visiblePosts.map((post) => (
                <article className="blog-latest-card" key={post.id}>
                  <Link
                    aria-label={`Leer ${post.title}`}
                    className="blog-latest-card__media"
                    href={`/blog/${post.slug}/`}
                  >
                    <Image
                      alt={post.featuredImageAlt}
                      height={520}
                      loading="lazy"
                      src={post.featuredImage}
                      unoptimized
                      width={760}
                    />
                  </Link>
                  <div className="blog-latest-card__body">
                    <div className="blog-card__meta">
                      <span className="blog-category-label">{post.category}</span>
                      <span>
                        <Clock3 size={14} aria-hidden="true" />
                        {post.readingTime} min de lectura
                      </span>
                    </div>
                    <h3>
                      <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
                    </h3>
                    <p>{post.excerpt}</p>
                    <div className="blog-card__footer">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                      <Link href={`/blog/${post.slug}/`}>
                        Leer más <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : featured ? (
            <p className="blog-hub-empty">
              {query || category !== "Todos"
                ? "No hay más artículos para esta búsqueda o categoría."
                : "Pronto encontrarás más guías prácticas en el blog."}
            </p>
          ) : null}

          {pageCount > 1 ? (
            <nav aria-label="Paginación de artículos" className="blog-pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {pageCount}
              </span>
              <button
                disabled={currentPage === pageCount}
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                type="button"
              >
                Siguiente
              </button>
            </nav>
          ) : null}
        </div>
      </section>
    </div>
  );
}
