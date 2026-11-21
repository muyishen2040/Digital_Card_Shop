/**
 * Per-template *recommendations* are editorial guidance, not publication
 * restrictions. The real rendered layout is measured in the sender preview.
 */
export const MAX_CARD_NAME_CHARACTERS = 40;
export const MAX_CARD_MESSAGE_CHARACTERS = 600;
export const CARD_CONTENT_POLICIES = {
  "little-sunshine": {
    nameCharacters: MAX_CARD_NAME_CHARACTERS,
    messageCharacters: MAX_CARD_MESSAGE_CHARACTERS,
    recommendedMessageCharacters: 240,
  },
  "same-sky": {
    nameCharacters: MAX_CARD_NAME_CHARACTERS,
    messageCharacters: MAX_CARD_MESSAGE_CHARACTERS,
    recommendedMessageCharacters: 140,
  },
  "city-postcard-hong-kong": {
    nameCharacters: MAX_CARD_NAME_CHARACTERS,
    messageCharacters: MAX_CARD_MESSAGE_CHARACTERS,
    recommendedMessageCharacters: 180,
  },
  "make-a-wish": {
    nameCharacters: MAX_CARD_NAME_CHARACTERS,
    messageCharacters: MAX_CARD_MESSAGE_CHARACTERS,
    recommendedMessageCharacters: 100,
  },
} as const;

export type CardContentSlug = keyof typeof CARD_CONTENT_POLICIES;
export type CardContentPolicy = Readonly<{
  nameCharacters: number;
  messageCharacters: number;
  recommendedMessageCharacters: number;
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
