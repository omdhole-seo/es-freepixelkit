import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appDirectory = join(root, "src", "app");
const sourceDirectory = join(root, "src");
const pages = JSON.parse(
  await readFile(join(sourceDirectory, "lib", "seo-pages.json"), "utf8"),
);
const failures = [];

function routeFromPageFile(filePath) {
  const directory = relative(appDirectory, dirname(filePath));
  const segments = directory === "" ? [] : directory.split(sep);
  return `/${segments.filter((segment) => !/^\(.+\)$/.test(segment)).join("/")}${
    segments.length ? "/" : ""
  }`;
}

async function findPageFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findPageFiles(path)));
    } else if (entry.name === "page.tsx") {
      files.push(path);
    }
  }

  return files;
}

async function findSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findSourceFiles(path)));
    } else if (/\.(?:[cm]?js|tsx?)$/.test(entry.name)) {
      files.push(path);
    }
  }

  return files;
}

const routeFiles = await findPageFiles(appDirectory);
const routeSources = new Map(
  await Promise.all(
    routeFiles.map(async (file) => [
      routeFromPageFile(file),
      await readFile(file, "utf8"),
    ]),
  ),
);
const actualRoutes = new Set(routeSources.keys());
const metadataRoutes = new Set(pages.map((page) => page.path));

for (const route of actualRoutes) {
  if (!metadataRoutes.has(route)) {
    failures.push(`${route}: falta en src/lib/seo-pages.json.`);
  }
  const source = routeSources.get(route) ?? "";
  const declaresMetadata =
    source.includes(`createPageMetadata("${route}")`) ||
    source.includes("export const metadata") ||
    source.includes("export async function generateMetadata");
  if (!declaresMetadata) {
    failures.push(`${route}: no usa los metadatos centralizados de su ruta.`);
  }
}

for (const route of metadataRoutes) {
  if (!actualRoutes.has(route)) {
    failures.push(`${route}: no corresponde a una página App Router existente.`);
  }
}

const seenTitles = new Set();
const seenDescriptions = new Set();
const seenCanonicals = new Set();

for (const page of pages) {
  const titleLength = [...page.title].length;
  const descriptionLength = [...page.description].length;
  const canonical = page.path;

  if (page.indexable && (titleLength < 55 || titleLength > 60)) {
    failures.push(`${page.path}: título de ${titleLength} caracteres (objetivo: 55–60).`);
  }
  if (page.indexable && (descriptionLength < 155 || descriptionLength > 160)) {
    failures.push(
      `${page.path}: descripción de ${descriptionLength} caracteres (objetivo: 155–160).`,
    );
  }
  if (seenTitles.has(page.title)) {
    failures.push(`${page.path}: título duplicado.`);
  }
  if (seenDescriptions.has(page.description)) {
    failures.push(`${page.path}: descripción duplicada.`);
  }
  if (seenCanonicals.has(canonical)) {
    failures.push(`${page.path}: canonical duplicado.`);
  }
  if (typeof page.indexable !== "boolean") {
    failures.push(`${page.path}: falta definir si la página es indexable.`);
  }

  seenTitles.add(page.title);
  seenDescriptions.add(page.description);
  seenCanonicals.add(canonical);
}

const sourceFiles = await findSourceFiles(sourceDirectory);
const sourceContents = await Promise.all(
  sourceFiles.map((file) => readFile(file, "utf8")),
);
const sourceText = sourceContents.join("\n");
const knownAnchors = new Set(
  [...sourceText.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]),
);
const internalPaths = new Set([...actualRoutes].map(normalizePath));

for (const page of pages) {
  if (page.indexable && !internalPaths.has(normalizePath(page.path))) {
    failures.push(`${page.path}: ruta indexable no encontrada.`);
  }
}

function normalizePath(path) {
  if (path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

const checkedHrefs = new Set();
const hrefPattern = /\bhref\s*=\s*(["'`])([^"'`]+)\1/g;
const pathPattern = /\b(?:href|path)\s*:\s*(["'`])([^"'`]+)\1/g;

for (const text of sourceContents) {
  for (const pattern of [hrefPattern, pathPattern]) {
    for (const match of text.matchAll(pattern)) {
      checkedHrefs.add(match[2]);
    }
  }
}

for (const href of checkedHrefs) {
  if (!href.startsWith("/")) continue;

  const url = new URL(href, "https://es.freepixelkit.com");
  if (!internalPaths.has(normalizePath(url.pathname))) {
    failures.push(`Enlace interno sin ruta correspondiente: ${href}`);
  } else if (url.hash && !knownAnchors.has(decodeURIComponent(url.hash.slice(1)))) {
    failures.push(`Enlace interno sin ancla correspondiente: ${href}`);
  }
}

console.log("Validación SEO por ruta (caracteres visibles):");
for (const page of pages) {
  console.log(
    `- ${page.path} | título ${[...page.title].length} | descripción ${
      [...page.description].length
    } | ${page.indexable ? "indexable" : "no indexable"}`,
  );
}
console.log(`\nRutas auditadas: ${pages.length}`);
console.log(`Enlaces internos únicos comprobados: ${checkedHrefs.size}`);

if (failures.length) {
  console.error(`\nSe encontraron ${failures.length} problema(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Metadatos, canonicals, rutas y enlaces internos correctos.");
}
