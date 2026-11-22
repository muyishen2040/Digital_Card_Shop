import { describe, expect, it } from "vitest";
import { cardBrowseLabel, cardTemplates, getCardTemplate, getCollectionFilters, getCollectionGroups, getVisibleCardTemplates } from "./catalog";
import { cityPostcardManifests } from "./postcards/destinations";

describe("card template catalog", () => {
  it("preserves existing designs and gives every template a unique address", () => {
    expect(cardTemplates.map((template) => template.slug)).toEqual(expect.arrayContaining([
      "little-sunshine", "same-sky", "make-a-wish", "city-postcard-hong-kong", "city-postcard-taipei",
      ...cityPostcardManifests.map((destination) => destination.slug),
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

  it("gives each city independent artwork and demo content", () => {
    const taipei = getCardTemplate("city-postcard-taipei");
    const hongKong = getCardTemplate("city-postcard-hong-kong");
    if (taipei?.theme !== "city-postcard" || hongKong?.theme !== "city-postcard") throw new Error("Missing city template");
    expect(taipei.postcard.city).toBe("Taipei");
    expect(taipei.postcard.countryOrRegion).toBe("Taiwan");
    expect(taipei.postcard.frontTitleInArtwork).toBe(true);
    expect(taipei.postcard.frontImage).toBe("/cards/city-postcards/taipei/front.webp");
    expect(taipei.postcard.backImage).toBe("/cards/city-postcards/taipei/back.webp");
    expect(taipei.postcardDemo.message).toContain("Taipei");
    expect(taipei.postcardDemo.message).not.toBe(hongKong.postcardDemo.message);
  });

  it("registers every city independently with its own metadata and images", () => {
    expect(cityPostcardManifests.length).toBeGreaterThanOrEqual(7);
    expect(new Set(cityPostcardManifests.map((destination) => destination.slug)).size).toBe(cityPostcardManifests.length);
    expect(cardTemplates.filter((card) => card.theme === "city-postcard")).toHaveLength(cityPostcardManifests.length);

    for (const { slug, postcard, postcardDemo } of cityPostcardManifests) {
      const template = getCardTemplate(slug);
      expect(template?.theme).toBe("city-postcard");
      if (template?.theme !== "city-postcard") throw new Error("Missing destination " + slug);
      expect(template.collection).toBe("city-postcards");
      expect(template.title).toBe("Greetings from " + postcard.city);
      expect(template.occasions).toContain("travel");
      expect(template.postcard).toEqual(postcard);
      expect(template.postcardDemo).toEqual(postcardDemo);
      expect(postcard.frontImage).toBe(`/cards/city-postcards/${slug.replace(/^city-postcard-/, "")}/front.webp`);
      expect(postcard.backImage).toBe(`/cards/city-postcards/${slug.replace(/^city-postcard-/, "")}/back.webp`);
      expect(postcard.frontTitleInArtwork).toBe(true);
      expect(postcardDemo.message.trim().length).toBeGreaterThan(20);
    }
  });

  it("groups every published card once in the intended collection order", () => {
    const groups = getCollectionGroups();
    expect(groups.map(({ collection }) => collection.id)).toEqual(["city-postcards", "birthday", "general"]);
    expect(groups.flatMap(({ cards }) => cards.map((card) => card.slug)).sort()).toEqual(cardTemplates.map((card) => card.slug).sort());
    expect(groups[0].cards.map((card) => card.slug)).toEqual(expect.arrayContaining([
      "city-postcard-hong-kong", "city-postcard-taipei",
      ...cityPostcardManifests.map((destination) => destination.slug),
    ]));
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
