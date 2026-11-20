import { describe, expect, it } from "vitest";
import { PUBLIC_RECIPIENT_ORIGIN, recipientCardUrl } from "./recipient-link";

const privatePath = "/c/" + "a".repeat(43);

describe("public recipient link generation", () => {
  it("uses the public recipient domain for cards created from protected previews", () => {
    expect(recipientCardUrl(privatePath)).toBe(
      "https://digital-card-shop.vercel.app" + privatePath,
    );
    expect(PUBLIC_RECIPIENT_ORIGIN).toBe("https://digital-card-shop.vercel.app");
  });

  it("rejects non-private paths, malformed tokens, external hosts and query strings", () => {
    for (const path of [
      "", "/", "/create", "/c/short", "/c/" + "a".repeat(42),
      "/c/" + "a".repeat(44), "/c/" + "a".repeat(43) + "?src=preview",
      "/c/" + "a".repeat(43) + "#notes", "//attacker.test/c/" + "a".repeat(43),
      "https://attacker.test/c/" + "a".repeat(43), "/c/../../create",
    ]) {
      expect(() => recipientCardUrl(path)).toThrow("Unexpected private recipient path.");
    }
  });
});
