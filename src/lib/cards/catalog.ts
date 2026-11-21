import type { CardCollectionId, CardOccasion, CardTemplate } from "@/types/card";
import { HONG_KONG_POSTCARD_SLUG, hongKongPostcardDesign } from "./postcards/hong-kong";

export const cardTemplates: readonly CardTemplate[] = [
  {
    slug: "little-sunshine",
    title: "A Little Sunshine",
    collection: "general",
    occasions: ["encouragement", "everyday"],
    description: "An envelope opens into a small, blooming surprise.",
    theme: "sunshine",
  },
  {
    slug: "same-sky",
    title: "Under the Same Sky",
    collection: "general",
    occasions: ["friendship", "everyday"],
    description: "A folded night-sky greeting opens to a moonlit personal message.",
    theme: "night-sky",
  },
  {
    slug: "make-a-wish",
    title: "Make a Wish",
    collection: "birthday",
    occasions: ["birthday"],
    description: "A candle, a wish, and a burst of joyful confetti.",
    theme: "birthday",
  },
  {
    slug: HONG_KONG_POSTCARD_SLUG,
    title: "Greetings from Hong Kong",
    collection: "city-postcards",
    occasions: ["travel", "friendship", "everyday"],
    description: "Victoria Harbour at night, with a handwritten note on the illustrated reverse.",
    theme: "city-postcard",
    postcard: hongKongPostcardDesign,
  },
];

export function getCardTemplate(slug: string): CardTemplate | undefined {
  return cardTemplates.find((template) => template.slug === slug);
}

export type CollectionFilter = "all" | CardCollectionId;

export interface CardCollection {
  readonly id: CardCollectionId;
  readonly title: string;
  readonly description: string;
}

export const cardCollections: readonly CardCollection[] = [
  { id: "city-postcards", title: "City Postcards", description: "Send a little piece of somewhere." },
  { id: "birthday", title: "Birthday Cards", description: "Make their day a little brighter." },
  { id: "general", title: "General Cards", description: "No special occasion needed." },
];

const occasionNames: Readonly<Record<CardOccasion, string>> = {
  encouragement: "Encouragement",
  friendship: "Friendship",
  birthday: "Birthday",
  travel: "Travel",
  everyday: "Everyday",
};

export function cardBrowseLabel(card: CardTemplate): string {
  return card.theme === "city-postcard"
    ? card.postcard.city
    : card.occasions.map((occasion) => occasionNames[occasion]).join(" · ");
}

/** One source of truth for collection order, membership and non-empty filters. */
export function getCollectionGroups(
  filter: CollectionFilter = "all",
  templates: readonly CardTemplate[] = cardTemplates,
) {
  return cardCollections
    .filter((collection) => filter === "all" || filter === collection.id)
    .map((collection) => ({ collection, cards: templates.filter((card) => card.collection === collection.id) }))
    .filter(({ cards }) => cards.length > 0);
}

export function getCollectionFilters(templates: readonly CardTemplate[] = cardTemplates): readonly {
  id: CollectionFilter; label: string;
}[] {
  return [
    { id: "all", label: "All cards" },
    ...getCollectionGroups("all", templates).map(({ collection }) => ({ id: collection.id, label: collection.title })),
  ];
}

export function getVisibleCardTemplates(filter: CollectionFilter): readonly CardTemplate[] {
  return getCollectionGroups(filter).flatMap(({ cards }) => cards);
}
