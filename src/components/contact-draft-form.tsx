"use client";

import { useState, type FormEvent } from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";

type ContactDraft = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactDraftForm() {
  const [draft, setDraft] = useState<ContactDraft | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function validateDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setDraft({
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    });
    setError(null);
    setStatus(
      "Los campos se validaron en este navegador. El mensaje no se envió ni se guardó porque el sitio aún no tiene un servicio de contacto configurado.",
    );
  }

  async function copyDraft() {
    if (!draft) return;
    const text = [
      `Nombre: ${draft.name}`,
      `Correo: ${draft.email}`,
      `Asunto: ${draft.subject}`,
      "",
      draft.message,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setError(null);
      setStatus("Borrador copiado en tu dispositivo. No se envió ningún mensaje.");
    } catch {
      setError(
        "No se pudo acceder al portapapeles. Selecciona y copia el texto del formulario manualmente.",
      );
    }
  }

  return (
    <div className="contact-form-wrap">
      <form className="contact-form" onSubmit={validateDraft}>
        <div className="contact-form__row">
          <label htmlFor="contact-name">
            Nombre
            <input
              autoComplete="name"
              id="contact-name"
              maxLength={100}
              name="name"
              required
              type="text"
            />
          </label>
          <label htmlFor="contact-email">
            Correo electrónico
            <input
              autoComplete="email"
              id="contact-email"
              maxLength={254}
              name="email"
              required
              type="email"
            />
          </label>
        </div>
        <label htmlFor="contact-subject">
          Asunto
          <input
            id="contact-subject"
            maxLength={160}
            name="subject"
            required
            type="text"
          />
        </label>
        <label htmlFor="contact-message">
          Mensaje
          <textarea
            id="contact-message"
            maxLength={5000}
            name="message"
            required
            rows={6}
          />
        </label>
        <p className="contact-form__notice">
          Este formulario solo comprueba los campos en tu navegador. No envía
          datos ni guarda el borrador.
        </p>
        <button className="button button--primary" type="submit">
          Comprobar el borrador
        </button>
      </form>

      {status ? (
        <p className="contact-form__status" role="status">
          <Check size={17} aria-hidden="true" />
          {status}
        </p>
      ) : null}
      {draft ? (
        <section className="contact-form__draft" aria-label="Borrador local">
          <h3>Tu borrador, solo en esta página</h3>
          <dl>
            <div>
              <dt>Nombre</dt>
              <dd>{draft.name}</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>{draft.email}</dd>
            </div>
            <div>
              <dt>Asunto</dt>
              <dd>{draft.subject}</dd>
            </div>
            <div>
              <dt>Mensaje</dt>
              <dd>{draft.message}</dd>
            </div>
          </dl>
          <button
            className="button button--secondary"
            onClick={copyDraft}
            type="button"
          >
            <Copy size={16} aria-hidden="true" />
            Copiar borrador
          </button>
        </section>
      ) : null}
      {error ? (
        <p className="contact-form__error" role="alert">
          <TriangleAlert size={16} aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
