import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Private FreePixelKit blog management panel.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="admin-route">
      <a className="skip-link" href="#contenido-principal">
        Skip to main content
      </a>
      {children}
    </div>
  );
}
