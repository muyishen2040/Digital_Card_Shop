import { describe, expect, it } from "vitest";
import { cardTemplates } from "./catalog";
import { CARD_CONTENT_POLICIES, characterCount, getCardContentPolicy } from "./content-policy";

describe("per-template card content limits", () => {
  it("covers every published card design", () => {
    expect(Object.keys(CARD_CONTENT_POLICIES).sort()).toEqual(cardTemplates.map((t) => t.slug).sort());
  });
  it("allows the roomiest letter to hold more than the celebration poster", () => {
    expect(getCardContentPolicy("little-sunshine")!.messageCharacters)
      .toBeGreaterThan(getCardContentPolicy("same-sky")!.messageCharacters);
    expect(getCardContentPolicy("same-sky")!.messageCharacters)
      .toBeGreaterThan(getCardContentPolicy("make-a-wish")!.messageCharacters);
    expect(getCardContentPolicy("missing")).toBeNull();
  });
  it("matches the database's Unicode code-point counting", () => {
    expect(characterCount("A🙂喜")).toBe(3);
  });
});
