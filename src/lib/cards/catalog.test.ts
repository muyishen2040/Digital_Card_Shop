import { describe, expect, it } from "vitest";
import { cardTemplates, getCardTemplate } from "./catalog";

describe("card template catalog", () => {
  it("exposes three distinct, addressable concepts", () => {
    expect(cardTemplates).toHaveLength(3);
    expect(new Set(cardTemplates.map((template) => template.slug)).size).toBe(3);
    expect(new Set(cardTemplates.map((template) => template.theme)).size).toBe(3);
  });

  it("returns the corresponding template for a known slug", () => {
    expect(getCardTemplate("same-sky")?.title).toBe("Under the Same Sky");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getCardTemplate("missing")).toBeUndefined();
  });
});
