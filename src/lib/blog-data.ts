import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { SITE_URL } from "@/lib/site";

export type BlogStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  status: BlogStatus;
  hasBeenPublished: boolean;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  readingTime: number;
  featured: boolean;
  toc: string[];
};

export type BlogDataFile = {
  posts: BlogPost[];
};

type BlogPostRecord = Omit<BlogPost, "createdAt" | "hasBeenPublished"> & {
  createdAt?: string;
  hasBeenPublished?: boolean;
  tags?: unknown;
};

const dataDirectory = path.resolve(/* turbopackIgnore: true */ process.env.BLOG_DATA_DIR ?? path.join(process.cwd(), "data"));
const dataFilePath = path.join(dataDirectory, "blog-posts.json");
let writeQueue: Promise<void> = Promise.resolve();

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isErrno(error: unknown, code: string) {
  return error instanceof Error && "code" in error && error.code === code;
}

function isBlogPostRecord(value: unknown): value is BlogPostRecord {
  if (!isRecord(value)) return false;
  const textFields: (keyof Omit<BlogPost, "createdAt" | "hasBeenPublished">)[] = [
    "id",
    "slug",
    "title",
    "excerpt",
    "content",
    "category",
    "featuredImage",
    "featuredImageAlt",
    "author",
    "publishedAt",
    "updatedAt",
    "metaTitle",
    "metaDescription",
    "focusKeyword",
    "canonicalUrl",
    "ogTitle",
    "ogDescription",
    "ogImage",
  ];
  return (
    textFields.every((field) => typeof value[field] === "string") &&
    (value.createdAt === undefined || typeof value.createdAt === "string") &&
    (value.hasBeenPublished === undefined || typeof value.hasBeenPublished === "boolean") &&
    (value.status === "draft" || value.status === "published") &&
    Array.isArray(value.secondaryKeywords) &&
    value.secondaryKeywords.every((keyword) => typeof keyword === "string") &&
    Array.isArray(value.toc) &&
    value.toc.every((item) => typeof item === "string") &&
    typeof value.readingTime === "number" &&
    typeof value.featured === "boolean"
  );
}

function parseBlogData(content: string): BlogDataFile {
  const parsed: unknown = JSON.parse(content);
  if (
    !isRecord(parsed) ||
    !Array.isArray(parsed.posts) ||
    !parsed.posts.every(isBlogPostRecord)
  ) {
    throw new Error(`The blog content file has an invalid format: ${dataFilePath}`);
  }
  return {
    posts: parsed.posts.map((post) => {
      const normalized = { ...post };
      delete normalized.tags;
      return {
        ...normalized,
        createdAt: post.createdAt ?? (post.publishedAt || post.updatedAt),
        hasBeenPublished: post.hasBeenPublished ?? post.status === "published",
      };
    }),
  };
}

function withWriteLock<T>(operation: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(operation, operation);
  writeQueue = result.then(() => undefined, () => undefined);
  return result;
}

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getWordCount(content: string) {
  const text = content
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:#[xX][\da-fA-F]+|#\d+|[a-zA-Z][a-zA-Z\d]+);/g, " ")
    .trim();
  return text ? text.split(/\s+/).length : 0;
}

