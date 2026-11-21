import { describe, expect, it } from "vitest";
import { cardTemplates } from "./catalog";
import { expirationFor, isCardAccessible, validateCardDraft } from "./instance-model";

const base = {
  templateSlug: "same-sky",
  recipientName: "  Jamie   Lee  ",
  senderName: " Taylor ",
  message: " Hello,\r\n\r\nSee you soon!  ",
} as const;

describe("stored card instances", () => {
  it("normalizes fields while retaining intentional line breaks", () => {
    expect(validateCardDraft({ ...base })).toEqual({
      templateSlug: "same-sky",
      recipientName: "Jamie Lee",
      senderName: "Taylor",
      message: "Hello,\n\nSee you soon!",
      ttlHours: 48,
    });
  });
  it("rejects missing, invalid, oversized and out-of-policy data", () => {
    expect(() => validateCardDraft({ ...base, templateSlug: "unknown" })).toThrow("valid card");
    expect(() => validateCardDraft({ ...base, recipientName: " " })).toThrow("Recipient name");
    expect(() => validateCardDraft({ ...base, senderName: "x".repeat(41) })).toThrow("Sender name");
    expect(() => validateCardDraft({ ...base, message: " " })).toThrow("Message");
    expect(() => validateCardDraft({ ...base, message: "a".repeat(601) })).toThrow("600");
    expect(() => validateCardDraft({ ...base, ttlHours: 999 as 48 })).toThrow("24, 48, or 72");
  });
  it("permits longer scrolling messages equally for every published template", () => {
    for (const { slug } of cardTemplates) {
      expect(validateCardDraft({ ...base, templateSlug: slug, message: "x".repeat(600) }).message)
        .toHaveLength(600);
      expect(validateCardDraft({ ...base, templateSlug: slug, senderName: "s".repeat(40) }).senderName)
        .toHaveLength(40);
    }
    expect(validateCardDraft({ ...base, templateSlug: "make-a-wish", message: "🙂".repeat(600) }).message)
      .toBe("🙂".repeat(600));
    expect(() => validateCardDraft({ ...base, message: "🙂".repeat(601) })).toThrow("600");
  });
  it("enforces inclusive start and exclusive expiration boundaries", () => {
    const now = new Date("2026-11-19T20:00:00Z");
    const expiry = expirationFor(now, 24);
    expect(expiry).toBe("2026-11-20T20:00:00.000Z");
    expect(isCardAccessible(now.toISOString(), expiry, now)).toBe(true);
    expect(isCardAccessible(now.toISOString(), expiry, new Date(expiry))).toBe(false);
    expect(isCardAccessible(now.toISOString(), expiry, new Date(now.getTime() - 1000))).toBe(false);
    expect(isCardAccessible("invalid", expiry, now)).toBe(false);
  });
});
