import Image from "next/image";
import Link from "next/link";

const toolLinks = [
  { label: "Todas las herramientas", href: "/all-tools/" },
  { label: "Herramientas de imagen", href: "/image-tools/" },
  { label: "Comprimir imágenes", href: "/compress/" },
  { label: "Redimensionar imágenes", href: "/resize/" },
  { label: "Convertir imágenes", href: "/convert/" },
  { label: "Editar imágenes", href: "/edit/" },
];

const infoLinks = [
  { label: "Acerca de", href: "/about/" },
  { label: "Contacto", href: "/contact/" },
  { label: "Blog", href: "/blog/" },
  { label: "Mapa del sitio", href: "/sitemap/" },
  { label: "Política de privacidad", href: "/privacy-policy/" },
  { label: "Términos y condiciones", href: "/terms-and-conditions/" },
  { label: "Descargo de responsabilidad", href: "/disclaimer/" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__main">
        <div className="site-footer__brand">
          <Link className="brand" href="/" aria-label="FreePixelKit, inicio">
            <Image
              alt=""
              className="brand__logo"
              height={94}
              sizes="(max-width: 520px) 165px, 190px"
              src="/brand/freepixelkit-logo.png"
              width={270}
            />
          </Link>
          <p>
            Herramientas prácticas para tus imágenes, con funciones disponibles
            y limitaciones explicadas con claridad.
          </p>
          <Link className="site-footer__popular-link" href="/image-resizer/">
            Redimensionar imagen
          </Link>
        </div>
        <nav className="footer-column" aria-label="Herramientas">
          <h2>Herramientas</h2>
          {toolLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <nav className="footer-column" aria-label="Herramientas populares">
          <h2>Herramientas populares</h2>
          <Link href="/image-resizer/">Redimensionar imagen</Link>
          <Link href="/all-tools/">Ver todas las herramientas disponibles</Link>
        </nav>
        <nav className="footer-column" aria-label="Información">
          <h2>Información</h2>
          {infoLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container site-footer__bottom">
        <p>© FreePixelKit. Todos los derechos reservados.</p>
        <p>El sitio solo presenta como disponibles las funciones implementadas.</p>
      </div>
    </footer>
  );
}
