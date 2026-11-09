import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const uploadDirectory = path.resolve(
  /* turbopackIgnore: true */ process.env.BLOG_UPLOAD_DIR ??
    path.join(process.cwd(), "data", "blog-uploads"),
);

const contentTypes = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const match = /^([a-f0-9-]{36})\.(jpg|png|webp)$/i.exec(filename);
  if (!match) {
    return new Response("No se encontró la imagen.", { status: 404 });
  }

  let image: Buffer;
  try {
    image = await readFile(path.join(/* turbopackIgnore: true */ uploadDirectory, filename));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return new Response("No se encontró la imagen.", { status: 404 });
    }
    throw error;
  }

  const imageBytes = Uint8Array.from(image);
  return new Response(imageBytes, {
    headers: {
      "Content-Type": contentTypes[match[2] as keyof typeof contentTypes],
      "Content-Length": String(imageBytes.byteLength),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function HEAD(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const match = /^([a-f0-9-]{36})\.(jpg|png|webp)$/i.exec(filename);
  if (!match) {
    return new Response(null, { status: 404 });
  }

  try {
    const image = await stat(
      path.join(/* turbopackIgnore: true */ uploadDirectory, filename),
    );
    return new Response(null, {
      headers: {
        "Content-Type": contentTypes[match[2] as keyof typeof contentTypes],
        "X-Image-Size": String(image.size),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return new Response(null, { status: 404 });
    }
    throw error;
  }
}
