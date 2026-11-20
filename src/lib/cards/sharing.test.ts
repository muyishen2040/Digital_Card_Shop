import { describe, expect, it } from "vitest";
import { cardShareData } from "./sharing";

const url = "https://digital-card-shop.vercel.app/c/" + "a".repeat(43);
describe("private card sharing", () => {
  it("creates minimal share metadata without a user's personal message", () => {
    expect(cardShareData(url)).toEqual({
      title: "A little moment for you",
      text: "Someone made a little moment just for you.",
      url,
    });
  });
  it("rejects invalid, non-card, or parameter-bearing URLs", () => {
    for (const bad of [
      "not a link", "http://example.com/c/" + "a".repeat(43),
      "https://example.com/create", url + "?message=private", url + "#fragment",
      "https://user:password@example.com/c/" + "a".repeat(43),
      "https://example.com/c/short",
    ]) {
      expect(() => cardShareData(bad)).toThrow();
    }
  });
  it("permits localhost for secure-context development only", () => {
    expect(cardShareData("http://localhost:3000/c/" + "A".repeat(43)).url).toContain("localhost:3000");
  });
});
