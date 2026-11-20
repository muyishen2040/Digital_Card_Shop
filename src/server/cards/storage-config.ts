import "server-only";

/** Backend-only Supabase Data API credentials. Never import into client code. */
export function storageConfig(): { url: URL; secret: string } {
  const base = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!base || !secret || !secret.startsWith("sb_secret_")) {
    throw new Error("Card storage is not configured with a Supabase secret key.");
  }
  const url = new URL(base);
  if (url.protocol !== "https:") throw new Error("Card storage requires HTTPS.");
  return { url, secret };
}
