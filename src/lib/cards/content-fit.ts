/**
 * Measure the actual rendered reading area after layout and font loading.
 * Callers should await document.fonts.ready and recheck after resizing,
 * personalized-text edits, or layout changes.
 *
 * This is a UI fit check, not a security boundary; server limits remain
 * independent, and the card reading region must retain scrolling as fallback.
 */
export type CardTextFitResult =
  | { status: "unmeasurable" }
  | { status: "fits" | "overflows"; excessHeightPx: number; excessWidthPx: number };

export function measureCardTextFit(root: Element): CardTextFitResult {
  const readingArea = root.querySelector<HTMLElement>("[data-card-text-region]");
  if (!readingArea || readingArea.clientWidth <= 0 || readingArea.clientHeight <= 0) {
    return { status: "unmeasurable" };
  }
  // A 2px tolerance avoids false positives from fractional layout rounding.
  const excessHeightPx = Math.max(0, readingArea.scrollHeight - readingArea.clientHeight - 2);
  const excessWidthPx = Math.max(0, readingArea.scrollWidth - readingArea.clientWidth - 2);
  return {
    status: excessHeightPx > 0 || excessWidthPx > 0 ? "overflows" : "fits",
    excessHeightPx,
    excessWidthPx,
  };
}
