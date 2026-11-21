import type { CSSProperties } from "react";
import type { CardTextSize } from "@/types/card";

export const CARD_TEXT_SIZES = ["small", "medium", "large"] as const;
export const DEFAULT_EDITOR_TEXT_SIZE: CardTextSize = "medium";
export const LEGACY_TEXT_SIZE: CardTextSize = "large";

export const CARD_TEXT_SCALES: Readonly<Record<CardTextSize, number>> = {
  small: 0.6,
  medium: 0.8,
  large: 1,
};

export function isCardTextSize(value: unknown): value is CardTextSize {
  return CARD_TEXT_SIZES.some((size) => value === size);
}

/** Missing preferences preserve the original typography. */
export function resolveCardTextSize(value: unknown): CardTextSize {
  return isCardTextSize(value) ? value : LEGACY_TEXT_SIZE;
}

export function cardTextStyle(value: unknown): CSSProperties {
  return { "--card-text-scale": CARD_TEXT_SCALES[resolveCardTextSize(value)] } as CSSProperties;
}
