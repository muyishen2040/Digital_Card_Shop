import { describe, expect, it } from "vitest";
import { measureCardTextFit } from "./content-fit";

function mockRoot(area?: { clientHeight: number; scrollHeight: number; clientWidth: number; scrollWidth: number }) {
  return {
    querySelector: () => area ?? null,
  } as unknown as Element;
}

describe("layout-based message fitting", () => {
  it("accepts a card when the rendered content fits", () => {
    expect(measureCardTextFit(mockRoot({ clientHeight: 210, scrollHeight: 210, clientWidth: 190, scrollWidth: 190 })))
      .toEqual({ status: "fits", excessHeightPx: 0, excessWidthPx: 0 });
  });
  it("detects vertical and horizontal overflow", () => {
    expect(measureCardTextFit(mockRoot({ clientHeight: 210, scrollHeight: 245, clientWidth: 190, scrollWidth: 202 })))
      .toEqual({ status: "overflows", excessHeightPx: 33, excessWidthPx: 10 });
  });
  it("ignores fractional-height noise and reports hidden/unavailable regions", () => {
    expect(measureCardTextFit(mockRoot({ clientHeight: 210, scrollHeight: 211, clientWidth: 190, scrollWidth: 190 })).status)
      .toBe("fits");
    expect(measureCardTextFit(mockRoot({ clientHeight: 0, scrollHeight: 250, clientWidth: 190, scrollWidth: 190 })).status)
      .toBe("unmeasurable");
    expect(measureCardTextFit(mockRoot())).toEqual({ status: "unmeasurable" });
  });
});
