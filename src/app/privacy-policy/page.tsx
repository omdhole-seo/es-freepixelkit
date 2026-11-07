import LegalDraftNotice from "@/components/legal-draft-notice";
import InfoPage from "@/components/info-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("/privacy-policy/");

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Política de privacidad" },
      ]}
      description="Información preliminar sobre las funciones actuales y los datos que aún debe confirmar la persona responsable del sitio."
      eyebrow="Información legal"
      title="Política de privacidad"
    >
      <LegalDraftNotice />
      <div className="legal-placeholder">
        <p>
          <strong>Responsable:</strong> [nombre legal de la persona o entidad
          responsable]
        </p>
        <p>
          <strong>Contacto de privacidad:</strong> [dirección de correo u otro
          canal público confirmado]
        </p>
        <p>
          <strong>Jurisdicción aplicable:</strong> [jurisdicción que debe
          confirmar la persona responsable]
        </p>
        <p>
          <strong>Última revisión:</strong> [fecha de revisión]
        </p>
      </div>
      <section className="legal-section">
        <h2>Imágenes procesadas con el redimensionador</h2>
        <p>
          En la versión actual, la herramienta de redimensionado lee la imagen
          seleccionada y la procesa mediante Canvas en el navegador. El código
          de esta función no envía el archivo a un servidor. La vista previa y
          el archivo generado se crean localmente en el dispositivo.
        </p>
        <p>
          Esto describe el redimensionador implementado y no debe interpretarse
          como una garantía sobre herramientas futuras o sobre servicios que
          pueda añadir el responsable del sitio.
        </p>
      </section>
      <section className="legal-section">
        <h2>Formulario de contacto</h2>
        <p>
          El formulario actual solo valida los campos y mantiene un borrador
          temporal en la página. No tiene una integración de envío y el sitio no
          transmite el mensaje a un destinatario. El borrador puede copiarse
          desde el navegador del usuario.
        </p>
      </section>
      <section className="legal-section">
        <h2>Infraestructura y registros técnicos</h2>
        <p>
          El proveedor de alojamiento y su tratamiento de datos técnicos, como
          registros de solicitudes, no están definidos en este proyecto. Antes
          de publicar, hay que identificar al proveedor, confirmar qué datos
          registra, durante cuánto tiempo y con qué finalidad, y actualizar
          esta política con información verificada.
        </p>
        <p>
          El código actual no integra analítica, publicidad ni un servicio de
          seguimiento. Si se incorporan, su finalidad, configuración, cookies o
          almacenamiento local y opciones disponibles deben documentarse según
          el comportamiento real.
        </p>
      </section>
      <section className="legal-section">
        <h2>Conservación, derechos y consultas</h2>
        <p>
          El responsable debe completar los periodos de conservación, la base y
          finalidad de cualquier tratamiento ajeno a la herramienta, los
          derechos y vías de ejercicio aplicables, y el canal de contacto
          correspondiente. No se inventan aquí esos datos.
        </p>
      </section>
    </InfoPage>
  );
}
