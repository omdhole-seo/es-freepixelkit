import sanitizeHtml from "sanitize-html";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";

export type ValidatedBlogPostInput = {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: string;
  featuredImageAlt: string;
  status: "draft" | "published";
  featured: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validImageReference(value: string) {
  if (/^\/blog-media\/[a-f0-9-]+\.(jpg|png|webp)$/i.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeBlogHtml(content: string) {
  return sanitizeHtml(content, {
    allowedTags: [
      "h2", "h3", "p", "br", "strong", "b", "em", "i", "s", "ul", "ol",
      "li", "a", "img", "blockquote", "table", "thead", "tbody", "tr",
      "th", "td", "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
  });
}

export function prepareBlogContent(content: string) {
  const headings: { id: string; label: string }[] = [];
  const html = sanitizeBlogHtml(content).replace(
    /<h([23])>([\s\S]*?)<\/h\1>/gi,
    (_match, level: string, inner: string) => {
      const label = inner
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .trim();
      const base = label
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-") || `seccion-${headings.length + 1}`;
      let id = base;
      let suffix = 2;
      while (headings.some((heading) => heading.id === id)) {
        id = `${base}-${suffix}`;
        suffix += 1;
      }
      headings.push({ id, label });
      return `<h${level} id="${id}">${inner}</h${level}>`;
    },
  );
  return { html, headings };
}

export function validateBlogPostInput(
  value: unknown,
  options: { existingCategory?: string; existingFeaturedImage?: string } = {},
):
  | { success: true; data: ValidatedBlogPostInput }
  | { success: false; error: string } {
  if (!isRecord(value)) {
    return { success: false, error: "The submitted content is invalid." };
  }

  const stringValue = (key: string) =>
    typeof value[key] === "string" ? value[key].trim() : "";
  const title = stringValue("title");
  const excerpt = stringValue("excerpt");
  const content = typeof value.content === "string" ? value.content : "";
  const category = stringValue("category");
  const status = value.status;
  const featuredImage = stringValue("featuredImage");
  const featuredImageAlt = stringValue("featuredImageAlt");
  const allowedCategory =
    BLOG_CATEGORIES.includes(category as (typeof BLOG_CATEGORIES)[number]) ||
    category === options.existingCategory;

  if (title.length < 2 || title.length > 150) {
    return { success: false, error: "The title must be between 2 and 150 characters." };
  }
  if (!excerpt || excerpt.length > 400) {
    return { success: false, error: "Enter a description of no more than 400 characters." };
  }
  if (content.length > 1_000_000) {
    return { success: false, error: "Content cannot exceed 1 MB." };
  }
  if (!allowedCategory) {
    return { success: false, error: "Select one of the available blog categories." };
  }
  if (status !== "draft" && status !== "published") {
    return { success: false, error: "The post status is invalid." };
  }
  if (featuredImage && !validImageReference(featuredImage)) {
    return { success: false, error: "The featured image is invalid." };
  }
  if (
    featuredImage &&
    !/^\/blog-media\/[a-f0-9-]+\.webp$/i.test(featuredImage) &&
    featuredImage !== options.existingFeaturedImage
  ) {
    return { success: false, error: "Upload the featured image as an optimized WebP file." };
  }
  if (status === "published") {
    if (!sanitizeBlogHtml(content).replace(/<[^>]*>/g, "").trim()) {
      return { success: false, error: "Published posts need post content." };
    }
    if (!featuredImage) {
      return { success: false, error: "Published posts need a featured image." };
    }
  }
  if (featuredImageAlt.length > 180) {
    return { success: false, error: "Image alt text must be no more than 180 characters." };
  }

  return {
    success: true,
    data: {
      ...(typeof value.id === "string" && value.id ? { id: value.id } : {}),
      title,
      excerpt,
      content: sanitizeBlogHtml(content),
      category,
      featuredImage,
      featuredImageAlt,
      status,
      featured: value.featured === true,
    },
  };
}
