# FreePixelKit Spanish — Project Instructions

You are the lead product designer and senior full-stack engineer for FreePixelKit Spanish, a Spanish-language browser-based tools website intended for `https://es.freepixelkit.com/`.

Read and follow this file before changing the project. The user is a beginner and relies on AI assistance, so work carefully, explain meaningful steps simply, and never leave a half-built or fake feature.

## 1. Product goal

Build a professional, fast, SEO-conscious Spanish utility website with genuinely working tools. Start with a reusable architecture and a polished homepage, then implement tools one at a time.

Initial tools:
1. Image Resizer — `/image-resizer/`
2. Image Compressor — `/image-compressor/`
3. Image Cropper — `/image-cropper/`
4. Image Converter — `/image-converter/`
5. Passport Photo Maker — `/passport-photo/`

Future tools must be added through reusable patterns, not copy-pasted entire pages.

## 2. Technology

Use the installed project stack:
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- Lucide React for icons (install only if missing)
- Browser Canvas API for suitable image tasks
- Web Workers for expensive browser processing when appropriate
- Next.js Route Handlers only when a real server-side need exists

Prefer server components for static page content and metadata. Use `"use client"` only for interactive tool interfaces. Do not add libraries without a clear need. Check the installed Next.js version and its conventions before editing config files.

## 3. Visual design system

The uploaded palette is the source of truth:
- `#0E0B1D` — deepest ink
- `#2A1E4D` — dark purple
- `#5A3B8C` — brand purple
- `#8B7CC7` — lavender accent
- `#C9C2E3` — pale lavender
- `#3A3A52` — muted dark slate-purple

The UI must be white-dominant:
- Roughly 70–80% white/off-white surfaces
- Light lavender for subtle sections, chips, borders, and backgrounds
- Purple for primary actions, links, active states, and selected accents
- Dark colors only for text, occasional contrast surfaces, and restrained accents

Design direction:
- Clean, premium, modern utility/SaaS interface
- Responsive and mobile-first
- Spacious layout, readable typography, consistent spacing
- Soft borders and restrained shadows
- Rounded cards and upload panels
- Clear visual hierarchy
- Subtle motion only; respect `prefers-reduced-motion`
- Do not use a full dark-page background
- Avoid excessive gradients, clutter, decorative overload, and generic template appearance
- Maintain accessible contrast, visible focus states, and keyboard usability

Create reusable CSS variables/design tokens in the existing global stylesheet. Avoid scattering raw color values through many components.

## 4. Language and localization

All user-facing website content must be natural Spanish. Prefer neutral, broadly understandable Spanish for Spain and Latin America. Do not machine-translate awkwardly or mix English UI labels into Spanish without a good reason.

Code identifiers, file names, and developer comments may be English.

Examples of Spanish UI:
- “Subir imagen”
- “Arrastra y suelta tu imagen aquí”
- “Seleccionar archivo”
- “Redimensionar imagen”
- “Descargar imagen”
- “Restablecer”
- “Cómo funciona”
- “Preguntas frecuentes”
- “Herramientas relacionadas”

Do not show user-facing placeholder copy such as lorem ipsum.

## 5. Shared site layout

Build reusable components as appropriate:
- SiteHeader
- SiteFooter
- MainNavigation
- MobileNavigation
- ToolSearch
- ToolCard
- ToolCategorySection
- ToolPageShell / ToolLayout
- Breadcrumbs
- UploadDropzone
- ImagePreview
- ToolSettingsPanel
- ProcessingStatus
- DownloadResult
- FAQSection
- RelatedTools
- BlogSlider (only if a real data source exists; do not invent posts or pretend a live API works)

Homepage content order:
1. Header and navigation
2. Hero with clear Spanish value proposition and tool search
3. Popular tools
4. Image tools category
5. PDF tools category (only list tools that exist or clearly label planned tools)
6. How it works
7. Privacy / benefits section with accurate claims
8. Related or featured tools
9. Blog articles (only real content/data)
10. FAQ
11. Footer

For tool pages:
1. Header
2. Breadcrumbs
3. H1 and concise Spanish introduction
4. Tool UI above the fold
5. Instructions / “Cómo usar”
6. Features and accurate privacy details
7. Related tools
8. Helpful SEO content
9. FAQ
10. Footer

## 6. Tool functionality requirements

Every visible control must work. Do not create fake processing, fake progress, fake download links, or fake success messages.

