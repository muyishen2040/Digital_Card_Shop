import { describe, expect, it } from "vitest";
import { cardBrowseLabel, cardTemplates, getCardTemplate, getCollectionFilters, getCollectionGroups, getVisibleCardTemplates } from "./catalog";

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

  it("groups every published card once in the intended collection order", () => {
    const groups = getCollectionGroups();
    expect(groups.map(({ collection }) => collection.id)).toEqual(["city-postcards", "birthday", "general"]);
    expect(groups.flatMap(({ cards }) => cards.map((card) => card.slug)).sort()).toEqual(cardTemplates.map((card) => card.slug).sort());
    expect(groups[0].cards.map((card) => card.slug)).toContain("city-postcard-hong-kong");
    expect(groups[1].cards.map((card) => card.slug)).toContain("make-a-wish");
    expect(groups[2].cards.map((card) => card.slug)).toEqual(expect.arrayContaining(["little-sunshine", "same-sky"]));
  });

  it("filters both browsing surfaces without duplicates or empty collections", () => {
    expect(getVisibleCardTemplates("birthday").every((card) => card.collection === "birthday")).toBe(true);
    expect(getVisibleCardTemplates("all")).toHaveLength(cardTemplates.length);
    const general = cardTemplates.filter((card) => card.collection === "general");
    expect(getCollectionGroups("city-postcards", general)).toEqual([]);
    expect(getCollectionFilters(general).map(({ id }) => id)).toEqual(["all", "general"]);
    expect(getCollectionFilters([]).map(({ id }) => id)).toEqual(["all"]);
  });

  it("keeps occasion and destination metadata separate from collection membership", () => {
    const card = getCardTemplate("city-postcard-hong-kong")!;
    expect(card.collection).toBe("city-postcards");
    expect(card.occasions).toContain("friendship");
    expect(cardBrowseLabel(card)).toBe("Hong Kong");
    expect(cardBrowseLabel(getCardTemplate("same-sky")!)).toContain("Friendship");
  });

  it("returns the corresponding template for a known slug", () => {
    expect(getCardTemplate("same-sky")?.title).toBe("Under the Same Sky");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getCardTemplate("missing")).toBeUndefined();
  });
});
