import { Mail, TriangleAlert } from "lucide-react";
import ContactDraftForm from "@/components/contact-draft-form";
import InfoPage from "@/components/info-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("/contact/");

export default function ContactPage() {
  return (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Contacto" },
      ]}
      description="Esta página explica el estado actual del contacto y permite validar un borrador sin enviarlo."
      eyebrow="Contacto"
      title="Hablemos con claridad"
    >
      <div className="contact-notice" role="note">
        <span aria-hidden="true">
          <TriangleAlert size={19} />
        </span>
        <div>
          <h2>El envío de mensajes aún no está configurado</h2>
          <p>
            No se ha proporcionado una dirección pública de contacto ni existe
            un servicio de envío conectado. El formulario de abajo solo valida y
            muestra un borrador en tu navegador; no se transmite ni se guarda.
          </p>
        </div>
      </div>
      <div className="contact-layout">
        <section className="contact-explainer">
          <span className="info-card__icon" aria-hidden="true">
            <Mail size={20} />
          </span>
          <h2>Antes de publicar un canal de contacto</h2>
          <p>
            El responsable del sitio debe proporcionar una dirección de correo
            u otro canal público y decidir cómo atender los mensajes. No
            mostramos una dirección inventada.
          </p>
          <p>
            Si quieres probar la validación del formulario, los campos no salen
            de esta página. Puedes copiar el borrador para guardarlo tú.
          </p>
        </section>
        <ContactDraftForm />
      </div>
    </InfoPage>
  );
}
