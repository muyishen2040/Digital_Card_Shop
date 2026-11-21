import { describe, expect, it } from "vitest";
import { cardTemplates, getCardTemplate } from "./catalog";

describe("card template catalog", () => {
  it("preserves existing designs and gives every template a unique address", () => {
    expect(cardTemplates.map((template) => template.slug)).toEqual(expect.arrayContaining([
      "little-sunshine", "same-sky", "make-a-wish", "city-postcard-hong-kong",
    ]));
    expect(new Set(cardTemplates.map((template) => template.slug)).size).toBe(cardTemplates.length);
  });

  it("registers the first city with the shared art contract", () => {
    const template = getCardTemplate("city-postcard-hong-kong");
    expect(template?.theme).toBe("city-postcard");
    if (template?.theme !== "city-postcard") throw new Error("Missing postcard template");
    expect(template.postcard.city).toBe("Hong Kong");
    expect(template.postcard.frontTitleInArtwork).toBe(true);
    expect(template.postcard.frontImage).toMatch(/\/hong-kong\/front\.webp$/);
    expect(template.postcard.backImage).toMatch(/\/hong-kong\/back\.webp$/);
  });

  it("returns the corresponding template for a known slug", () => {
    expect(getCardTemplate("same-sky")?.title).toBe("Under the Same Sky");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getCardTemplate("missing")).toBeUndefined();
  });
});
