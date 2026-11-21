export interface NotePointer {
  x: number;
  y: number;
  scrollTop: number;
}

/** A brief stationary pointer activation is distinct from reading gestures. */
export function isPostcardNoteTap(
  start: NotePointer,
  end: NotePointer,
  hasSelection: boolean,
): boolean {
  return !hasSelection &&
    Math.hypot(end.x - start.x, end.y - start.y) <= 8 &&
    Math.abs(end.scrollTop - start.scrollTop) <= 1;
}
