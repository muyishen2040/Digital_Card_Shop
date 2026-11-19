/** The four bright stars make one constellation; selection order determines its path. */
export const CONSTELLATION_STAR_COUNT = 4;

export function lightStar(
  selected: readonly number[],
  starIndex: number,
  starCount = CONSTELLATION_STAR_COUNT,
): number[] {
  if (
    !Number.isInteger(starIndex) ||
    starIndex < 0 ||
    starIndex >= starCount ||
    selected.includes(starIndex) ||
    selected.length >= starCount
  ) {
    return [...selected];
  }
  return [...selected, starIndex];
}

export function isConstellationComplete(
  selected: readonly number[],
  starCount = CONSTELLATION_STAR_COUNT,
): boolean {
  return selected.length === starCount;
}
