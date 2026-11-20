/**
 * All recipient links must use the public site, even when a sender creates a card
 * from a Vercel-authenticated Preview deployment. Never derive this origin from
 * window.location or request Host headers.
 *
 * Both environments currently read the same Supabase card-instance database.
 * Update this origin when the public recipient domain changes.
 */
export const PUBLIC_RECIPIENT_ORIGIN = "https://digital-card-shop.vercel.app";

export function recipientCardUrl(path: string): string {
  if (!/^\/c\/[A-Za-z0-9_-]{43}$/.test(path)) {
    throw new Error("Unexpected private recipient path.");
  }
  return PUBLIC_RECIPIENT_ORIGIN + path;
}