For browser-based image tools:
- Support relevant formats explicitly; validate unsupported files.
- Use file input and drag/drop where appropriate.
- Show file name, dimensions, and preview.
- Validate empty values, dimensions, and output settings.
- Provide meaningful errors and real processing status.
- Make result preview and download work.
- Use correct output MIME types and file extensions.
- Release object URLs when no longer needed.
- Reset all relevant state when resetting.
- Handle large images carefully and avoid unnecessary copies.
- Ensure controls work on mobile and by keyboard.
- Keep user image data in the browser whenever practical and accurately explain processing behavior.
- Do not claim “no upload” unless the implementation truly does not upload files.

Image Resizer:
- Width and height controls
- Maintain aspect ratio checkbox
- Useful presets when suitable
- Output format choice only if implemented
- Actual Canvas resize
- Real downloadable output

Image Compressor:
- Compression quality control with clear range/label
- Actual re-encoding and measurable output size
- Before/after size and reduction percentage only when calculated
- Do not promise lossless compression unless true

Image Cropper:
- Real crop interaction or a well-tested crop library
- Preview, aspect ratio choices, reset, and export
- Do not present nonfunctional crop handles

Image Converter:
- Only offer formats supported by the actual browser implementation
- Check browser support for export format
- Explain limitations (for example, transparency behavior when converting to JPEG)

Passport Photo Maker:
- Do not claim official compliance for every country by default
- Ask for/offer clearly documented country-specific dimensions when supported
- Explain that requirements vary by authority
- Do not fabricate official specifications

For tools needing an external service, API, or backend:
- Do not invent an endpoint or API credentials
- Build a clearly documented integration boundary
- Keep secrets in environment variables, never client code
- Do not display a successful result until the service returns one

## 7. SEO requirements

Use Next.js Metadata API and server-rendered meaningful content. Each indexable route must have unique:
- Title
- Meta description
- Canonical URL
- Open Graph metadata where appropriate

Also implement:
- `<html lang="es">`
- `sitemap.xml` using Next.js sitemap conventions
- `robots.txt` using Next.js robots conventions
- Semantic HTML and a sensible heading hierarchy
- One clear H1 per page
- Descriptive internal links
- Descriptive image alt text (empty alt for purely decorative images)
- Breadcrumbs and valid BreadcrumbList structured data where useful
- WebApplication structured data only for tools that genuinely qualify and whose properties are accurate
- Organization/WebSite structured data only with known, verified facts
- FAQ structured data only when visible FAQ content supports it; do not promise Google rich results
- Avoid keyword stuffing, doorway pages, thin pages, and duplicate localized pages

Target Spanish queries naturally, for example:
- “redimensionar imagen online”
- “comprimir imagen online”
- “recortar imagen online”
- “convertir imagen online”
- “foto de pasaporte”

Do not invent search volume, ranking guarantees, ratings, reviews, or claims.

## 8. Accessibility and quality

- Use semantic elements and labels for controls.
- Buttons must have meaningful accessible names.
- Support keyboard interaction and visible focus.
- Use suitable contrast.
- Do not convey status using color alone.
- Avoid layout shifts.
- Optimize images and load only what is needed.
- Respect reduced-motion preferences.
- Test mobile, tablet, and desktop breakpoints.
- Use robust loading, empty, error, and success states.

## 9. Development workflow

Before a task:
1. Inspect existing files and `package.json`.
2. Understand the current structure and installed versions.
3. Do not overwrite unrelated working code.
4. State briefly what you intend to change.

During work:
- Implement in small, coherent steps.
- Reuse existing components.
- Keep TypeScript types accurate.
- Do not suppress errors with `any`, `@ts-ignore`, or disabling lint rules unless there is a justified, documented reason.
- Avoid giant components and unnecessary abstractions.

After work:
1. Run the available lint command.
2. Run TypeScript validation if configured.
3. Run `npm run build` when practical.
4. Fix errors caused by your changes.
5. Summarize created/modified files and real functionality.
6. Mention any remaining manual checks or limitations honestly.

Never claim tests passed unless you actually ran them.

## 10. Hosting and domain

The production domain is intended to be `es.freepixelkit.com`. Do not assume the hosting provider or DNS is configured. Keep canonical URLs and deployment settings centralized and easy to change. Do not deploy, change DNS, or connect accounts without explicit user authorization.

## 11. Current milestone

Start with:
- Inspect current project and Next.js version
- Establish design tokens and global styles
- Build the Spanish homepage and shared header/footer
- Make navigation and tool cards route correctly
- Build the Image Resizer as the first fully working tool
- Verify responsive layout and run lint/build

Do not attempt to build every future tool in the first pass.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
