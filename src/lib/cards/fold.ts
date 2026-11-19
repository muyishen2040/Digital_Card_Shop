export type FoldPhase = "closed" | "opening" | "open" | "closing";

/** Only stable phases accept input; animations cannot be interrupted by repeated taps. */
export function toggleFold(phase: FoldPhase, reducedMotion: boolean): FoldPhase {
  if (phase === "closed") return reducedMotion ? "open" : "opening";
  if (phase === "open") return reducedMotion ? "closed" : "closing";
  return phase;
}

/** The completed paper turn settles into a stable interactive state. */
export function finishFold(phase: FoldPhase): FoldPhase {
  if (phase === "opening") return "open";
  if (phase === "closing") return "closed";
  return phase;
}
