import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CityPostcard } from "./CityPostcard";
import type { CityPostcardDesign } from "./CityPostcard";
import { postcardFixture, postcardFixtureContent } from "./fixture";

function render(design = postcardFixture, content = postcardFixtureContent("short")) {
  return renderToStaticMarkup(createElement(CityPostcard, { design, content }));
}

describe("City Postcard renderer", () => {
  it("renders both supplied faces and separate, accessible controls", () => {
    const html = render();
    expect(html).toContain(postcardFixture.frontImage);
    expect(html).toContain(postcardFixture.backImage);
    expect(html).toContain(postcardFixture.frontAlt);
    expect(html).toContain(postcardFixture.backAlt);
    expect(html).toContain("Greetings from");
    expect(html).toContain(postcardFixture.city);
    expect(html).toContain('aria-label="Turn postcard over to read the message"');
    expect(html).toContain('aria-label="Turn postcard back to the photograph"');
    expect(html).toContain('data-phase="closed"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("inert");
    expect(html).toContain("data-card-text-region");
    expect(html.match(/<button\b/g)).toHaveLength(2);
    expect(html).not.toContain("Checkout");
    expect(html).not.toContain("cornerPaper");
    // The back button is a sibling of the reading region, not a wrapper
    // around selectable text or a nested interactive element.
    expect(html.indexOf('aria-label="Turn postcard back to the photograph"')).toBeLessThan(html.indexOf("data-card-text-region"));
  });

  it("uses destination metadata rather than a fixed city or artwork", () => {
    const alternate: CityPostcardDesign = {
      city: "Another Destination",
      frontImage: "/cards/example/front.webp",
      backImage: "/cards/example/back.webp",
      frontAlt: "A different landscape",
      backAlt: "A quiet street",
      sceneCaption: "A summer afternoon",
    };
    const html = render(alternate);
    expect(html).toContain(alternate.city);
    expect(html).toContain(alternate.frontImage);
    expect(html).toContain(alternate.backImage);
    expect(html).toContain(alternate.sceneCaption);
    expect(html).not.toContain(postcardFixture.frontImage);
    expect(html).not.toContain(postcardFixture.city);
  });

  it("renders personalized names and multiline Unicode text as escaped HTML", () => {
    const html = render(postcardFixture, {
      recipientName: "小明",
      senderName: "朋友",
      message: "想念你。\nWish you were here! <script>alert(1)</script>",
    });
    expect(html).toContain("Dear 小明,");
    expect(html).toContain("— 朋友");
    expect(html).toContain("想念你。\nWish you were here!");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).not.toContain("contenteditable");
  });

  it("keeps the full shared maximum-length note and both names in the reading region", () => {
    const content = postcardFixtureContent("long");
    expect(Array.from(content.message)).toHaveLength(600);
    expect(Array.from(content.recipientName)).toHaveLength(40);
    expect(Array.from(content.senderName)).toHaveLength(40);
    const html = render(postcardFixture, content);
    expect(html).toContain(content.message);
    expect(html).toContain(content.recipientName);
    expect(html).toContain(content.senderName);
  });
});
