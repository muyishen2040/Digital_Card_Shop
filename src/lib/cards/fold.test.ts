import { describe, expect, it } from "vitest";
import { finishFold, toggleFold } from "./fold";

describe("folded night-sky greeting card", () => {
  it("opens, settles, folds back, and settles again", () => {
    const opening = toggleFold("closed", false);
    expect(opening).toBe("opening");
    expect(toggleFold(opening, false)).toBe("opening");
    expect(finishFold(opening)).toBe("open");
    const closing = toggleFold("open", false);
    expect(closing).toBe("closing");
    expect(toggleFold(closing, false)).toBe("closing");
    expect(finishFold(closing)).toBe("closed");
  });
  it("respects reduced-motion preferences", () => {
    expect(toggleFold("closed", true)).toBe("open");
    expect(toggleFold("open", true)).toBe("closed");
  });
  it("does not alter a stable state when a stale transition ends", () => {
    expect(finishFold("closed")).toBe("closed");
    expect(finishFold("open")).toBe("open");
  });
});
