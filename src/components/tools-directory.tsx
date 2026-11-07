"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import ToolCard from "@/components/tool-card";
import { categories, tools } from "@/lib/tools";

const filters = [
  { label: "Todas", value: "all" },
  { label: "Convertir", value: "convert" },
  { label: "Comprimir", value: "compress" },
  { label: "Redimensionar", value: "resize" },
  { label: "Editar", value: "edit" },
] as const;

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function ToolsDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<(typeof filters)[number]["value"]>("all");
  const normalizedQuery = normalizeText(query.trim());
  const filteredTools = useMemo(
    () =>
      tools.filter((tool) => {
        const categoryMatches =
          category === "all" || tool.category === category;
        const queryMatches =
          !normalizedQuery ||
          normalizeText(
            `${tool.name} ${tool.description} ${tool.category} ${tool.searchTerms.join(" ")}`,
          ).includes(normalizedQuery);
        return categoryMatches && queryMatches;
      }),
    [category, normalizedQuery],
  );

  return (
    <section className="directory" aria-label="Directorio de herramientas">
      <div className="directory__search">
        <Search size={19} aria-hidden="true" />
        <label className="sr-only" htmlFor="directory-search">
          Buscar herramientas disponibles
        </label>
        <input
          autoComplete="off"
          id="directory-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre o tarea"
          type="search"
          value={query}
        />
        {query ? (
          <button
            aria-label="Borrar búsqueda"
            className="directory__clear"
            onClick={() => setQuery("")}
            type="button"
          >
            <X size={17} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <div className="directory__filters" aria-label="Filtrar por categoría">
        {filters.map((filter) => (
          <button
            aria-pressed={category === filter.value}
            className={
              category === filter.value
                ? "directory__filter is-active"
                : "directory__filter"
            }
            key={filter.value}
            onClick={() => setCategory(filter.value)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>
      <p className="directory__count" aria-live="polite">
        {filteredTools.length === 1
          ? "1 herramienta disponible"
          : `${filteredTools.length} herramientas disponibles`}
      </p>
      {filteredTools.length ? (
        <div className="tool-grid">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="empty-tools directory__empty">
          <span className="empty-tools__icon" aria-hidden="true">
            <Search size={21} />
          </span>
          <div>
            <h2>No encontramos herramientas disponibles</h2>
            <p>
              Prueba otra búsqueda o elige «Todas». Solo se muestran
              herramientas implementadas y utilizables.
            </p>
            <button
              className="text-button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              type="button"
            >
              Mostrar todas las herramientas
            </button>
          </div>
        </div>
      )}
      <div className="directory__category-links">
        <h2>Explora por tarea</h2>
        <div className="category-link-list">
          {categories
            .filter((item) => item.slug !== "image-tools")
            .map((item) => (
              <Link href={item.href} key={item.slug}>
                {item.name}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
