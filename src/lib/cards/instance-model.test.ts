import { describe, expect, it } from "vitest";
import { expirationFor, isCardAccessible, validateCardDraft } from "./instance-model";

const base = {
  templateSlug: "same-sky",
  recipientName: "  Jamie   Lee  ",
  senderName: " Taylor ",
  message: " Hello,\r\n\r\nSee you soon!  ",
} as const;

describe("stored card instances", () => {
  it("normalizes the fields without discarding intentional line breaks", () => {
    expect(validateCardDraft({ ...base })).toEqual({
      templateSlug: "same-sky",
      recipientName: "Jamie Lee",
      senderName: "Taylor",
      message: "Hello,\n\nSee you soon!",
      ttlHours: 48,
    });
  });
  it("rejects invalid designs and empty, oversized or missing user fields", () => {
    expect(() => validateCardDraft({ ...base, templateSlug: "not-a-card" })).toThrow("valid card");
    expect(() => validateCardDraft({ ...base, recipientName: " " })).toThrow("Recipient name");
    expect(() => validateCardDraft({ ...base, senderName: "x".repeat(25) })).toThrow("Sender name");
    expect(() => validateCardDraft({ ...base, message: " " })).toThrow("Message");
    expect(() => validateCardDraft({ ...base, message: "a".repeat(141) })).toThrow("140 characters");
    expect(() => validateCardDraft({ ...base, ttlHours: 999 as 48 })).toThrow("24, 48, or 72");
  });
  it("enforces the independent layouts' bounds and counts Unicode correctly", () => {
    expect(validateCardDraft({ ...base, templateSlug: "little-sunshine", message: "a".repeat(240) }).message).toHaveLength(240);
    expect(() => validateCardDraft({ ...base, templateSlug: "little-sunshine", message: "a".repeat(241) })).toThrow("240");
    expect(validateCardDraft({ ...base, templateSlug: "make-a-wish", message: "🙂".repeat(100) }).message).toBe("🙂".repeat(100));
    expect(() => validateCardDraft({ ...base, templateSlug: "make-a-wish", message: "🙂".repeat(101) })).toThrow("100");
    expect(() => validateCardDraft({ ...base, templateSlug: "make-a-wish", recipientName: "A".repeat(25) })).toThrow("24");
  });

  it("calculates a bounded access window with an exclusive expiration boundary", () => {
    const now = new Date("2026-11-19T20:00:00Z");
    const expires = expirationFor(now, 24);
    expect(expires).toBe("2026-11-20T20:00:00.000Z");
    expect(isCardAccessible(now.toISOString(), expires, now)).toBe(true);
    expect(isCardAccessible(now.toISOString(), expires, new Date(expires))).toBe(false);
    expect(isCardAccessible(now.toISOString(), expires, new Date(now.getTime() - 1000))).toBe(false);
    expect(isCardAccessible("invalid", expires, now)).toBe(false);
  });
});
