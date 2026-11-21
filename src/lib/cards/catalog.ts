import type { CardTemplate } from "@/types/card";
import { HONG_KONG_POSTCARD_SLUG, hongKongPostcardDesign } from "./postcards/hong-kong";

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
  {
    slug: HONG_KONG_POSTCARD_SLUG,
    title: "Greetings from Hong Kong",
    category: "City Postcards",
    description: "Victoria Harbour at night, with a handwritten note on the illustrated reverse.",
    theme: "city-postcard",
    postcard: hongKongPostcardDesign,
  },
];

export function getCardTemplate(slug: string): CardTemplate | undefined {
  return cardTemplates.find((template) => template.slug === slug);
}
