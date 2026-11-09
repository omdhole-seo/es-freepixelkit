import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("/admin/login/");

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin/");
  }
  const params = (await searchParams) ?? {};
  const configured = isAdminConfigured();

  return (
    <main className="admin-login-page" id="contenido-principal">
      <div className="admin-login-card">
        <p className="eyebrow">Admin Access</p>
        <h1>Admin Login</h1>
        <p>
          Sign in to manage blog posts in the secure administration panel.
        </p>

        {params.error === "invalid" ? (
          <p className="form-error" role="alert">The username or password is incorrect.</p>
        ) : null}
        {!configured ? (
          <p className="form-error" role="alert">
            Admin access is not configured. Set ADMIN_USERNAME, an ADMIN_PASSWORD of at least 16 characters, and an ADMIN_SESSION_SECRET of at least 32 characters in the server environment.
          </p>
        ) : null}

        {configured ? (
        <form action="/api/admin/login" className="admin-login-form" method="post">
          <label className="field-label" htmlFor="username">
            Username
          </label>
          <input autoComplete="username" id="username" name="username" required type="text" />

          <label className="field-label" htmlFor="password">
            Password
          </label>
          <input autoComplete="current-password" id="password" name="password" required type="password" />

          <button className="button button--primary" type="submit">
            Sign in
          </button>
        </form>
        ) : null}

        <p className="admin-login-note">
          Never use example credentials or commit secrets to the repository.
        </p>

        <Link className="text-link" href="/">
          Back to website
        </Link>
      </div>
    </main>
  );
}
