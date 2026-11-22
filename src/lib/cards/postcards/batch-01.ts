import type { CardTemplate } from "@/types/card";

interface CityPostcardSource {
  readonly assetKey: string;
  readonly city: string;
  readonly countryOrRegion: string;
  readonly sceneCaption: string;
  readonly description: string;
  readonly frontAlt: string;
  readonly backAlt: string;
  readonly demoMessage: string;
}

/**
 * Trusted, reviewed artwork metadata. File paths are derived from the asset key,
 * not supplied by senders. All five postcards share one interactive renderer.
 */
export const batchOneCities = [
  {
    "assetKey": "kyoto",
    "city": "Kyoto",
    "countryOrRegion": "Japan",
    "sceneCaption": "Yasaka Pagoda at sunset",
    "description": "A lantern-lit view of Yasaka Pagoda, with Arashiyama's river and bridge painted on the reverse.",
    "frontAlt": "Vintage Kyoto postcard showing Yasaka Pagoda above a traditional lantern-lit street at sunset, with cherry blossoms and a painted city vignette.",
    "backAlt": "Warm watercolor stationery with cherry blossoms and an illustration of Togetsukyo Bridge over the Arashiyama river at the bottom.",
    "demoMessage": "Wish you were here.\nThe old streets of Kyoto are glowing at sunset, and the river seems to carry the evening along. I thought of you."
  },
  {
    "assetKey": "seoul",
    "city": "Seoul",
    "countryOrRegion": "South Korea",
    "sceneCaption": "Namsan Tower at dusk",
    "description": "The lights of Namsan Tower above Seoul, paired with a painted Bukchon Hanok streetscape.",
    "frontAlt": "Vintage Seoul postcard showing N Seoul Tower illuminated above a twilight skyline, with a small painted city view on ivory paper.",
    "backAlt": "Warm watercolor stationery with a Korean decorative tassel, traditional tiled roofs and a painted Bukchon Hanok Village street below.",
    "demoMessage": "Wish you were here.\nSeoul is turning blue and gold as the evening lights come on. I hope we can wander these streets together someday."
  },
  {
    "assetKey": "paris",
    "city": "Paris",
    "countryOrRegion": "France",
    "sceneCaption": "Eiffel Tower at dusk",
    "description": "An evening view of the Eiffel Tower and the Seine, with a painted riverside café on the reverse.",
    "frontAlt": "Vintage Paris postcard showing the Eiffel Tower glowing beside the Seine at dusk, with a small painted tower and rooftops below.",
    "backAlt": "Warm watercolor stationery with a small illustration of a Parisian riverside café, bridge and the Eiffel Tower along the lower edge.",
    "demoMessage": "Wish you were here.\nThe lights are coming on along the Seine, and Paris feels softer in the evening. This little view made me think of you."
  },
  {
    "assetKey": "san-francisco",
    "city": "San Francisco",
    "countryOrRegion": "United States",
    "sceneCaption": "Golden Gate at sunset",
    "description": "A sunset over the Golden Gate Bridge, with a painted cable car and Victorian houses on the reverse.",
    "frontAlt": "Vintage San Francisco postcard showing the Golden Gate Bridge above fog at sunset, with a small painted bridge vignette below.",
    "backAlt": "Warm watercolor stationery with a painted San Francisco cable car, Victorian houses and a distant bridge along the lower quarter.",
    "demoMessage": "Wish you were here.\nThe bridge is glowing through the fog, and the hills are full of little surprises. It would be more fun exploring them with you."
  },
  {
    "assetKey": "singapore",
    "city": "Singapore",
    "countryOrRegion": "Singapore",
    "sceneCaption": "Marina Bay at twilight",
    "description": "Marina Bay's illuminated skyline, paired with colorful Peranakan shophouses on the reverse.",
    "frontAlt": "Vintage Singapore postcard showing Marina Bay Sands, the Singapore Flyer and bright skyline reflections at twilight, with a painted waterfront vignette.",
    "backAlt": "Warm watercolor stationery with an orchid and a painted row of colorful Peranakan shophouses across the bottom.",
    "demoMessage": "Wish you were here.\nMarina Bay is shining tonight, and every street seems to hold a new color. I wish we could see it all together."
  }
] as const satisfies readonly CityPostcardSource[];

export const batchOnePostcards: readonly CardTemplate[] = batchOneCities.map((city) => ({
  slug: `city-postcard-${city.assetKey}`,
  title: `Greetings from ${city.city}`,
  collection: "city-postcards" as const,
  occasions: ["travel", "friendship", "everyday"] as const,
  description: city.description,
  theme: "city-postcard" as const,
  postcard: {
    city: city.city,
    countryOrRegion: city.countryOrRegion,
    sceneCaption: city.sceneCaption,
    frontImage: `/cards/city-postcards/${city.assetKey}/front.webp`,
    backImage: `/cards/city-postcards/${city.assetKey}/back.webp`,
    frontAlt: city.frontAlt,
    backAlt: city.backAlt,
    frontTitleInArtwork: true,
  },
  postcardDemo: {
    recipientName: "Friend",
    senderName: "A friend",
    message: city.demoMessage,
  },
}));
