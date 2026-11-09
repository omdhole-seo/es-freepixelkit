"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function SiteChrome({
  children,
  header,
  footer,
}: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  useEffect(() => {
    document.documentElement.lang = isAdmin ? "en" : "es";
  }, [isAdmin]);

  return (
    <>
      <a className="skip-link" href="#contenido-principal">
        {isAdmin ? "Skip to main content" : "Saltar al contenido principal"}
      </a>
      {!isAdmin ? header : null}
      {children}
      {!isAdmin ? footer : null}
    </>
  );
}