const fallbackPosts: BlogPost[] = [
  {
    id: "redimensionar-imagen-paso-a-paso",
    slug: "redimensionar-imagen-paso-a-paso",
    title: "Redimensionar una imagen paso a paso sin deformarla",
    excerpt:
      "Aprende a ajustar el ancho y alto de una fotografía para web, documentos y redes sociales sin romper la proporción de la imagen.",
    content:
      "<h2>Qué significa redimensionar una imagen</h2><p>Redimensionar una imagen consiste en cambiar sus dimensiones en píxeles para adaptarla a un uso concreto, como una web, una publicación o un documento. Si solo cambias uno de los lados sin controlar la proporción, puedes estirar la imagen y hacer que se vea poco natural.</p><h2>Cómo mantener la proporción</h2><p>La forma más segura es activar la opción de mantener la proporción. Con esta configuración, al cambiar el ancho o el alto, el otro valor se reajusta automáticamente. Esto evita que una cara, un paisaje o una interfaz se vea deformada.</p><blockquote>Si necesitas una imagen para una web, una mayoría de ajustes funcionan mejor cuando mantienes la proporción original.</blockquote><h2>Revisa el peso del archivo final</h2><p>El tamaño del archivo también depende del formato elegido. PNG es útil si quieres conservar transparencia; JPEG suele ser más compacto para fotos; WebP puede ofrecer un buen equilibrio entre peso y calidad en navegadores modernos.</p><h2>Consejos rápidos</h2><ul><li>Usa una copia del archivo original antes de exportar.</li><li>Evita ampliar demasiado una imagen pequeña.</li><li>Reduce solo lo necesario para el canal o formato previsto.</li></ul>",
    category: "Guías",
    featuredImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    featuredImageAlt: "Persona revisando una imagen en un portátil",
    author: "Equipo FreePixelKit",
    status: "published",
    hasBeenPublished: true,
    createdAt: "2025-01-16T09:30:00.000Z",
    publishedAt: "2025-01-16T09:30:00.000Z",
    updatedAt: "2025-01-16T09:30:00.000Z",
    metaTitle: "Redimensionar imágenes sin deformarlas | Guía práctica",
    metaDescription:
      "Aprende a redimensionar imágenes sin deformarlas, conservar la proporción y exportar una copia útil para web, redes sociales o impresión.",
    focusKeyword: "redimensionar imagen",
    secondaryKeywords: ["proporción imagen", "cambiar tamaño foto", "píxeles"],
    canonicalUrl: "https://es.freepixelkit.com/blog/redimensionar-imagen-paso-a-paso/",
    ogTitle: "Guía para redimensionar imágenes sin deformarlas",
    ogDescription:
      "Consejos para ajustar dimensiones, conservar proporciones y preparar una imagen para su uso final.",
    ogImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    readingTime: 4,
    featured: true,
    toc: ["Qué significa redimensionar una imagen", "Cómo mantener la proporción", "Revisa el peso del archivo final", "Consejos rápidos"],
  },
  {
    id: "comprender-optimizar-imagen-web",
    slug: "comprender-optimizar-imagen-web",
    title: "Cómo optimizar imágenes para la web sin perder calidad",
    excerpt:
      "Una imagen bien optimizada mejora la velocidad de carga, la experiencia móvil y la claridad visual sin sobrecargar la página.",
    content:
      "<h2>Por qué importa la optimización</h2><p>La calidad de una imagen y el peso del archivo suelen entrar en conflicto. Una imagen demasiado pesada puede ralentizar la carga, mientras que un archivo muy comprimido puede perder detalle visible. La solución es encontrar un equilibrio real para cada caso.</p><h2>Qué revisar antes de exportar</h2><p>Antes de guardar tu fotografía, revisa la salida esperada: ¿va a usarse en una web, en una red social o en un documento impreso? Cada caso exige un formato y un tamaño distintos. En la web, suele interesar mantener una resolución razonable y un tamaño útil para la pantalla del usuario.</p><h2>Formato y calidad</h2><p>PNG funciona bien para logotipos o elementos con transparencia. JPEG puede ser más ligero para fotos. WebP suele ofrecer una buena relación entre tamaño y visualización en navegadores modernos. En todos los casos, es recomendable revisar la imagen final antes de publicarla.</p><h2>Checklist rápido</h2><ul><li>Compara el tamaño final del archivo.</li><li>Elige el formato correcto para el contenido.</li><li>Revisa la claridad en pantalla y móvil.</li><li>Guarda siempre una copia del original.</li></ul>",
    category: "SEO",
    featuredImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    featuredImageAlt: "Pantalla con una página web y panel de optimización",
    author: "Equipo FreePixelKit",
    status: "published",
    hasBeenPublished: true,
    createdAt: "2025-02-02T10:15:00.000Z",
    publishedAt: "2025-02-02T10:15:00.000Z",
    updatedAt: "2025-02-02T10:15:00.000Z",
    metaTitle: "Optimizar imágenes para la web | Mejores prácticas",
    metaDescription:
      "Descubre cómo reducir el tamaño de las imágenes para la web sin perder claridad ni perjudicar la experiencia del usuario.",
    focusKeyword: "optimizar imágenes web",
    secondaryKeywords: ["peso imagen web", "compresión foto", "JPEG PNG WebP"],
    canonicalUrl: "https://es.freepixelkit.com/blog/comprender-optimizar-imagen-web/",
    ogTitle: "Optimiza tus imágenes para la web y mejora la velocidad",
    ogDescription:
      "Conoce los formatos y ajustes que ayudan a mantener la calidad visual al mismo tiempo que reducen el tamaño del archivo.",
    ogImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    readingTime: 5,
    featured: false,
    toc: ["Por qué importa la optimización", "Qué revisar antes de exportar", "Formato y calidad", "Checklist rápido"],
  },
  {
    id: "guia-tamaños-redes-sociales",
    slug: "guia-tamaños-redes-sociales",
    title: "Guía rápida de tamaños de imagen para redes sociales",
    excerpt:
      "Consulta referencias para preparar tus imágenes en formatos comunes y ajustar el contenido al tamaño correcto según cada plataforma.",
    content:
      "<h2>¿Por qué importa la proporción</h2><p>En redes sociales, el mismo contenido puede verse cortado o deformado si no se prepara a la medida correcta. Cada canal suele favorecer tamaños específicos para fotos, carátulas o historias.</p><h2>Referencia útil</h2><p>Antes de publicar, revisa la relación entre ancho y alto. Si compartes una imagen en formato cuadrado, tendrá una apariencia distinta a la de un formato vertical. En general, mantener la composición visual clara ayuda a que la imagen se entienda rápidamente.</p><h2>Recomendaciones prácticas</h2><p>Para publicaciones de marca, usa proporciones estables y no conviertas la imagen a tamaños demasiado pequeños. La claridad suele depender menos del tamaño del archivo que de qué tan bien encaja la composición en el formato final.</p><h2>Antes de exportar</h2><ul><li>Comprueba el formato final.</li><li>Reduce el texto si la imagen será vista en móvil.</li><li>Haz una vista previa en la plataforma.</li><li>Guarda una versión con mayor resolución para futuras ediciones.</li></ul>",
    category: "Diseño",
    featuredImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    featuredImageAlt: "Equipo trabajando con presentación y contenido digital",
    author: "Equipo FreePixelKit",
    status: "draft",
    hasBeenPublished: false,
    createdAt: "2025-03-06T08:20:00.000Z",
    publishedAt: "2025-03-06T08:20:00.000Z",
    updatedAt: "2025-03-06T08:20:00.000Z",
    metaTitle: "Tamaños de imagen para redes sociales | guía práctica",
    metaDescription:
      "Conoce los tamaños recomendados para contenidos visuales y evita recortes o proporciones incómodas en redes sociales.",
    focusKeyword: "tamaños redes sociales",
    secondaryKeywords: ["formato foto social", "proporción visual"],
    canonicalUrl: "https://es.freepixelkit.com/blog/guia-tamaños-redes-sociales/",
    ogTitle: "Guía rápida de tamaños para redes sociales",
    ogDescription:
      "Prepárate para publicar con proporciones adecuadas y una vista previa más clara en cada plataforma.",
    ogImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    readingTime: 3,
    featured: false,
    toc: ["¿Por qué importa la proporción", "Referencia útil", "Recomendaciones prácticas", "Antes de exportar"],
  },
];

