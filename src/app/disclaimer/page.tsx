import type { Metadata } from "next";
import LegalDraftNotice from "@/components/legal-draft-notice";
import InfoPage from "@/components/info-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Descargo de responsabilidad",
  description:
    "Lee el borrador de descargo de FreePixelKit, incluidos los límites de compatibilidad y las cuestiones que deben revisar sus responsables.",
  path: "/disclaimer/",
});

export default function DisclaimerPage() {
  return (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Descargo de responsabilidad" },
      ]}
      description="Información general sobre los límites de las herramientas disponibles. Este texto no sustituye una revisión legal."
      eyebrow="Información legal"
      title="Descargo de responsabilidad"
    >
      <LegalDraftNotice />
      <div className="legal-placeholder">
        <p>
          <strong>Responsable del sitio:</strong> [nombre legal que debe
          confirmar el titular]
        </p>
        <p>
          <strong>Canal de contacto:</strong> [dirección o canal público
          confirmado]
        </p>
        <p>
          <strong>Jurisdicción:</strong> [jurisdicción que debe revisar el
          titular]
        </p>
      </div>
      <section className="legal-section">
        <h2>Resultados de imagen</h2>
        <p>
          El redimensionador genera una copia usando el navegador y Canvas. El
          resultado depende del archivo original, las dimensiones elegidas, el
          formato de exportación, el navegador y los recursos del dispositivo.
          Cambiar las dimensiones no garantiza una mejora de nitidez ni un
          tamaño de archivo menor.
        </p>
      </section>
      <section className="legal-section">
        <h2>Compatibilidad y límites técnicos</h2>
        <p>
          La herramienta acepta JPEG, PNG y WebP que el navegador pueda abrir.
          Los formatos de exportación se comprueban en el navegador y pueden
          variar. JPEG no conserva la transparencia; las zonas transparentes
          se rellenan con blanco al exportar a ese formato.
        </p>
      </section>
      <section className="legal-section">
        <h2>Información general</h2>
        <p>
          El contenido del sitio se ofrece para describir las funciones actuales
          y no constituye asesoramiento profesional. El titular debe confirmar
          qué avisos y limitaciones adicionales son apropiados para el servicio,
          su público y las jurisdicciones en las que opere.
        </p>
      </section>
    </InfoPage>
  );
}
