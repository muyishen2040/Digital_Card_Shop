import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SkyCard } from "./SkyCard";

describe("Under the Same Sky recipient card", () => {
  it("renders an intuitive folded cover and separate fold-back corner", () => {
    const html = renderToStaticMarkup(
      createElement(SkyCard, {
        content: { recipientName: "Jamie", senderName: "Taylor", message: "We share the same sky." },
      }),
    );

    expect(html).toContain('aria-label="Unfold the night-sky card"');
    expect(html).toContain('aria-label="Fold the night-sky card closed"');
    expect(html).toContain("For Jamie");
    expect(html).toContain("We share the same sky.");
    expect(html).toContain("— Taylor");
    expect(html).not.toContain("Illuminate western star");
    expect(html).not.toContain("constellation complete");
    expect(html).not.toContain("Read note");
    expect(html).not.toContain("Full card");
    expect(html.match(/<button\b/g)).toHaveLength(2);
  });
});
