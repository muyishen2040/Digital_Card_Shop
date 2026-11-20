import "server-only";

import { expirationFor, isCardAccessible, validateCardDraft } from "@/lib/cards/instance-model";
import type { CreateCardDraft, CreatedCardInstance, StoredCardInstance } from "@/lib/cards/instance-model";
import { hashCardToken, issueCardToken } from "./card-token";

type CardRow = {
  id: string;
  template_slug: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  available_at: string;
  expires_at: string;
};

/** Privileged access is allowed only within trusted server functions, never client components. */
function storageConfig(): { url: URL; secret: string } {
  const base = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!base || !secret || !secret.startsWith("sb_secret_")) {
    throw new Error("Card storage is not configured with a Supabase secret key.");
  }
  const url = new URL(base);
  if (url.protocol !== "https:") throw new Error("Card storage requires HTTPS.");
  return { url, secret };
}

async function requestRows(url: URL, secret: string, init: RequestInit): Promise<CardRow[]> {
  const headers = new Headers(init.headers);
  headers.set("apikey", secret);
  headers.set("Content-Type", "application/json");
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers,
  });
  // Never log the raw response: error bodies may contain sensitive row fields.
  if (!response.ok) throw new Error("Card storage request failed.");
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error("Unexpected card storage response.");
  return payload as CardRow[];
}

/**
 * Internal service function. A future authenticated sender/payment workflow
 * must authorize the caller, enforce quotas, and rate-limit before invoking it.
 * No public creation route is exposed.
 */
export async function createCardInstance(draft: CreateCardDraft): Promise<CreatedCardInstance> {
  const validated = validateCardDraft(draft);
  const token = issueCardToken();
  const hash = hashCardToken(token);
  if (!hash) throw new Error("Unable to issue a secure access token.");
  const issuedAt = new Date();
  const expiresAt = expirationFor(issuedAt, validated.ttlHours);
  const { url: base, secret } = storageConfig();
  const url = new URL("/rest/v1/card_instances", base);
  url.searchParams.set("select", "id");
  const rows = await requestRows(url, secret, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      template_slug: validated.templateSlug,
      recipient_name: validated.recipientName,
      sender_name: validated.senderName,
      message: validated.message,
      access_token_hash: hash,
      available_at: issuedAt.toISOString(),
      expires_at: expiresAt,
    }),
  });
  if (rows.length !== 1 || typeof rows[0].id !== "string") {
    throw new Error("Card storage did not acknowledge creation.");
  }
  return { id: rows[0].id, accessToken: token, expiresAt };
}

/**
 * Internal token lookup for the dynamic /c/[token] route.
 * Invalid, unavailable, and expired cards all return null; the caller must
 * return the same generic not-found page without leaking card details.
 */
export async function findActiveCardByToken(token: string): Promise<StoredCardInstance | null> {
  const hash = hashCardToken(token);
  if (!hash) return null;
  const now = new Date();
  const { url: base, secret } = storageConfig();
  const url = new URL("/rest/v1/card_instances", base);
  url.searchParams.set("select", "id,template_slug,recipient_name,sender_name,message,available_at,expires_at");
  url.searchParams.set("access_token_hash", `eq.${hash}`);
  url.searchParams.set("available_at", `lte.${now.toISOString()}`);
  url.searchParams.set("expires_at", `gt.${now.toISOString()}`);
  url.searchParams.set("limit", "1");
  const rows = await requestRows(url, secret, { method: "GET" });
  if (rows.length !== 1) return null;
  const card = rows[0];
  if (!isCardAccessible(card.available_at, card.expires_at, now)) return null;
  return {
    id: card.id,
    templateSlug: card.template_slug,
    recipientName: card.recipient_name,
    senderName: card.sender_name,
    message: card.message,
    expiresAt: card.expires_at,
  };
}
