export type CardTheme = "sunshine" | "night-sky" | "birthday" | "city-postcard";

/** Trusted catalog artwork, never sender-provided image URLs or HTML. */
export interface CityPostcardDesign {
  readonly city: string;
  readonly frontImage: string;
  readonly backImage: string;
  readonly frontAlt: string;
  readonly backAlt: string;
  readonly sceneCaption?: string;
  /** Opt out of the DOM title only when the approved front already includes fixed destination lettering. */
  readonly frontTitleInArtwork?: boolean;
}

interface CardTemplateMetadata {
  slug: string;
  title: string;
  category: string;
  description: string;
}

export type CardTemplate = CardTemplateMetadata & (
  | { theme: Exclude<CardTheme, "city-postcard">; postcard?: never }
  | { theme: "city-postcard"; postcard: CityPostcardDesign }
);

export type CardTextSize = "small" | "medium" | "large";

export interface CardPersonalization {
  recipientName: string;
  senderName: string;
  message: string;
  imageUrl?: string;
  textSize?: CardTextSize;
}
