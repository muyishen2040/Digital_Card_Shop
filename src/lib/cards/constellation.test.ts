import { describe, expect, it } from "vitest";
import {
  CONSTELLATION_STAR_COUNT,
  isConstellationComplete,
  lightStar,
} from "./constellation";

describe("Under the Same Sky constellation interaction", () => {
  it("builds a connection path in the order the recipient selects stars", () => {
    const first = lightStar([], 2);
    const second = lightStar(first, 0);
    const third = lightStar(second, 3);
    expect(third).toEqual([2, 0, 3]);
    expect(first).toEqual([2]);
    expect(isConstellationComplete(third)).toBe(false);
    expect(isConstellationComplete(lightStar(third, 1))).toBe(true);
  });

  it("ignores duplicates and out-of-range input without changing prior selections", () => {
    const initial = [0, 2];
    expect(lightStar(initial, 0)).toEqual(initial);
    expect(lightStar(initial, -1)).toEqual(initial);
    expect(lightStar(initial, CONSTELLATION_STAR_COUNT)).toEqual(initial);
    expect(lightStar(initial, 1.5)).toEqual(initial);
    expect(initial).toEqual([0, 2]);
  });

  it("does not allow additional stars after the constellation is complete", () => {
    expect(lightStar([0, 1, 2, 3], 1)).toEqual([0, 1, 2, 3]);
    expect(isConstellationComplete([])).toBe(false);
  });
});
