import { cardTemplates } from "./catalog";
import type { CardTheme } from "@/types/card";

/**
 * Per-design recommendations are editorial hints; the real sender preview
 * measures rendered text fit. All templates retain the same storage limits.
 */
export const MAX_CARD_NAME_CHARACTERS = 40;
export const MAX_CARD_MESSAGE_CHARACTERS = 600;

export type CardContentPolicy = Readonly<{
  nameCharacters: number;
  messageCharacters: number;
  recommendedMessageCharacters: number;
}>;

const RECOMMENDED_LENGTH: Readonly<Record<CardTheme, number>> = {
  sunshine: 240,
  "night-sky": 140,
  birthday: 100,
  "city-postcard": 180,
};

export const CARD_CONTENT_POLICIES: Readonly<Record<string, CardContentPolicy>> = Object.fromEntries(
  cardTemplates.map(({ slug, theme }) => [slug, {
    nameCharacters: MAX_CARD_NAME_CHARACTERS,
    messageCharacters: MAX_CARD_MESSAGE_CHARACTERS,
    recommendedMessageCharacters: RECOMMENDED_LENGTH[theme],
  }]),
);

// Published catalog entries are the single source of truth for valid slugs.
export type CardContentSlug = (typeof cardTemplates)[number]["slug"];

export function getCardContentPolicy(slug: string): CardContentPolicy | null {
  return Object.prototype.hasOwnProperty.call(CARD_CONTENT_POLICIES, slug)
    ? CARD_CONTENT_POLICIES[slug] : null;
}

/** PostgreSQL char_length counts Unicode code points rather than UTF-16 units. */
export function characterCount(text: string): number {
  return Array.from(text).length;
}
