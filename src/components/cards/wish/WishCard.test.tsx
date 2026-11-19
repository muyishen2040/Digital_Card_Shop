import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { WishCard } from "./WishCard";

describe("Make a Wish recipient experience", () => {
  it("renders a native candle interaction and personalized sender note", () => {
    const html = renderToStaticMarkup(
      createElement(WishCard, {
        content: { recipientName: "Morgan", senderName: "Riley", message: "Have an amazing birthday!" },
      }),
    );

    expect(html).toContain('aria-label="Blow out the birthday candle"');
    expect(html).toContain("To Morgan,");
    expect(html).toContain("Have an amazing birthday!");
    expect(html).toContain("— Riley");
    expect(html).not.toContain("Open the envelope");
    expect(html).not.toContain("Checkout");
    expect(html.match(/<button\b/g)).toHaveLength(1);
  });
});
