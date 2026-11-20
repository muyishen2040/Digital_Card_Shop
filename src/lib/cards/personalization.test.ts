import { describe, expect, it } from "vitest";
import {
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  SUNSHINE_DEMO,
  toPreviewContent,
} from "./personalization";

describe("Sunshine preview personalization", () => {
  it("normalizes names and preserves intentional message line breaks", () => {
    const result = toPreviewContent({
      recipientName: "  Jamie   Lee  ",
      senderName: "  Sam   ",
      message: " Hello,\r\n\r\nMiss you!  ",
    });

    expect(result.recipientName).toBe("Jamie Lee");
    expect(result.senderName).toBe("Sam");
    expect(result.message).toBe("Hello,\n\nMiss you!");
  });

  it("uses readable fallbacks when the editor fields are empty", () => {
    expect(toPreviewContent({
      recipientName: " ",
      senderName: "",
      message: "\n",
    })).toEqual({
      recipientName: "friend",
      senderName: "someone thinking of you",
      message: "A little note to brighten your day.",
    });
  });

  it("bounds very long input without mutating the original", () => {
    const data = {recipientName: "a".repeat(100), senderName: "b".repeat(100), message: "c".repeat(1000)};
    const result = toPreviewContent(data);

    expect(result.recipientName).toHaveLength(MAX_NAME_LENGTH);
    expect(result.senderName).toHaveLength(MAX_NAME_LENGTH);
    expect(result.message).toHaveLength(MAX_MESSAGE_LENGTH);
    expect(data.message).toHaveLength(1000);
  });

  it("keeps Unicode code points intact for valid messages and names", () => {
    const result = toPreviewContent({
      recipientName: "🎈".repeat(40), senderName: "Ava",
      message: "🙂".repeat(600),
    });
    expect(result.recipientName).toBe("🎈".repeat(40));
    expect(result.message).toBe("🙂".repeat(600));
  });

  it("supplies a usable demo that is shorter than the limits", () => {
    const result = toPreviewContent(SUNSHINE_DEMO);
    expect(result.recipientName.length).toBeGreaterThan(0);
    expect(result.senderName.length).toBeGreaterThan(0);
    expect(result.message.length).toBeGreaterThan(10);
  });
});