async function ensureDataFile(): Promise<BlogDataFile> {
  try {
    return parseBlogData(await readFile(dataFilePath, "utf8"));
  } catch (error) {
    if (!isErrno(error, "ENOENT")) throw error;
  }

  await mkdir(dataDirectory, { recursive: true });
  const initialContent = JSON.stringify({ posts: fallbackPosts }, null, 2);
  try {
    await writeFile(dataFilePath, initialContent, { flag: "wx" });
    return { posts: fallbackPosts };
  } catch (error) {
    if (!isErrno(error, "EEXIST")) throw error;
    return parseBlogData(await readFile(dataFilePath, "utf8"));
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const data = await ensureDataFile();
  return [...data.posts].sort(
    (left, right) =>
      Date.parse(right.publishedAt || right.createdAt) -
      Date.parse(left.publishedAt || left.createdAt),
  );
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const now = Date.now();
  return posts.filter(
    (post) => post.status === "published" && Date.parse(post.publishedAt) <= now,
  );
}

export async function getFeaturedPost(): Promise<BlogPost | null> {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.featured) ?? posts[0] ?? null;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPublishedPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.id === id) ?? null;
}

export async function savePosts(posts: BlogPost[]): Promise<void> {
  await withWriteLock(async () => {
    await mkdir(dataDirectory, { recursive: true });
    const temporaryPath = `${dataFilePath}.${randomUUID()}.tmp`;
    await writeFile(temporaryPath, JSON.stringify({ posts }, null, 2), "utf8");
    await rename(temporaryPath, dataFilePath);
  });
}

