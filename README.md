# FreePixelKit

Sitio de herramientas de imagen en español con Next.js App Router, React,
TypeScript y Tailwind CSS.

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Para validar cambios:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Rutas

- `/`: portada.
- `/all-tools/`: búsqueda y filtros de herramientas implementadas.
- `/image-tools/`, `/compress/`, `/resize/`, `/convert/`, `/edit/`: categorías.
- `/image-resizer/`: herramienta funcional de redimensionado.
- `/about/`, `/contact/`, `/blog/`, `/sitemap/`: páginas informativas.
- `/privacy-policy/`, `/terms-and-conditions/`, `/disclaimer/`: borradores
  legales con datos pendientes de confirmar.

La identidad FreePixelKit usa el logotipo y el favicon proporcionados por el
propietario del proyecto.

El redimensionador procesa JPEG, PNG y WebP localmente con Canvas. El formato
de exportación se comprueba en el navegador; el resultado se puede previsualizar
y descargar. No hay un servicio de envío para el formulario de contacto ni
artículos publicados. Las categorías de compresión, conversión y edición no
simulan herramientas que todavía no existen.

## Dominio

El dominio canónico predeterminado es `https://es.freepixelkit.com`. Para
previsualizar el sitio en otro dominio, define `NEXT_PUBLIC_SITE_URL`. La
configuración de despliegue y DNS debe hacerse por separado.

Antes de publicar, la persona responsable debe completar la información legal
marcada entre corchetes, confirmar el proveedor de alojamiento y proporcionar
un canal de contacto público si desea recibir mensajes.
