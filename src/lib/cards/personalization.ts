import type { CardPersonalization } from "@/types/card";

export const MAX_NAME_LENGTH = 40;
export const MAX_MESSAGE_LENGTH = 600;

export const SUNSHINE_DEMO: Readonly<CardPersonalization> = {
  recipientName: "Alex",
  senderName: "Sam",
  message:
    "I hope something small makes you smile today. You deserve a little warmth, a little rest, and all the good things coming your way.",
};

function normalizeName(value: string, fallback: string): string {
  return (
    value.trim().replace(/\s+/g, " ").slice(0, MAX_NAME_LENGTH).trim() ||
    fallback
  );
}

/** Display-only normalization; never stores or sends the personal note. */
export function toPreviewContent(
  draft: CardPersonalization,
): CardPersonalization {
  const message = draft.message
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH);

  return {
    recipientName: normalizeName(draft.recipientName, "friend"),
    senderName: normalizeName(draft.senderName, "someone thinking of you"),
    message: message || "A little note to brighten your day.",
  };
}
