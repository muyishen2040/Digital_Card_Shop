import type { CardPersonalization, CardTemplate } from "@/types/card";

export const birthdayArtSlugs = [
  "velvet-encore",
  "birthday-bloom",
  "golden-parcel",
  "another-orbit",
  "birthday-record",
] as const;

export type BirthdayArtSlug = (typeof birthdayArtSlugs)[number];

export function isBirthdayArtSlug(slug: string): slug is BirthdayArtSlug {
  return (birthdayArtSlugs as readonly string[]).includes(slug);
}

const details: Readonly<Record<BirthdayArtSlug, {
  title: string; description: string; message: string;
}>> = {
  "velvet-encore": {
    title: "Velvet Encore",
    description: "Draw apart a velvet theater curtain for a birthday standing ovation.",
    message: "You deserve a standing ovation, not just today but every day. Here's to the wonderful, unforgettable things the next chapter holds for you.",
  },
  "birthday-bloom": {
    title: "Birthday Bloom",
    description: "Unfurl a botanical illustration to reveal a garden letter.",
    message: "May your new year unfold with beautiful surprises, kind people, and all the little moments that make a day worth remembering.",
  },
  "golden-parcel": {
    title: "Golden Parcel",
    description: "Untie a satin ribbon and discover a birthday note inside.",
    message: "A little something, wrapped just for you: gratitude for who you are, excitement for who you're becoming, and a hundred reasons to celebrate today.",
  },
  "another-orbit": {
    title: "Another Orbit",
    description: "Launch an illustrated rocket to reveal a birthday mission letter.",
    message: "A whole new trip around the sun begins today. I hope it takes you somewhere surprising, wonderful, and completely your own. Happy birthday!",
  },
  "birthday-record": {
    title: "Birthday Record",
    description: "Slip a vinyl record out of its sleeve to reveal birthday liner notes.",
    message: "If your year were a record, I'd play all the good moments twice. Here's to fresh discoveries, favorite people, and a soundtrack that's entirely yours. Happy birthday!",
  },
};

export const birthdayArtTemplates: readonly CardTemplate[] = birthdayArtSlugs.map((slug) => ({
  slug,
  title: details[slug].title,
  description: details[slug].description,
  collection: "birthday",
  occasions: ["birthday"],
  theme: "birthday",
}));

export const birthdayArtDemo: Readonly<Record<BirthdayArtSlug, CardPersonalization>> =
  Object.fromEntries(birthdayArtSlugs.map((slug) => [slug, {
    recipientName: "Alex",
    senderName: "Sam",
    message: details[slug].message,
  }])) as Record<BirthdayArtSlug, CardPersonalization>;
