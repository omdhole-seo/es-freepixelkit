import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Clock3, UserRound } from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog-data";
import { prepareBlogContent } from "@/lib/blog-validation";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      ...createPageMetadata("/blog/[slug]/"),
      title: "Artículo no encontrado | FreePixelKit",
      description: "No se encontró la publicación solicitada en el blog de FreePixelKit.",
      robots: { index: false, follow: true },
    };
  }

  return {
    ...createPageMetadata("/blog/[slug]/"),
    title: { absolute: post.metaTitle || post.title },
    description: post.metaDescription,
    alternates: { canonical: post.canonicalUrl || `/blog/${post.slug}/` },
    openGraph: {
      title: post.ogTitle || post.metaTitle || post.title,
      description: post.ogDescription || post.metaDescription,
      url: `/blog/${post.slug}/`,
      siteName: SITE_NAME,
      locale: "es_ES",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      ...(post.ogImage || post.featuredImage
        ? {
            images: [
              {
                url: post.ogImage || post.featuredImage,
                alt: post.featuredImageAlt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.ogTitle || post.metaTitle || post.title,
      description: post.ogDescription || post.metaDescription,
      ...(post.ogImage || post.featuredImage
        ? { images: [post.ogImage || post.featuredImage] }
        : {}),
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getPublishedPosts();
  const relatedPosts = allPosts
    .filter((item) => item.id !== post.id)
    .sort((left, right) => {
      const score = (candidate: (typeof allPosts)[number]) =>
        Number(candidate.category === post.category);
      return score(right) - score(left);
    })
    .slice(0, 3);
  const articleContent = prepareBlogContent(post.content);
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: "es",
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(post.featuredImage
      ? {
          image: [
            post.featuredImage.startsWith("/")
              ? `${SITE_URL}${post.featuredImage}`
              : post.featuredImage,
          ],
        }
      : {}),
  };

  return (
    <main id="contenido-principal">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <article className="blog-article-shell blog-article-shell--editorial">
        <div className="container blog-article blog-article--editorial">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Blog", href: "/blog/" },
              { label: post.title },
            ]}
          />

          <header className="blog-article__header blog-article__header--editorial">
            <div className="blog-article__meta">
              <span className="inline-badge">{post.category}</span>
              <span>
                <CalendarDays size={14} aria-hidden="true" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </span>
              {new Date(post.updatedAt).toDateString() !==
              new Date(post.publishedAt).toDateString() ? (
                <span>
                  Actualizado{" "}
                  <time dateTime={post.updatedAt}>
                    {new Date(post.updatedAt).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </span>
              ) : null}
              <span>
                <Clock3 size={14} aria-hidden="true" />
                {post.readingTime} min de lectura
              </span>
            </div>
            <h1>{post.title}</h1>
            <p className="blog-article__intro">{post.excerpt}</p>
            <div className="blog-article__author">
              <UserRound size={16} aria-hidden="true" />
              <span>{post.author}</span>
            </div>
          </header>

          <div className="blog-article__layout blog-article__layout--editorial">
            <div className="blog-article__content">
              {post.featuredImage ? (
                <Image
                  alt={post.featuredImageAlt}
                  className="blog-article__image"
                  height={700}
                  preload
                  src={post.featuredImage}
                  unoptimized
                  width={1200}
                />
              ) : null}
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: articleContent.html }}
              />
            </div>

            <aside className="blog-article__sidebar blog-article__sidebar--editorial">
              <form action="/blog/" className="blog-article-search" method="get" role="search">
                <h2>Buscar en el blog</h2>
                <label className="sr-only" htmlFor="article-blog-search">
                  Buscar artículos
                </label>
                <div className="blog-article-search__field">
                  <input
                    id="article-blog-search"
                    name="q"
                    placeholder="Buscar artículos..."
                    type="search"
                  />
                  <button aria-label="Buscar" type="submit">
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </form>

              {articleContent.headings.length ? (
                <div className="blog-article__toc">
                  <h2>En este artículo</h2>
                  <ul>
                    {articleContent.headings.map((heading) => (
                      <li key={heading.id}>
                        <a href={`#${heading.id}`}>{heading.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="blog-article__tool-cta">
                <p className="eyebrow">Herramientas FreePixelKit</p>
                <h3>Prueba estos consejos con tus imágenes</h3>
                <p>
                  Ajusta las dimensiones de una imagen con el redimensionador disponible en el navegador.
                </p>
                <Link className="button button--primary" href="/image-resizer/">
                  Redimensionar imagen <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>

          {relatedPosts.length ? <section className="related-content">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Sigue leyendo</p>
                <h2>Artículos relacionados</h2>
              </div>
            </div>
            <div className="blog-grid">
              {relatedPosts.map((related) => (
                <article className="blog-card" key={related.id}>
                  <div className="blog-card__media">
                    <Image
                      alt={related.featuredImageAlt}
                      height={500}
                      src={related.featuredImage}
                      loading="lazy"
                      unoptimized
                      width={800}
                    />
                  </div>
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      <span>{related.category}</span>
                      <span>
                        <Clock3 size={14} aria-hidden="true" />
                        {related.readingTime} min
                      </span>
                    </div>
                    <h3>{related.title}</h3>
                    <p>{related.excerpt}</p>
                    <div className="blog-card__footer">
                      <span>{new Date(related.publishedAt).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}</span>
                      <Link href={`/blog/${related.slug}/`}>
                        Leer más <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section> : null}
        </div>
      </article>

    </main>
  );
}
