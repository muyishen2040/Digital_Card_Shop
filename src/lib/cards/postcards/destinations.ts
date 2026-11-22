import type { CardPersonalization, CardTemplate, CityPostcardDesign } from "@/types/card";
import { HONG_KONG_DEMO, HONG_KONG_POSTCARD_SLUG, hongKongPostcardDesign } from "./hong-kong";
import { TAIPEI_DEMO, TAIPEI_POSTCARD_SLUG, taipeiPostcardDesign } from "./taipei";

/** One manifest per public destination; release timing and upload batches are not catalog concepts. */
export interface CityPostcardManifest {
  readonly slug: string;
  readonly description: string;
  readonly postcard: CityPostcardDesign;
  readonly postcardDemo: Readonly<CardPersonalization>;
}

/** Append future destinations here; their artwork always lives in a matching city directory. */
export const cityPostcardManifests: readonly CityPostcardManifest[] = [
  {
    slug: HONG_KONG_POSTCARD_SLUG,
    description: "Victoria Harbour at night, with a handwritten note on the illustrated reverse.",
    postcard: hongKongPostcardDesign,
    postcardDemo: HONG_KONG_DEMO,
  },
  {
    slug: TAIPEI_POSTCARD_SLUG,
    description: "Taipei 101 at sunset and a painted Dadaocheng streetscape on the reverse.",
    postcard: taipeiPostcardDesign,
    postcardDemo: TAIPEI_DEMO,
  },
  {
    "slug": "city-postcard-kyoto",
    "description": "A lantern-lit view of Yasaka Pagoda, with Arashiyama's river and bridge painted on the reverse.",
    "postcard": {
      "city": "Kyoto",
      "countryOrRegion": "Japan",
      "sceneCaption": "Yasaka Pagoda at sunset",
      "frontImage": "/cards/city-postcards/kyoto/front.webp",
      "backImage": "/cards/city-postcards/kyoto/back.webp",
      "frontAlt": "Vintage Kyoto postcard showing Yasaka Pagoda above a traditional lantern-lit street at sunset, with cherry blossoms and a painted city vignette.",
      "backAlt": "Warm watercolor stationery with cherry blossoms and an illustration of Togetsukyo Bridge over the Arashiyama river at the bottom.",
      "frontTitleInArtwork": true
    },
    "postcardDemo": {
      "recipientName": "Friend",
      "senderName": "A friend",
      "message": "Wish you were here.\nThe old streets of Kyoto are glowing at sunset, and the river seems to carry the evening along. I thought of you."
    }
  },
  {
    "slug": "city-postcard-seoul",
    "description": "The lights of Namsan Tower above Seoul, paired with a painted Bukchon Hanok streetscape.",
    "postcard": {
      "city": "Seoul",
      "countryOrRegion": "South Korea",
      "sceneCaption": "Namsan Tower at dusk",
      "frontImage": "/cards/city-postcards/seoul/front.webp",
      "backImage": "/cards/city-postcards/seoul/back.webp",
      "frontAlt": "Vintage Seoul postcard showing N Seoul Tower illuminated above a twilight skyline, with a small painted city view on ivory paper.",
      "backAlt": "Warm watercolor stationery with a Korean decorative tassel, traditional tiled roofs and a painted Bukchon Hanok Village street below.",
      "frontTitleInArtwork": true
    },
    "postcardDemo": {
      "recipientName": "Friend",
      "senderName": "A friend",
      "message": "Wish you were here.\nSeoul is turning blue and gold as the evening lights come on. I hope we can wander these streets together someday."
    }
  },
  {
    "slug": "city-postcard-paris",
    "description": "An evening view of the Eiffel Tower and the Seine, with a painted riverside café on the reverse.",
    "postcard": {
      "city": "Paris",
      "countryOrRegion": "France",
      "sceneCaption": "Eiffel Tower at dusk",
      "frontImage": "/cards/city-postcards/paris/front.webp",
      "backImage": "/cards/city-postcards/paris/back.webp",
      "frontAlt": "Vintage Paris postcard showing the Eiffel Tower glowing beside the Seine at dusk, with a small painted tower and rooftops below.",
      "backAlt": "Warm watercolor stationery with a small illustration of a Parisian riverside café, bridge and the Eiffel Tower along the lower edge.",
      "frontTitleInArtwork": true
    },
    "postcardDemo": {
      "recipientName": "Friend",
      "senderName": "A friend",
      "message": "Wish you were here.\nThe lights are coming on along the Seine, and Paris feels softer in the evening. This little view made me think of you."
    }
  },
  {
    "slug": "city-postcard-san-francisco",
    "description": "A sunset over the Golden Gate Bridge, with a painted cable car and Victorian houses on the reverse.",
    "postcard": {
      "city": "San Francisco",
      "countryOrRegion": "United States",
      "sceneCaption": "Golden Gate at sunset",
      "frontImage": "/cards/city-postcards/san-francisco/front.webp",
      "backImage": "/cards/city-postcards/san-francisco/back.webp",
      "frontAlt": "Vintage San Francisco postcard showing the Golden Gate Bridge above fog at sunset, with a small painted bridge vignette below.",
      "backAlt": "Warm watercolor stationery with a painted San Francisco cable car, Victorian houses and a distant bridge along the lower quarter.",
      "frontTitleInArtwork": true
    },
    "postcardDemo": {
      "recipientName": "Friend",
      "senderName": "A friend",
      "message": "Wish you were here.\nThe bridge is glowing through the fog, and the hills are full of little surprises. It would be more fun exploring them with you."
    }
  },
  {
    "slug": "city-postcard-singapore",
    "description": "Marina Bay's illuminated skyline, paired with colorful Peranakan shophouses on the reverse.",
    "postcard": {
      "city": "Singapore",
      "countryOrRegion": "Singapore",
      "sceneCaption": "Marina Bay at twilight",
      "frontImage": "/cards/city-postcards/singapore/front.webp",
      "backImage": "/cards/city-postcards/singapore/back.webp",
      "frontAlt": "Vintage Singapore postcard showing Marina Bay Sands, the Singapore Flyer and bright skyline reflections at twilight, with a painted waterfront vignette.",
      "backAlt": "Warm watercolor stationery with an orchid and a painted row of colorful Peranakan shophouses across the bottom.",
      "frontTitleInArtwork": true
    },
    "postcardDemo": {
      "recipientName": "Friend",
      "senderName": "A friend",
      "message": "Wish you were here.\nMarina Bay is shining tonight, and every street seems to hold a new color. I wish we could see it all together."
    }
  },
];

export const cityPostcardTemplates: readonly CardTemplate[] = cityPostcardManifests.map(
  ({ slug, description, postcard, postcardDemo }): CardTemplate => ({
    slug,
    title: `Greetings from ${postcard.city}`,
    collection: "city-postcards",
    occasions: ["travel", "friendship", "everyday"],
    description,
    theme: "city-postcard",
    postcard,
    postcardDemo,
  }),
);
