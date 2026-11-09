import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, isSameOriginRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const MAX_INPUT_PIXELS = 40_000_000;
const MAX_OUTPUT_SIZE = 100_000;
const uploadDirectory = path.resolve(
  /* turbopackIgnore: true */ process.env.BLOG_UPLOAD_DIR ??
    path.join(process.cwd(), "data", "blog-uploads"),
);

const allowedTypes = {
  "image/jpeg": (bytes: Buffer) =>
    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  "image/jpg": (bytes: Buffer) =>
    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  "image/png": (bytes: Buffer) =>
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  "image/webp": (bytes: Buffer) =>
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP",
};

async function optimizeToWebp(source: Buffer) {
  const image = sharp(source, {
    failOn: "error",
    limitInputPixels: MAX_INPUT_PIXELS,
  });
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height || (metadata.pages ?? 1) > 1) {
    throw new Error("Use a still image with valid dimensions.");
  }

  const qualities = [82, 72, 62, 55];
  let maxDimension = Math.min(Math.max(metadata.width, metadata.height), 2400);

  while (true) {
    for (const quality of qualities) {
      const { data, info } = await sharp(source, {
        failOn: "error",
        limitInputPixels: MAX_INPUT_PIXELS,
      })
        .rotate()
        .resize({
          width: maxDimension,
          height: maxDimension,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality, effort: 5 })
        .toBuffer({ resolveWithObject: true });

      if (data.byteLength < MAX_OUTPUT_SIZE) {
        return { data, width: info.width, height: info.height };
      }
    }

    if (maxDimension <= 480) break;
    maxDimension = Math.max(480, Math.floor(maxDimension * 0.75));
  }

  throw new Error("The image could not be reduced below 100 KB without excessive quality loss.");
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_UPLOAD_SIZE + 64 * 1024) {
    return NextResponse.json({ error: "The image must be no larger than 5 MB." }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "The image upload could not be read." }, { status: 400 });
  }
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Select an image file." }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_UPLOAD_SIZE) {
    return NextResponse.json({ error: "The image must be no larger than 5 MB." }, { status: 400 });
  }

  const signature = Object.hasOwn(allowedTypes, file.type)
    ? allowedTypes[file.type as keyof typeof allowedTypes]
    : undefined;
  if (!signature) {
    return NextResponse.json(
      { error: "Unsupported format. Use JPEG, JPG, PNG, or WebP." },
      { status: 415 },
    );
  }

  const source = Buffer.from(await file.arrayBuffer());
  if (!signature(source)) {
    return NextResponse.json(
      { error: "The file content does not match a valid image." },
      { status: 415 },
    );
  }

  let optimized: Awaited<ReturnType<typeof optimizeToWebp>>;
  try {
    optimized = await optimizeToWebp(source);
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("below 100 KB")
        ? error.message
        : "The image could not be decoded or optimized. Use a valid, non-animated JPEG, PNG, or WebP image.";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  const filename = `${randomUUID()}.webp`;
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(
    path.join(/* turbopackIgnore: true */ uploadDirectory, filename),
    optimized.data,
    { flag: "wx" },
  );

  return NextResponse.json(
    {
      url: `/blog-media/${filename}`,
      size: optimized.data.byteLength,
      width: optimized.width,
      height: optimized.height,
    },
    { status: 201 },
  );
}
