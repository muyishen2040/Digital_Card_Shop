import "server-only";

import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { storageConfig } from "./storage-config";

/** Public publishing remains disabled until all production safeguards are configured. */
export function publicCreationConfigured(): boolean {
  return process.env.CARD_PUBLIC_CREATION_ENABLED === "true"
    && (process.env.TURNSTILE_SECRET_KEY?.length ?? 0) >= 20
    && (process.env.CARD_RATE_LIMIT_SECRET?.length ?? 0) >= 32;
}

/** Vercel overwrites X-Forwarded-For. Never accept user-supplied IP fields in JSON. */
export function getClientIp(request: Request): string | null {
  const first = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first && isIP(first) ? first : null;
}

/** Turnstile validation is mandatory; single-use tokens expire after five minutes. */
export async function verifyTurnstile(token: string, hostname: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || token.length > 2048 || token.length < 1) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Bot verification unavailable.");
  const result: unknown = await response.json();
  if (!result || typeof result !== "object") return false;
  const data = result as { success?: boolean; hostname?: string; action?: string };
  return data.success === true && data.hostname === hostname && data.action === "create_card";
}

/**
 * Global and per-IP quotas are checked atomically in one Supabase transaction.
 * The keyed HMAC prevents storing raw IP addresses or predictable IP digests.
 */
export async function reservePublicCardSlot(ip: string): Promise<boolean> {
  const key = process.env.CARD_RATE_LIMIT_SECRET;
  if (!key || key.length < 32) throw new Error("Rate limiter is not configured.");
  const fingerprint = createHmac("sha256", key).update(ip, "utf8").digest("hex");
  const { url: base, secret } = storageConfig();
  const url = new URL("/rest/v1/rpc/reserve_public_card_slot", base);
  const response = await fetch(url, {
    method: "POST",
    headers: { apikey: secret, "Content-Type": "application/json" },
    body: JSON.stringify({ p_fingerprint: fingerprint }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Rate limiter unavailable.");
  const result: unknown = await response.json();
  if (typeof result !== "boolean") throw new Error("Rate limiter returned an invalid response.");
  return result;
}
