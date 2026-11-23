import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { birthdayArtSlugs } from "@/lib/cards/birthday/designs";
import { BirthdayArtCard, birthdaySceneMarkup, escapeCardHtml } from "./BirthdayArtCard";

const content = {
  recipientName: "Jamie",
  senderName: "Taylor",
  message: "Here's to another trip around the sun.\nHappy birthday!",
};

describe("Signature birthday recipient cards", () => {
  it.each(birthdayArtSlugs)("%s renders its own accessible interaction with live personal text", (design) => {
    const html = renderToStaticMarkup(createElement(BirthdayArtCard, { design, content }));
    expect(html).toContain("Jamie");
    expect(html).toContain("Taylor");
    expect(html).toContain("another trip around the sun");
    expect(html).toContain("data-card-text-region");
    expect(html).toContain("data-action");
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain("<script");
    expect(html).not.toContain("Checkout");
    expect(html).not.toContain("Read note");
  });

  it("escapes sender-controlled markup before mixing it with reviewed artwork", () => {
    const message = '<img src=x onerror="alert(1)"> & birthday';
    expect(escapeCardHtml(message)).toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; birthday');
    for (const design of birthdayArtSlugs) {
      const html = birthdaySceneMarkup(design, {
        recipientName: '<svg onload="alert(1)">',
        senderName: 'A&B',
        message,
      });
      expect(html).not.toContain("<img src=x");
      expect(html).not.toContain('<svg onload="alert(1)">');
      expect(html).toContain("&lt;img");
      expect(html).toContain("A&amp;B");
      expect(html).toContain("data-card-text-region");
    }
  });

  it.each(birthdayArtSlugs)("%s keeps selectable, scrollable HTML notes with the saved text size", (design) => {
    for (const [textSize, scale] of [["small", .6], ["medium", .8], ["large", 1]] as const) {
      const markup = birthdaySceneMarkup(design, { ...content, textSize });
      expect(markup).toContain('style="--card-text-scale:' + scale + '"');
      expect(markup).toContain('inert');
      expect(markup).toContain("data-card-text-region");
      expect(markup).toContain("data-message");
    }
  });
});