export async function upsertPost(input: Partial<BlogPost> & Pick<BlogPost, "title" | "excerpt" | "content" | "category" | "status">): Promise<BlogPost> {
  return withWriteLock(async () => {
    const posts = await getAllPosts();
    const now = new Date().toISOString();
    const existingIndex = input.id ? posts.findIndex((post) => post.id === input.id) : -1;
    const existing = existingIndex >= 0 ? posts[existingIndex] : undefined;
    const slugBase = normalizeSlug(input.title) || "articulo";
    let nextSlug = slugBase;
    let suffix = 2;
    while (posts.some((post) => post.slug === nextSlug && post.id !== existing?.id)) {
      nextSlug = `${slugBase}-${suffix}`;
      suffix += 1;
    }

    const wordCount = getWordCount(input.content);
    const featuredImage = input.featuredImage ?? existing?.featuredImage ?? "";
    const featuredImageAlt =
      input.featuredImageAlt === undefined
        ? existing?.featuredImageAlt ||
          `${input.title.trim()} — ${input.excerpt.trim()}`.slice(0, 180)
        : input.featuredImageAlt.trim() ||
          `${input.title.trim()} — ${input.excerpt.trim()}`.slice(0, 180);
    const hasBeenPublished =
      (existing?.hasBeenPublished ?? existing?.status === "published") ||
      input.status === "published";
    const publishedAt = hasBeenPublished
      ? existing?.publishedAt || now
      : "";
    const metaTitle = input.title.trim();
    const metaDescription = input.excerpt.trim();

    const saved: BlogPost = {
      id: existing?.id ?? input.id ?? nextSlug,
      slug: nextSlug,
      title: input.title.trim(),
      excerpt: input.excerpt.trim(),
      content: input.content,
      category: input.category,
      featuredImage,
      featuredImageAlt,
      author: existing?.author ?? "Equipo FreePixelKit",
      status: input.status ?? "draft",
      hasBeenPublished,
      createdAt: existing?.createdAt ?? now,
      publishedAt,
      updatedAt: now,
      metaTitle,
      metaDescription,
      focusKeyword: metaTitle,
      secondaryKeywords: [],
      canonicalUrl: `${SITE_URL}/blog/${nextSlug}/`,
      ogTitle: metaTitle,
      ogDescription: metaDescription,
      ogImage: featuredImage,
      readingTime: Math.max(1, Math.ceil(wordCount / 200)),
      featured: Boolean(input.featured),
      toc: input.toc?.length ? input.toc : existing?.toc ?? [input.title.trim()],
    };

    if (existingIndex >= 0) {
      posts[existingIndex] = saved;
    } else {
      posts.unshift(saved);
    }
    await writePosts(posts);
    return saved;
  });
}

export async function deletePostById(id: string): Promise<boolean> {
  return withWriteLock(async () => {
    const posts = await getAllPosts();
    const nextPosts = posts.filter((post) => post.id !== id);
    if (nextPosts.length === posts.length) return false;
    await writePosts(nextPosts);
    return true;
  });
}

async function writePosts(posts: BlogPost[]) {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryPath = `${dataFilePath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, JSON.stringify({ posts }, null, 2), "utf8");
  await rename(temporaryPath, dataFilePath);
}
