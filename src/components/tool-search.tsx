"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Image as ImageIcon,
  Search,
  type LucideIcon,
} from "lucide-react";
import type { ToolIconName, ToolInfo } from "@/lib/tools";

const toolIcons: Record<ToolIconName, LucideIcon> = {
  image: ImageIcon,
};

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function ToolSearch({
  tools,
  variant = "hero",
  inputId = "tool-search-input",
}: {
  tools: ToolInfo[];
  variant?: "hero" | "header";
  inputId?: string;
}) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const normalizedQuery = normalizeText(query.trim());
  const results = useMemo(
    () =>
      normalizedQuery
        ? tools.filter((tool) =>
            normalizeText(
              [tool.name, tool.description, ...tool.searchTerms].join(" "),
            ).includes(normalizedQuery),
          )
        : [],
    [normalizedQuery, tools],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  }

  return (
    <div className={`tool-search tool-search--${variant}`}>
      <form className="tool-search__form" onSubmit={handleSubmit}>
        <Search className="tool-search__icon" size={19} aria-hidden="true" />
        <label className="sr-only" htmlFor={inputId}>
          Buscar una herramienta
        </label>
        <input
          autoComplete="off"
          id={inputId}
          onChange={(event) => {
            setQuery(event.target.value);
            setSubmittedQuery("");
          }}
          placeholder={
            variant === "header" ? "Buscar herramienta" : "¿Qué quieres hacer con tu imagen?"
          }
          type="search"
          value={query}
        />
        <button className="tool-search__submit" type="submit">
          Buscar <ArrowRight size={16} aria-hidden="true" />
        </button>
      </form>
      {query.trim() ? (
        <div className="tool-search__results" aria-live="polite">
          {results.length ? (
            results.map((tool) => (
              <Link
                className="tool-search__result"
                href={tool.href ?? "/"}
                key={tool.slug}
                onClick={() => setQuery("")}
              >
                <span className="tool-search__result-icon" aria-hidden="true">
                  <ToolCardIcon name={tool.icon} />
                </span>
                <span className="tool-search__result-copy">
                  <strong>{tool.name}</strong>
                  <small>{tool.description}</small>
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ))
          ) : (
            <p className="tool-search__empty">
              {submittedQuery
                ? `Aún no hay una herramienta disponible para «${submittedQuery}». Prueba «redimensionar imagen».`
                : "Aún no hay una herramienta disponible para esa búsqueda. Prueba «redimensionar imagen»."}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ToolCardIcon({ name }: { name: ToolInfo["icon"] }) {
  const Icon = toolIcons[name];

  return <Icon size={18} aria-hidden="true" />;
}
