import { describe, expect, it } from "vitest";
import { CARD_TEXT_SCALES, DEFAULT_EDITOR_TEXT_SIZE, cardTextStyle, isCardTextSize, resolveCardTextSize } from "./text-size";

describe("shared card text sizes", () => {
  it("preserves the approved scale and distinguishes editor and legacy defaults", () => {
    expect(CARD_TEXT_SCALES).toEqual({ small: 0.6, medium: 0.8, large: 1 });
    expect(DEFAULT_EDITOR_TEXT_SIZE).toBe("medium");
    expect(resolveCardTextSize(undefined)).toBe("large");
    expect(cardTextStyle("small")).toEqual({ "--card-text-scale": 0.6 });
  });
  it("does not accept arbitrary font values", () => {
    expect(isCardTextSize(null)).toBe(false);
    expect(isCardTextSize("2rem")).toBe(false);
    expect(resolveCardTextSize("2rem")).toBe("large");
  });
});
