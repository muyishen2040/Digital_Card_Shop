import { getCardContentPolicy, characterCount } from "@/lib/cards/content-policy";
import type { CardTextSize } from "@/types/card";
import { isCardTextSize, LEGACY_TEXT_SIZE } from "./text-size";

export const DEFAULT_TTL_HOURS = 48;
export const ALLOWED_TTL_HOURS = [24, 48, 72] as const;
export type CardTtlHours = (typeof ALLOWED_TTL_HOURS)[number];

export interface CreateCardDraft {
  templateSlug: string;
  recipientName: string;
  senderName: string;
  message: string;
  ttlHours?: CardTtlHours;
  textSize?: CardTextSize;
}

export interface ValidatedCardDraft {
  templateSlug: string;
  recipientName: string;
  senderName: string;
  message: string;
  ttlHours: CardTtlHours;
  textSize: CardTextSize;
}

export interface StoredCardInstance {
  id: string;
  templateSlug: string;
  recipientName: string;
  senderName: string;
  message: string;
  textSize: CardTextSize;
  expiresAt: string;
}

export interface CreatedCardInstance {
  id: string;
  accessToken: string;
  expiresAt: string;
}

function requiredName(value: unknown, label: string, maxLength: number): string {
  if (typeof value !== "string") throw new Error(`${label} is required.`);
  const name = value.trim().replace(/\s+/g, " ");
  if (!name || characterCount(name) > maxLength) {
    throw new Error(`${label} must be between 1 and ${maxLength} characters.`);
  }
  return name;
}

/** Persisted messages are validated, never silently truncated or replaced with demo text. */
export function validateCardDraft(value: CreateCardDraft): ValidatedCardDraft {
  const policy = value && getCardContentPolicy(value.templateSlug);
  if (!policy) throw new Error("Choose a valid card design.");

  const recipientName = requiredName(value.recipientName, "Recipient name", policy.nameCharacters);
  const senderName = requiredName(value.senderName, "Sender name", policy.nameCharacters);
  if (typeof value.message !== "string") throw new Error("A message is required.");
  const message = value.message.replace(/\r\n?/g, "\n").trim();
  if (!message || characterCount(message) > policy.messageCharacters) {
    throw new Error(`Message must be between 1 and ${policy.messageCharacters} characters for this design.`);
  }
  const ttlHours = value.ttlHours ?? DEFAULT_TTL_HOURS;
  if (!(ALLOWED_TTL_HOURS as readonly number[]).includes(ttlHours)) {
    throw new Error("Card access must last 24, 48, or 72 hours.");
  }
  const textSize = value.textSize === undefined ? LEGACY_TEXT_SIZE : value.textSize;
  if (!isCardTextSize(textSize)) throw new Error("Choose a valid card text size.");
  return { templateSlug: value.templateSlug, recipientName, senderName, message, ttlHours, textSize };
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
