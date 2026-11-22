import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { renderRecipientCard } from "./RecipientCard";
import { cityPostcardManifests } from "@/lib/cards/postcards/destinations";

const content = {
  recipientName: "Recipient",
  senderName: "Sender",
  message: "A private note for you.",
};

describe("private recipient card rendering", () => {
  it.each([
    ["little-sunshine", "Open the envelope for"],
    ["same-sky", "Unfold the night-sky card"],
    ["make-a-wish", "Blow out the birthday candle"],
    ...cityPostcardManifests.map(({ slug }) => [slug, "Turn postcard over to read the message"] as const),
  ])("reuses %s without adding shop UI", (slug, controlLabel) => {
    const card = renderRecipientCard(slug, content);
    expect(card).not.toBeNull();
    const html = renderToStaticMarkup(card!);
    expect(html).toContain(controlLabel);
    expect(html).toContain("A private note for you.");
    expect(html).toContain("Recipient");
    expect(html).toContain("Sender");
    expect(html).not.toContain("Checkout");
  });

  it("uses the approved postcard assets and keeps the personal note as HTML", () => {
    const card = renderRecipientCard("city-postcard-hong-kong", content);
    const html = renderToStaticMarkup(card!);
    expect(html).toContain("/cards/city-postcards/hong-kong/front.webp");
    expect(html).toContain("/cards/city-postcards/hong-kong/back.webp");
    expect(html).toContain("Dear Recipient,");
    expect(html).toContain("A private note for you.");
    expect(html).toContain("— Sender");
  });

  it("renders Taipei artwork without duplicating the city title or using Hong Kong artwork", () => {
    const html = renderToStaticMarkup(renderRecipientCard("city-postcard-taipei", content)!);
    expect(html).toContain("/cards/city-postcards/taipei/front.webp");
    expect(html).toContain("/cards/city-postcards/taipei/back.webp");
    expect(html).not.toContain("/cards/city-postcards/hong-kong/");
    expect(html).toContain("Taipei city postcard");
    expect(html).toContain("Dear Recipient,");
  });

  it.each(cityPostcardManifests)(
    "renders $slug as a private HTML postcard with its own images",
    ({ slug, postcard }) => {
      const html = renderToStaticMarkup(renderRecipientCard(slug, content)!);
      expect(html).toContain(postcard.frontImage);
      expect(html).toContain(postcard.backImage);
      expect(html).toContain("Dear Recipient,");
      expect(html).toContain("— Sender");
      expect(html).toContain("A private note for you.");
      expect(html).not.toContain("Checkout");
    },
  );

  it.each(["little-sunshine", "same-sky", "make-a-wish",
    ...cityPostcardManifests.map((destination) => destination.slug)])(
    "applies each text size to the reading region of %s",
    (slug) => {
      for (const [textSize, scale] of [["small", 0.6], ["medium", 0.8], ["large", 1]] as const) {
        const html = renderToStaticMarkup(renderRecipientCard(slug, { ...content, textSize })!);
        expect(html).toContain('style="--card-text-scale:' + scale + '"');
      }
      const legacy = renderToStaticMarkup(renderRecipientCard(slug, content)!);
      expect(legacy).toContain('style="--card-text-scale:1"');
    },
  );

  it("does not render unknown or removed card templates", () => {
    expect(renderRecipientCard("unknown-template", content)).toBeNull();
  });
});
