import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminSessionCookie,
  getAdminSession,
  isSameOriginRequest,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const session = await getAdminSession();
  const response = NextResponse.redirect(new URL("/admin/login/", request.url));
  if (session) {
    clearAdminSessionCookie(response);
  }
  return response;
}
