"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import BlogEditor from "@/components/blog-editor";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import type { BlogPost, BlogStatus } from "@/lib/blog-data";

type BlogFormState = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: string;
  featuredImageAlt: string;
  status: BlogStatus;
  featured: boolean;
};

function generateImageAlt(title: string, description: string) {
  return [title.trim(), description.trim()]
    .filter(Boolean)
    .join(" — ")
    .slice(0, 180);
}

function formatFileSize(size: number) {
  return size < 1000 ? `${size} bytes` : `${(size / 1000).toFixed(1)} KB`;
}

function isUploadResult(
  value: unknown,
): value is { url: string; size: number; width: number; height: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in value &&
    typeof value.url === "string" &&
    "size" in value &&
    typeof value.size === "number" &&
    "width" in value &&
    typeof value.width === "number" &&
    "height" in value &&
    typeof value.height === "number"
  );
}

export default function BlogAdminForm({
  initialPost,
  mode,
}: {
  initialPost?: Partial<BlogPost> | null;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [form, setForm] = useState<BlogFormState>({
    title: initialPost?.title ?? "",
    excerpt: initialPost?.excerpt ?? "",
    content: initialPost?.content ?? "",
    category: initialPost?.category ?? "",
    featuredImage: initialPost?.featuredImage ?? "",
    featuredImageAlt:
      initialPost?.featuredImageAlt ??
      generateImageAlt(initialPost?.title ?? "", initialPost?.excerpt ?? ""),
    status: initialPost?.status ?? "draft",
    featured: initialPost?.featured ?? false,
  });
  const [altWasManuallyEdited, setAltWasManuallyEdited] = useState(
    Boolean(
      initialPost?.featuredImageAlt &&
        initialPost.featuredImageAlt !==
          generateImageAlt(initialPost.title ?? "", initialPost.excerpt ?? ""),
    ),
  );
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [optimizedImageSize, setOptimizedImageSize] = useState<number | null>(null);

  useEffect(() => {
    if (
      !/^\/blog-media\/[a-f0-9-]+\.webp$/i.test(form.featuredImage) ||
      optimizedImageSize !== null
    ) {
      return;
    }

    const controller = new AbortController();
    fetch(form.featuredImage, { method: "HEAD", signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not read the optimized image size.");
        }
        const size = Number(response.headers.get("x-image-size"));
        if (!Number.isSafeInteger(size) || size <= 0) {
          throw new Error("The optimized image size is unavailable.");
        }
        setOptimizedImageSize(size);
      })
      .catch((sizeError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            sizeError instanceof Error
              ? sizeError.message
              : "Could not read the optimized image size.",
          );
        }
      });

    return () => controller.abort();
  }, [form.featuredImage, optimizedImageSize]);

  function updateField<K extends keyof BlogFormState>(
    field: K,
    value: BlogFormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateTitle(title: string) {
    setForm((current) => ({
      ...current,
      title,
      ...(altWasManuallyEdited
        ? {}
        : { featuredImageAlt: generateImageAlt(title, current.excerpt) }),
    }));
  }

  function updateDescription(excerpt: string) {
    setForm((current) => ({
      ...current,
      excerpt,
      ...(altWasManuallyEdited
        ? {}
        : { featuredImageAlt: generateImageAlt(current.title, excerpt) }),
    }));
  }

  async function handleCoverUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    setNotice("");
    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.set("file", file);
      const response = await fetch("/api/admin/blog/upload/", {
        method: "POST",
        body: uploadData,
      });
      const result: unknown = await response.json();
      if (!response.ok || !isUploadResult(result)) {
        const message =
          result &&
          typeof result === "object" &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Could not optimize and upload the image.";
        throw new Error(message);
      }

      setAltWasManuallyEdited(false);
      setForm((current) => ({
        ...current,
        featuredImage: result.url,
        featuredImageAlt: generateImageAlt(current.title, current.excerpt),
      }));
      setOptimizedImageSize(result.size);
      setNotice(
        `Image converted to WebP and optimized (${result.width} × ${result.height}).`,
      );
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not upload the image. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  function removeImage() {
    setAltWasManuallyEdited(false);
    setForm((current) => ({
      ...current,
      featuredImage: "",
      featuredImageAlt: generateImageAlt(current.title, current.excerpt),
    }));
    setOptimizedImageSize(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const title = form.title.trim();
    const excerpt = form.excerpt.trim();
    const contentIsPresent = form.content.replace(/<[^>]*>/g, "").trim().length > 0;
    if (
      !title ||
      !excerpt ||
      !form.category ||
      (form.status === "published" &&
        (!contentIsPresent || !form.featuredImage))
    ) {
      setError(
        form.status === "published"
          ? "Published posts need a title, description, category, post content, and featured image."
          : "Enter a title, description, and category before saving the draft.",
      );
      return;
    }

    setIsSaving(true);
    const endpoint =
      mode === "create"
        ? "/api/admin/blog"
        : `/api/admin/blog/${initialPost?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content: form.content,
          category: form.category,
          featuredImage: form.featuredImage,
          featuredImageAlt: form.featuredImageAlt,
          status: form.status,
          featured: form.featured,
        }),
      });
      const result: unknown = await response.json();
      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        !("post" in result)
      ) {
        const message =
          result &&
          typeof result === "object" &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Could not save the post.";
        throw new Error(message);
      }
      router.push("/admin/blog/?saved=1");
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save the post. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form__grid">
        <div className="field-group span-2">
          <label className="field-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            maxLength={150}
            minLength={2}
            onChange={(event) => updateTitle(event.target.value)}
            required
            type="text"
            value={form.title}
          />
        </div>

        <div className="field-group span-2">
          <label className="field-label" htmlFor="excerpt">
            Description
          </label>
          <textarea
            id="excerpt"
            maxLength={400}
            onChange={(event) => updateDescription(event.target.value)}
            required
            rows={3}
            value={form.excerpt}
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            onChange={(event) => updateField("category", event.target.value)}
            required
            value={form.category}
          >
            <option disabled value="">
              Select a category
            </option>
            {form.category && !BLOG_CATEGORIES.includes(
              form.category as (typeof BLOG_CATEGORIES)[number],
            ) ? (
              <option value={form.category}>{form.category} (existing post)</option>
            ) : null}
            {BLOG_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group span-2">
          <BlogEditor
            label="Post Content"
            onChange={(nextValue) => updateField("content", nextValue)}
            value={form.content}
          />
        </div>

        <div className="field-group span-2">
          <label className="field-label" htmlFor="coverUpload">
            Featured Image
          </label>
          <p>Upload a JPEG, JPG, PNG, or WebP image up to 5 MB.</p>
          <input
            accept="image/jpeg,image/jpg,image/png,image/webp"
            disabled={isUploading}
            id="coverUpload"
            onChange={handleCoverUpload}
            type="file"
          />
          {isUploading ? <p role="status">Optimizing and uploading image…</p> : null}
          {form.featuredImage ? (
            <div className="admin-form__image-details">
              <Image
                alt={form.featuredImageAlt}
                className="admin-form__cover-preview"
                height={180}
                src={form.featuredImage}
                unoptimized
                width={320}
              />
              {optimizedImageSize !== null ? (
                <p role="status">
                  Optimized WebP size: {formatFileSize(optimizedImageSize)}
                </p>
              ) : null}
              <button
                className="button button--secondary"
                disabled={isUploading}
                onClick={removeImage}
                type="button"
              >
                Remove image
              </button>
            </div>
          ) : null}
          <label className="field-label" htmlFor="featuredImageAlt">
            Image Alt Text
          </label>
          <input
            id="featuredImageAlt"
            maxLength={180}
            onChange={(event) => {
              setAltWasManuallyEdited(true);
              updateField("featuredImageAlt", event.target.value);
            }}
            type="text"
            value={form.featuredImageAlt}
          />
          <p>Generated from the title and description. Edit it if needed.</p>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="featured">
            Featured Post
          </label>
          <input
            checked={form.featured}
            id="featured"
            onChange={(event) => updateField("featured", event.target.checked)}
            type="checkbox"
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            onChange={(event) =>
              updateField("status", event.target.value as BlogStatus)
            }
            value={form.status}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="form-success" role="status">
          {notice}
        </p>
      ) : null}

      <div className="admin-actions">
        <button
          aria-expanded={showPreview}
          className="button button--secondary"
          onClick={() => setShowPreview((current) => !current)}
          type="button"
        >
          {showPreview ? "Close Preview" : "Preview"}
        </button>
        <button
          className="button button--primary"
          disabled={isSaving || isUploading}
          type="submit"
        >
          {isSaving
            ? "Saving..."
            : form.status === "draft"
              ? "Save Draft"
              : mode === "create"
                ? "Publish"
                : "Update Post"}
        </button>
        <button
          className="button button--secondary"
          onClick={() => router.back()}
          type="button"
        >
          Cancel
        </button>
      </div>

      {showPreview ? (
        <section aria-label="Post preview" className="blog-admin-preview">
          <p className="eyebrow">
            Preview · {form.status === "published" ? "Published" : "Draft"}
          </p>
          {form.featuredImage ? (
            <Image
              alt={form.featuredImageAlt}
              className="admin-form__cover-preview"
              height={500}
              src={form.featuredImage}
              unoptimized
              width={900}
            />
          ) : null}
          <h2>{form.title || "Post title"}</h2>
          <p>{form.excerpt || "The post description will appear here."}</p>
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: form.content }}
          />
        </section>
      ) : null}
    </form>
  );
}
