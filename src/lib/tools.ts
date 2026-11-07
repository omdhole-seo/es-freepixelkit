export type ToolIconName = "image";
export type ToolCategorySlug = "convert" | "compress" | "resize" | "edit";

export type ToolInfo = {
  slug: string;
  name: string;
  description: string;
  category: ToolCategorySlug;
  icon: ToolIconName;
  href: string;
  searchTerms: string[];
};

export type CategoryInfo = {
  slug: string;
  name: string;
  href: string;
  title: string;
  description: string;
  icon: "image" | "compress" | "resize" | "convert" | "edit";
  keywords: string[];
  intro: string;
  faqs: { question: string; answer: string }[];
};

export const tools: ToolInfo[] = [
  {
    slug: "image-resizer",
    name: "Redimensionar imagen",
    description:
      "Cambia el ancho y el alto de una imagen y conserva su proporción.",
    category: "resize",
    icon: "image",
    href: "/image-resizer/",
    searchTerms: ["redimensionar", "cambiar tamaño", "dimensiones", "píxeles"],
  },
];

export const categories: CategoryInfo[] = [
  {
    slug: "image-tools",
    name: "Herramientas de imagen",
    href: "/image-tools/",
    title: "Herramientas de imagen online",
    description:
      "Explora las herramientas de imagen disponibles en FreePixelKit y consulta qué funciones están listas para usar.",
    icon: "image",
    keywords: ["imagen", "foto", "imagen online", "herramientas"],
    intro:
      "Las herramientas disponibles se ejecutan en el navegador cuando su función lo permite. Por ahora puedes redimensionar imágenes JPEG, PNG y WebP; las demás utilidades se incorporarán cuando estén listas.",
    faqs: [
      {
        question: "¿Qué herramienta de imagen está disponible?",
        answer:
          "El redimensionador de imágenes está disponible. Permite ajustar las dimensiones, mantener la proporción y exportar en formatos compatibles con el navegador.",
      },
      {
        question: "¿Qué formatos acepta el redimensionador?",
        answer:
          "Puedes seleccionar imágenes JPEG, PNG y WebP. Los formatos de salida dependen de la compatibilidad comprobada del navegador.",
      },
      {
        question: "¿Se envían las imágenes a un servidor?",
        answer:
          "El redimensionador procesa los archivos en el navegador mediante Canvas y no los envía a un servidor. Esta descripción se refiere a esa herramienta concreta.",
      },
    ],
  },
  {
    slug: "compress",
    name: "Comprimir imágenes",
    href: "/compress/",
    title: "Comprimir imágenes",
    description:
      "Información sobre las herramientas para reducir el tamaño de archivo de una imagen.",
    icon: "compress",
    keywords: ["comprimir", "compresión", "tamaño", "peso"],
    intro:
      "La compresión puede reducir el tamaño de un archivo y, según el formato y los ajustes, también afectar a la calidad. El compresor aún no está disponible en este sitio.",
    faqs: [
      {
        question: "¿Puedo comprimir imágenes en FreePixelKit ahora?",
        answer:
          "Todavía no. No hay un compresor de imágenes implementado, por lo que esta página no ofrece controles ni descargas de compresión.",
      },
      {
        question: "¿La compresión siempre conserva la calidad original?",
        answer:
          "No necesariamente. La compresión con pérdida puede reducir la calidad. Los resultados dependen del formato y de los parámetros usados.",
      },
      {
        question: "¿Qué puedo hacer mientras tanto?",
        answer:
          "Puedes redimensionar una copia de la imagen con la herramienta disponible. Cambiar dimensiones no equivale a comprimir el mismo archivo ni garantiza una reducción de peso.",
      },
    ],
  },
  {
    slug: "resize",
    name: "Redimensionar imágenes",
    href: "/resize/",
    title: "Redimensionar imágenes",
    description:
      "Ajusta el ancho y el alto de una imagen y conserva la proporción si lo necesitas.",
    icon: "resize",
    keywords: ["redimensionar", "tamaño", "dimensiones", "píxeles"],
    intro:
      "El redimensionador permite indicar dimensiones en píxeles, mantener la proporción y descargar una nueva imagen. El resultado depende del tamaño de origen y de los límites del dispositivo.",
    faqs: [
      {
        question: "¿Cómo evito que una imagen se deforme?",
        answer:
          "Activa «Mantener la proporción» en el redimensionador. Al modificar una dimensión, la otra se ajustará automáticamente.",
      },
      {
        question: "¿Qué unidades se utilizan?",
        answer:
          "El ancho y el alto se expresan en píxeles. La herramienta limita cada lado a 12.000 píxeles y el total a 100 millones de píxeles.",
      },
      {
        question: "¿Aumentar las dimensiones mejora la nitidez?",
        answer:
          "No. Ampliar una imagen puede hacerla menos nítida; el resultado depende de la resolución original.",
      },
    ],
  },
  {
    slug: "convert",
    name: "Convertir imágenes",
    href: "/convert/",
    title: "Convertir imágenes",
    description:
      "Consulta las opciones de conversión de imágenes disponibles y sus limitaciones.",
    icon: "convert",
    keywords: ["convertir", "formatos", "jpeg", "png", "webp"],
    intro:
      "La conversión de formato vuelve a codificar la imagen y puede cambiar la transparencia o la calidad. FreePixelKit todavía no ofrece una herramienta de conversión independiente.",
    faqs: [
      {
        question: "¿Hay un convertidor de imágenes disponible?",
        answer:
          "Todavía no hay un convertidor independiente disponible. El redimensionador sí permite exportar la imagen en los formatos que admite el navegador.",
      },
      {
        question: "¿Qué ocurre con la transparencia al guardar en JPEG?",
        answer:
          "JPEG no admite transparencia. El redimensionador rellena las zonas transparentes con blanco cuando se selecciona JPEG.",
      },
      {
        question: "¿El navegador admite todos los formatos?",
        answer:
          "No. La compatibilidad de carga y exportación varía. El redimensionador comprueba qué formatos de salida puede generar.",
      },
    ],
  },
  {
    slug: "edit",
    name: "Editar imágenes",
    href: "/edit/",
    title: "Editar imágenes",
    description:
      "Encuentra información sobre las funciones de edición de imágenes del sitio.",
    icon: "edit",
    keywords: ["editar", "recortar", "imagen", "foto"],
    intro:
      "Las herramientas de edición pueden modificar el encuadre, la orientación u otros aspectos de una imagen. Las funciones de recorte y edición aún no se han implementado en FreePixelKit.",
    faqs: [
      {
        question: "¿Puedo recortar una imagen en el sitio?",
        answer:
          "Todavía no. No se ofrece una interfaz de recorte ni una descarga recortada; la página solo informa sobre la categoría.",
      },
      {
        question: "¿Puedo rotar una foto?",
        answer:
          "La función de rotación no está disponible actualmente. No hay controles de rotación activos en este sitio.",
      },
      {
        question: "¿Qué herramienta puedo utilizar ahora?",
        answer:
          "El redimensionador puede cambiar las dimensiones de una imagen, pero no recorta ni modifica su encuadre.",
      },
    ],
  },
];

export const availableTools = tools;
