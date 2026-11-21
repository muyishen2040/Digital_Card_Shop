export type CardTheme = "sunshine" | "night-sky" | "birthday" | "city-postcard";

/** Trusted catalog artwork, never sender-provided image URLs or HTML. */
export interface CityPostcardDesign {
  readonly city: string;
  readonly countryOrRegion?: string;
  readonly frontImage: string;
  readonly backImage: string;
  readonly frontAlt: string;
  readonly backAlt: string;
  readonly sceneCaption?: string;
  /** Opt out of the DOM title only when the approved front already includes fixed destination lettering. */
  readonly frontTitleInArtwork?: boolean;
}

export type CardCollectionId = "city-postcards" | "birthday" | "general";
export type CardOccasion = "encouragement" | "friendship" | "birthday" | "travel" | "everyday";

interface CardTemplateMetadata {
  slug: string;
  title: string;
  collection: CardCollectionId;
  occasions: readonly CardOccasion[];
  description: string;
}

export type CardTemplate = CardTemplateMetadata & (
  | { theme: Exclude<CardTheme, "city-postcard">; collection: Exclude<CardCollectionId, "city-postcards">; postcard?: never }
  | { theme: "city-postcard"; collection: "city-postcards"; postcard: CityPostcardDesign; postcardDemo: Readonly<CardPersonalization> }
);

export type CardTextSize = "small" | "medium" | "large";

export interface CardPersonalization {
  recipientName: string;
  senderName: string;
  message: string;
  imageUrl?: string;
  textSize?: CardTextSize;
}
