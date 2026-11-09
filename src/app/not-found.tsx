import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Página no encontrada | FreePixelKit" },
  description: "La página solicitada no existe o ya no está disponible.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="section" id="contenido-principal">
      <div className="container empty-state">
        <div>
          <p className="eyebrow">Error 404</p>
          <h1>No encontramos esta página</h1>
          <p>Comprueba la dirección o vuelve al inicio para encontrar una herramienta.</p>
          <Link className="button button--primary" href="/">
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
