"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import ToolSearch from "@/components/tool-search";
import { availableTools } from "@/lib/tools";

const navigation = [
  { label: "Inicio", href: "/", matches: ["/"] },
  { label: "Todas las herramientas", href: "/all-tools/", matches: ["/all-tools/"] },
  {
    label: "Herramientas de imagen",
    href: "/image-tools/",
    matches: [
      "/image-tools/",
      "/compress/",
      "/resize/",
      "/convert/",
      "/edit/",
      "/image-resizer/",
    ],
  },
  { label: "Blog", href: "/blog/", matches: ["/blog/"] },
  { label: "Acerca de", href: "/about/", matches: ["/about/"] },
  { label: "Contacto", href: "/contact/", matches: ["/contact/"] },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  function closeMobileMenu(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a")) {
      mobileMenuRef.current?.removeAttribute("open");
    }
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand" href="/" aria-label="FreePixelKit, inicio">
          <Image
            alt=""
            className="brand__logo"
            height={94}
            preload
            sizes="(max-width: 520px) 165px, (max-width: 760px) 180px, 190px"
            src="/brand/freepixelkit-logo.png"
            width={270}
          />
        </Link>

        <nav className="main-nav" aria-label="Navegación principal">
          {navigation.map((item) => {
            const active = item.matches.includes(pathname);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={active ? "is-active" : undefined}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-search">
          <ToolSearch
            inputId="header-tool-search"
            tools={availableTools}
            variant="header"
          />
        </div>

        <details className="mobile-nav" ref={mobileMenuRef}>
          <summary
            aria-controls="mobile-navigation-panel"
            aria-label="Abrir o cerrar la navegación principal"
          >
            <Menu size={21} aria-hidden="true" />
          </summary>
          <div
            className="mobile-nav__panel"
            id="mobile-navigation-panel"
            onClick={closeMobileMenu}
          >
            <Link
              className="mobile-nav__brand"
              href="/"
              aria-label="FreePixelKit, inicio"
            >
              <Image
                alt=""
                height={56}
                sizes="32px"
                src="/brand/freepixelkit-mark.png"
                width={56}
              />
              <span>FreePixelKit</span>
            </Link>
            <nav aria-label="Navegación móvil">
              {navigation.map((item) => {
                const active = item.matches.includes(pathname);
                return (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={active ? "is-active" : undefined}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mobile-nav__search">
              <ToolSearch
                inputId="mobile-tool-search"
                tools={availableTools}
                variant="header"
              />
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
