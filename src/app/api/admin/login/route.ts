import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminSessionCookie,
  getAdminSession,
  isAdminConfigured,
  isValidAdminLogin,
  isSameOriginRequest,
  setAdminSessionCookie,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const session = await getAdminSession();
  if (session) {
    return NextResponse.redirect(new URL("/admin/", request.url));
  }

  if (!isAdminConfigured()) {
    if ((request.headers.get("content-type") ?? "").includes("application/json")) {
      return NextResponse.json(
        { error: "Admin authentication is not configured on the server." },
        { status: 503 },
      );
    }
    return NextResponse.redirect(new URL("/admin/login/?error=configuration", request.url));
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    let body: Record<string, unknown>;
    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const username = String(body.username ?? "");
    const password = String(body.password ?? "");
    if (!isValidAdminLogin(username, password)) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true });
    setAdminSessionCookie(response, username);
    return response;
  }

  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!isValidAdminLogin(username, password)) {
    const response = NextResponse.redirect(new URL("/admin/login/?error=invalid", request.url));
    clearAdminSessionCookie(response);
    return response;
  }

  const response = NextResponse.redirect(new URL("/admin/", request.url));
  setAdminSessionCookie(response, username);
  return response;
}
