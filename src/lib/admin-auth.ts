import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import type { NextRequest, NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "fpk_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const MAX_CLOCK_SKEW_MS = 30 * 1000;

export type AdminSession = {
  username: string;
  issuedAt: number;
};

export function isAdminConfigured() {
  return getAdminCredentials() !== null;
}

function constantTimeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function isSameOriginRequest(request: NextRequest) {
  const source = request.headers.get("origin") ?? request.headers.get("referer");
  if (!source) return false;

  try {
    const sourceOrigin = new URL(source).origin;
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0].trim();
    const host = forwardedHost || request.headers.get("host");
    const forwardedProtocol = request.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      .trim();
    const requestUrl = new URL(request.url);
    const protocol = forwardedProtocol || requestUrl.protocol.slice(0, -1);
    if (protocol !== "http" && protocol !== "https") return false;
    const expectedOrigin = host ? new URL(`${protocol}://${host}`).origin : requestUrl.origin;
    return sourceOrigin === expectedOrigin;
  } catch {
    return false;
  }
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (
    !username ||
    username.length > 80 ||
    !password ||
    password.length < 16 ||
    !secret ||
    secret.length < 32 ||
    username.includes(":")
  ) {
    return null;
  }

  return {
    username,
    password,
    secret,
  };
}

export function createSessionToken(username: string) {
  const credentials = getAdminCredentials();
  if (!credentials) {
    throw new Error("Admin authentication is not configured correctly.");
  }

  const payload = `${username}:${Date.now()}`;
  const signature = createHmac("sha256", credentials.secret).update(payload).digest("hex");
  return `${encode(payload)}.${signature}`;
}

export function verifySessionToken(token: string | undefined): AdminSession | null {
  const credentials = getAdminCredentials();
  if (!token || !credentials) return null;
  const [payloadPart, expectedSignature, extra] = token.split(".");
  if (!payloadPart || !expectedSignature || extra || !/^[a-f0-9]{64}$/i.test(expectedSignature)) {
    return null;
  }

  try {
    const rawPayload = decode(payloadPart);
    const expected = createHmac("sha256", credentials.secret)
      .update(rawPayload)
      .digest("hex");

    const bufferExpected = Buffer.from(expected, "hex");
    const bufferProvided = Buffer.from(expectedSignature, "hex");
    if (bufferExpected.length !== bufferProvided.length) {
      return null;
    }

    const isValid = timingSafeEqual(bufferExpected, bufferProvided);
    if (!isValid) {
      return null;
    }

    const [username, issuedAtValue] = rawPayload.split(":");
    const issuedAt = Number(issuedAtValue);
    const now = Date.now();
    if (
      username !== credentials.username ||
      !Number.isFinite(issuedAt) ||
      issuedAt > now + MAX_CLOCK_SKEW_MS ||
      now - issuedAt > SESSION_DURATION_MS
    ) {
      return null;
    }

    return { username, issuedAt };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login/");
  }
  return session;
}

export function setAdminSessionCookie(response: NextResponse, username: string) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createSessionToken(username),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function isValidAdminLogin(username: string, password: string) {
  const credentials = getAdminCredentials();
  if (!credentials) return false;
  const usernameMatches = constantTimeEqual(username, credentials.username);
  const passwordMatches = constantTimeEqual(password, credentials.password);
  return usernameMatches && passwordMatches;
}
