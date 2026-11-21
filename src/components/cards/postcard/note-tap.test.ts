import { describe, expect, it } from "vitest";
import { isPostcardNoteTap } from "./note-tap";

const start = { x: 100, y: 100, scrollTop: 0 };

describe("postcard note turn-back", () => {
  it("allows ordinary taps and small pointer jitter", () => {
    expect(isPostcardNoteTap(start, { ...start }, false)).toBe(true);
    expect(isPostcardNoteTap(start, { ...start, x: 103, y: 104 }, false)).toBe(true);
  });

  it("does not turn when the recipient selects text", () => {
    expect(isPostcardNoteTap(start, start, true)).toBe(false);
  });

  it("does not turn after a drag or scroll", () => {
    expect(isPostcardNoteTap(start, { ...start, y: 130 }, false)).toBe(false);
    expect(isPostcardNoteTap(start, { ...start, scrollTop: 100 }, false)).toBe(false);
  });
});
