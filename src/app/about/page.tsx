import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, LockKeyhole, Sparkles } from "lucide-react";
import InfoPage from "@/components/info-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Acerca de",
  description:
    "Conoce el propósito de FreePixelKit y su enfoque en herramientas claras, útiles y con funciones descritas con honestidad.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Acerca de" },
      ]}
      description="FreePixelKit es un proyecto de utilidades en línea pensado para hacer más sencillas algunas tareas con archivos e imágenes."
      eyebrow="Acerca del proyecto"
      title="Herramientas útiles, explicadas con claridad"
    >
      <section className="about-lead">
        <span className="about-lead__icon" aria-hidden="true">
          <Sparkles size={25} />
        </span>
        <div>
          <h2>Una utilidad para tareas concretas</h2>
          <p>
            El objetivo de FreePixelKit es ofrecer herramientas sencillas para
            tareas cotidianas. El sitio crece de forma gradual: solo presenta
            como disponibles las funciones que ya se pueden utilizar.
          </p>
        </div>
      </section>
      <section className="info-columns" aria-label="Principios del proyecto">
        <article className="info-card">
          <span className="info-card__icon" aria-hidden="true">
            <Check size={20} />
          </span>
          <h2>Uso directo</h2>
          <p>
            Los controles describen lo que hacen y las instrucciones explican
            los formatos y límites conocidos.
          </p>
        </article>
        <article className="info-card">
          <span className="info-card__icon" aria-hidden="true">
            <LockKeyhole size={20} />
          </span>
          <h2>Procesamiento descrito con precisión</h2>
          <p>
            El redimensionador actual usa Canvas en el navegador y no envía la
            imagen a un servidor. No extendemos esa afirmación a funciones aún
            no implementadas.
          </p>
        </article>
      </section>
      <section className="info-copy">
        <h2>Un producto en desarrollo</h2>
        <p>
          FreePixelKit no publica cifras de uso, reseñas, premios ni una
          trayectoria que no estén verificadas. Las categorías sin herramientas
          disponibles se identifican claramente y no simulan operaciones.
        </p>
        <p>
          La identidad de la persona o entidad responsable y los datos de
          contacto públicos deben añadirse antes de publicar la versión
          definitiva. Consulta los borradores informativos y legales para ver
          qué información falta.
        </p>
      </section>
      <div className="page-cta">
        <div>
          <h2>Explora las herramientas disponibles</h2>
          <p>Empieza con el redimensionador de imágenes.</p>
        </div>
        <Link className="button button--primary" href="/all-tools/">
          Ver herramientas <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </InfoPage>
  );
}
