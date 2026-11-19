/**
 * Initial per-template authoring ceilings, calibrated against compact layouts.
 * They prevent overly long notes; they do not guarantee geometric fit.
 * The sender preview must also measure the rendered text at mobile sizes.
 */
export const CARD_CONTENT_POLICIES = {
  "little-sunshine": { nameCharacters: 32, messageCharacters: 240 },
  "same-sky": { nameCharacters: 24, messageCharacters: 140 },
  "make-a-wish": { nameCharacters: 24, messageCharacters: 100 },
} as const;

export type CardContentSlug = keyof typeof CARD_CONTENT_POLICIES;
export type CardContentPolicy = Readonly<{
  nameCharacters: number;
  messageCharacters: number;
}>;

export function getCardContentPolicy(slug: string): CardContentPolicy | null {
  return Object.prototype.hasOwnProperty.call(CARD_CONTENT_POLICIES, slug)
    ? CARD_CONTENT_POLICIES[slug as CardContentSlug]
    : null;
}

/** PostgreSQL char_length counts Unicode code points rather than UTF-16 units. */
export function characterCount(text: string): number {
  return Array.from(text).length;
}
