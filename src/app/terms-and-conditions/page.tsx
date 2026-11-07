import type { Metadata } from "next";
import LegalDraftNotice from "@/components/legal-draft-notice";
import InfoPage from "@/components/info-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Términos y condiciones",
  description:
    "Consulta el borrador de términos de uso de FreePixelKit y los datos que debe confirmar la persona responsable.",
  path: "/terms-and-conditions/",
});

export default function TermsPage() {
  return (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Términos y condiciones" },
      ]}
      description="Borrador general sobre el acceso a la versión actual del sitio. Debe revisarse y completarse antes de su publicación definitiva."
      eyebrow="Información legal"
      title="Términos y condiciones"
    >
      <LegalDraftNotice />
      <div className="legal-placeholder">
        <p>
          <strong>Responsable del sitio:</strong> [nombre legal de la persona o
          entidad responsable]
        </p>
        <p>
          <strong>Contacto:</strong> [dirección o canal público confirmado]
        </p>
        <p>
          <strong>Jurisdicción y normas aplicables:</strong> [datos que debe
          confirmar la persona responsable]
        </p>
      </div>
      <section className="legal-section">
        <h2>Alcance del servicio</h2>
        <p>
          FreePixelKit ofrece actualmente una herramienta para redimensionar
          imágenes en el navegador y páginas informativas sobre otras
          categorías. Una página de categoría no implica que exista un
          procesador o servicio de esa clase.
        </p>
      </section>
      <section className="legal-section">
        <h2>Uso del redimensionador</h2>
        <p>
          La herramienta acepta archivos JPEG, PNG y WebP cuando el navegador
          puede decodificarlos. La exportación depende de la compatibilidad del
          navegador y está limitada a 12.000 píxeles por lado y 100 millones de
          píxeles por imagen. El usuario debe revisar el resultado y conservar
          sus propios originales.
        </p>
        <p>
          Las imágenes seleccionadas se procesan con Canvas localmente en el
          navegador; el código de la herramienta no las envía a un servidor.
          La calidad, el tamaño y la disponibilidad pueden variar por
          dispositivo y navegador.
        </p>
      </section>
      <section className="legal-section">
        <h2>Disponibilidad y cambios</h2>
        <p>
          Las funciones pueden cambiar mientras el proyecto evoluciona. El
          responsable debe definir, revisar y completar las condiciones sobre
          disponibilidad, propiedad intelectual, usos no permitidos, garantías
          y limitaciones de responsabilidad de acuerdo con la operación real y
          las normas aplicables.
        </p>
      </section>
      <section className="legal-section">
        <h2>Contacto y entrada en vigor</h2>
        <p>
          No hay un canal de contacto de envío configurado en la versión
          actual. Antes de publicar estos términos, completa [canal público de
          contacto], [fecha de entrada en vigor] y la información legal que
          corresponda.
        </p>
      </section>
    </InfoPage>
  );
}
