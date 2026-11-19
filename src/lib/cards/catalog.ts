import type { CardTemplate } from "@/types/card";

export const cardTemplates: readonly CardTemplate[] = [
  {
    slug: "little-sunshine",
    title: "A Little Sunshine",
    category: "Encouragement",
    description: "An envelope opens into a small, blooming surprise.",
    theme: "sunshine",
  },
  {
    slug: "same-sky",
    title: "Under the Same Sky",
    category: "Friendship",
    description: "A folded night-sky greeting opens to a moonlit personal message.",
    theme: "night-sky",
  },
  {
    slug: "make-a-wish",
    title: "Make a Wish",
    category: "Birthday",
    description: "A candle, a wish, and a burst of joyful confetti.",
    theme: "birthday",
  },
];

export function getCardTemplate(slug: string): CardTemplate | undefined {
  return cardTemplates.find((template) => template.slug === slug);
}
