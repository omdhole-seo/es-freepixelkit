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
y descargar. No hay un servicio de envío para el formulario de contacto. Las
categorías de compresión, conversión y edición no simulan herramientas que
todavía no existen.

## Administración del blog

El CMS está disponible en `/admin/`. Antes de iniciar sesión, configura
`ADMIN_USERNAME`, `ADMIN_PASSWORD` (16 caracteres o más) y
`ADMIN_SESSION_SECRET` (32 caracteres o más) en el entorno del servidor. No hay
credenciales predeterminadas. Puedes usar `.env.example` como lista de
variables, pero los valores secretos no deben subirse al repositorio.

El contenido se guarda como JSON en `BLOG_DATA_DIR` (por defecto, `data/`) y
las portadas subidas se guardan en `BLOG_UPLOAD_DIR` (por defecto,
`data/blog-uploads/`) y se sirven mediante una ruta de medios validada. El almacenamiento
local se serializa y escribe de forma atómica para un único proceso Node.
El editor genera el slug, las fechas, el tiempo de lectura y los metadatos SEO
en el servidor. Las portadas JPEG/JPG, PNG y WebP (hasta 5 MB) se convierten
con Sharp a WebP y se optimizan para quedar por debajo de 100 KB; si no se
alcanza ese límite sin degradación excesiva, la carga muestra un error. Los
borradores pueden guardarse sin contenido ni portada; para publicar se requieren
contenido y portada.
Para producción, monta ambas ubicaciones en almacenamiento persistente y
despliega una sola instancia. Este proyecto no incluye una base de datos ni un
servicio de objetos; el sistema de archivos local no es adecuado para
despliegues efímeros/serverless o varias instancias. En esos casos se debe
conectar una base de datos compartida y almacenamiento de medios antes de
publicar contenido.

## Dominio

El dominio canónico predeterminado es `https://es.freepixelkit.com`. Para
previsualizar el sitio en otro dominio, define `NEXT_PUBLIC_SITE_URL`. La
configuración de despliegue y DNS debe hacerse por separado.

Antes de publicar, la persona responsable debe completar la información legal
marcada entre corchetes, confirmar el proveedor de alojamiento y proporcionar
un canal de contacto público si desea recibir mensajes.
