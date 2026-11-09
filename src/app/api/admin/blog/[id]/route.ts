import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, isSameOriginRequest } from "@/lib/admin-auth";
import { deletePostById, getPostById, upsertPost } from "@/lib/blog-data";
import { validateBlogPostInput } from "@/lib/blog-validation";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getPostById(id);
  if (!existing) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 1_100_000) {
    return NextResponse.json({ error: "Post content exceeds the allowed size." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The submitted content is invalid." }, { status: 400 });
  }
  const validation = validateBlogPostInput(body, {
    existingCategory: existing.category,
    existingFeaturedImage: existing.featuredImage,
  });
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const updated = await upsertPost({ ...validation.data, id });
    return NextResponse.json({ post: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "A post with this slug already exists.") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    throw error;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const method = String(formData.get("_method") ?? "");
  if (method.toUpperCase() === "DELETE") {
    const { id } = await params;
    const deleted = await deletePostById(id);
    if (!deleted) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    return NextResponse.redirect(new URL("/admin/blog/?deleted=1", request.url));
  }

  return NextResponse.json({ error: "Method not supported." }, { status: 405 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deletePostById(id);
  if (!deleted) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.redirect(new URL("/admin/blog/?deleted=1", request.url));
}
