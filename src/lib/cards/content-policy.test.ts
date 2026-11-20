import { describe, expect, it } from "vitest";
import { cardTemplates } from "./catalog";
import {
  CARD_CONTENT_POLICIES,
  MAX_CARD_MESSAGE_CHARACTERS,
  MAX_CARD_NAME_CHARACTERS,
  characterCount,
  getCardContentPolicy,
} from "./content-policy";

describe("per-template card content recommendations", () => {
  it("covers every published card design", () => {
    expect(Object.keys(CARD_CONTENT_POLICIES).sort()).toEqual(cardTemplates.map((t) => t.slug).sort());
  });
  it("shares storage safety limits while retaining design-specific writing guidance", () => {
    for (const template of cardTemplates) {
      expect(getCardContentPolicy(template.slug)!.nameCharacters).toBe(MAX_CARD_NAME_CHARACTERS);
      expect(getCardContentPolicy(template.slug)!.messageCharacters).toBe(MAX_CARD_MESSAGE_CHARACTERS);
    }
    expect(MAX_CARD_MESSAGE_CHARACTERS).toBe(600);
    expect(getCardContentPolicy("little-sunshine")!.recommendedMessageCharacters)
      .toBeGreaterThan(getCardContentPolicy("same-sky")!.recommendedMessageCharacters);
    expect(getCardContentPolicy("same-sky")!.recommendedMessageCharacters)
      .toBeGreaterThan(getCardContentPolicy("make-a-wish")!.recommendedMessageCharacters);
    expect(getCardContentPolicy("missing")).toBeNull();
  });
  it("counts emoji and non-Latin text as code points", () => {
    expect(characterCount("A🙂喜")).toBe(3);
  });
});
