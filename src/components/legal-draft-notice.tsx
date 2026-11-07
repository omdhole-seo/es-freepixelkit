import { TriangleAlert } from "lucide-react";

export default function LegalDraftNotice() {
  return (
    <aside className="legal-draft-notice" role="note">
      <TriangleAlert size={20} aria-hidden="true" />
      <div>
        <strong>Borrador pendiente de revisión</strong>
        <p>
          Antes de publicar, la persona responsable debe completar los campos
          entre corchetes, comprobar el funcionamiento real del sitio y revisar
          este texto para las jurisdicciones pertinentes. No constituye una
          garantía de cumplimiento legal.
        </p>
      </div>
    </aside>
  );
}
