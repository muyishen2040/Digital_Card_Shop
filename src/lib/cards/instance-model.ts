import { getCardTemplate } from "@/lib/cards/catalog";
import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH } from "@/lib/cards/personalization";

export const DEFAULT_TTL_HOURS = 48;
export const ALLOWED_TTL_HOURS = [24, 48, 72] as const;
export type CardTtlHours = (typeof ALLOWED_TTL_HOURS)[number];

export interface CreateCardDraft {
  templateSlug: string;
  recipientName: string;
  senderName: string;
  message: string;
  ttlHours?: CardTtlHours;
}

export interface ValidatedCardDraft {
  templateSlug: string;
  recipientName: string;
  senderName: string;
  message: string;
  ttlHours: CardTtlHours;
}

export interface StoredCardInstance {
  id: string;
  templateSlug: string;
  recipientName: string;
  senderName: string;
  message: string;
  expiresAt: string;
}

export interface CreatedCardInstance {
  id: string;
  accessToken: string;
  expiresAt: string;
}

function requiredName(value: unknown, label: string): string {
  if (typeof value !== "string") throw new Error(`${label} is required.`);
  const name = value.trim().replace(/\s+/g, " ");
  if (!name || name.length > MAX_NAME_LENGTH) {
    throw new Error(`${label} must be between 1 and ${MAX_NAME_LENGTH} characters.`);
  }
  return name;
}

/** Persisted messages are validated, never silently truncated or replaced with demo text. */
export function validateCardDraft(value: CreateCardDraft): ValidatedCardDraft {
  if (!value || !getCardTemplate(value.templateSlug)) {
    throw new Error("Choose a valid card design.");
  }
  const recipientName = requiredName(value.recipientName, "Recipient name");
  const senderName = requiredName(value.senderName, "Sender name");
  if (typeof value.message !== "string") throw new Error("A message is required.");
  const message = value.message.replace(/\r\n?/g, "\n").trim();
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.`);
  }
  const ttlHours = value.ttlHours ?? DEFAULT_TTL_HOURS;
  if (!(ALLOWED_TTL_HOURS as readonly number[]).includes(ttlHours)) {
    throw new Error("Card access must last 24, 48, or 72 hours.");
  }
  return { templateSlug: value.templateSlug, recipientName, senderName, message, ttlHours };
}

export function expirationFor(availableAt: Date, ttlHours: CardTtlHours): string {
  if (Number.isNaN(availableAt.getTime())) throw new Error("Invalid start time.");
  return new Date(availableAt.getTime() + ttlHours * 60 * 60 * 1000).toISOString();
}

export function isCardAccessible(availableAt: string, expiresAt: string, now: Date): boolean {
  const available = Date.parse(availableAt);
  const expiry = Date.parse(expiresAt);
  return Number.isFinite(available) && Number.isFinite(expiry)
    && available <= now.getTime() && now.getTime() < expiry;
}
