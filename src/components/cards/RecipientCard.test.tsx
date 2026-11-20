import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { renderRecipientCard } from "./RecipientCard";

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

  it("does not render unknown or removed card templates", () => {
    expect(renderRecipientCard("unknown-template", content)).toBeNull();
  });
});
