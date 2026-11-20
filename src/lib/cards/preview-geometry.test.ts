import { describe, expect, it } from "vitest";
import { fitPreviewToPanel } from "./preview-geometry";

describe("responsive sender preview sizing", () => {
  it.each([320, 390, 768])("never clips a %spx card on a narrow preview column", (width) => {
    const widthAvailable = 284;
    const result = fitPreviewToPanel({ width, height: 844 }, widthAvailable);
    expect(result.width).toBeLessThanOrEqual(widthAvailable);
    expect(result.scale).toBeGreaterThan(0);
    expect(result.scale).toBeLessThan(1);
  });
  it("retains the exact iframe viewport when there's enough space", () => {
    expect(fitPreviewToPanel({ width: 390, height: 844 }, 900))
      .toEqual({ scale: 1, width: 398, height: 852 });
  });
  it("keeps dimensions proportional and valid across sizes", () => {
    const result = fitPreviewToPanel({ width: 320, height: 568 }, 200);
    expect(result.width).toBeCloseTo(200);
    expect(result.height).toBeCloseTo((576 * 200) / 328);
  });
});
