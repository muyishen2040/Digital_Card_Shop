import type { CardPersonalization, CityPostcardDesign } from "@/types/card";

export const HONG_KONG_POSTCARD_SLUG = "city-postcard-hong-kong";

/** Fixed public artwork; the reverse is text-free for DOM personalization. */
export const hongKongPostcardDesign: CityPostcardDesign = {
  city: "Hong Kong",
  frontImage: "/cards/city-postcards/hong-kong/front.webp",
  backImage: "/cards/city-postcards/hong-kong/back.webp",
  frontAlt: "Greetings from Hong Kong. Victoria Harbour at night, with illuminated ferries and skyline, paper texture, a smaller painted skyline and a fixed travel greeting.",
  backAlt: "Watercolor illustration of a ferry and waterfront pier at dusk, framed by warm paper and a bauhinia flower.",
  sceneCaption: "Victoria Harbour at night",
  frontTitleInArtwork: true,
};

export const HONG_KONG_DEMO: Readonly<CardPersonalization> = {
  recipientName: "Friend",
  senderName: "A friend",
  message: "Wish you were here.\nThe harbor lights are beautiful tonight, and the city feels soft and full of little wonder.",
};
