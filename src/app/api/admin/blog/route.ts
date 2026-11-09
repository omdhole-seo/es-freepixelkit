import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, isSameOriginRequest } from "@/lib/admin-auth";
import { getAllPosts, upsertPost } from "@/lib/blog-data";
import { validateBlogPostInput } from "@/lib/blog-validation";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const posts = await getAllPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
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
  const validation = validateBlogPostInput(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const nextPost = await upsertPost({ ...validation.data, id: undefined });
    return NextResponse.json({ post: nextPost }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "A post with this slug already exists.") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    throw error;
  }
}
