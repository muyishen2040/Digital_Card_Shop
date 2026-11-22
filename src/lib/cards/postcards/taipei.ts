import type { CardPersonalization, CityPostcardDesign } from "@/types/card";

export const TAIPEI_POSTCARD_SLUG = "city-postcard-taipei";

export const taipeiPostcardDesign: CityPostcardDesign = {
  city: "Taipei",
  countryOrRegion: "Taiwan",
  frontImage: "/cards/city-postcards/taipei/front.webp",
  backImage: "/cards/city-postcards/taipei/back.webp",
  frontAlt: "Greetings from Taipei. Taipei 101 and the city skyline under a pink and golden sunset, with a smaller painted skyline and a plum blossom stamp.",
  backAlt: "Hand-painted interpretation of Dadaocheng's historic red-brick storefronts in warm evening light, with plum blossoms and ivory stationery.",
  sceneCaption: "Taipei 101 at sunset",
  frontTitleInArtwork: true,
};

export const TAIPEI_DEMO: Readonly<CardPersonalization> = {
  recipientName: "Friend",
  senderName: "A friend",
  message: "Wish you were here.\nThe sky over Taipei is turning pink, and the old streets are glowing in the evening light. I thought of you.",
};
