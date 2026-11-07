export const SITE_NAME = "FreePixelKit";
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://es.freepixelkit.com").replace(
    /\/+$/,
    "",
  );
