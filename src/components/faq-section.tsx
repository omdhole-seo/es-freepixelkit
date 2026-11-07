import { Plus } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqSection({ items }: { items: FaqItem[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <section className="faq-section" id="preguntas-frecuentes">
        <div className="container faq-section__inner">
          <div className="faq-section__intro">
            <p className="eyebrow">Respuestas claras</p>
            <h2>Preguntas frecuentes</h2>
            <p>
              Información práctica sobre las herramientas disponibles en
              FreePixelKit.
            </p>
          </div>
          <div className="faq-list">
            {items.map((item) => (
              <details className="faq-item" key={item.question}>
                <summary>
                  {item.question}
                  <Plus size={18} aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
