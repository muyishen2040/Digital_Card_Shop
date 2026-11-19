import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SunshineCard } from "./SunshineCard";

describe("A Little Sunshine interaction controls", () => {
  it("uses the envelope and folded paper corner as the two physical controls", () => {
    const html = renderToStaticMarkup(
      createElement(SunshineCard, {
        content: {
          recipientName: "Alex",
          senderName: "Sam",
          message: "A little note for you.",
        },
      }),
    );

    expect(html).toContain('aria-label="Open the envelope for Alex"');
    expect(html).toContain('aria-label="Fold the letter back into the envelope"');
    expect(html).not.toContain("Close the letter and replay");
    expect(html).not.toContain('title="Replay"');
    expect(html.match(/<button\b/g)).toHaveLength(2);
  });
});
