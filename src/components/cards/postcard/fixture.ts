import type { CityPostcardDesign } from "./CityPostcard";
import type { CardPersonalization } from "@/types/card";

/** Neutral QA artwork; not a catalog template or approved destination. */
export const postcardFixture: CityPostcardDesign = {
  city: "Sample City",
  frontImage: "/fixtures/city-postcard/front.svg",
  backImage: "/fixtures/city-postcard/back.svg",
  frontAlt: "A geometric landscape above a small illustrated hillside.",
  backAlt: "A small row of houses near the bottom of warm paper.",
  sceneCaption: "A quiet afternoon",
};

export function postcardFixtureContent(variant: string): CardPersonalization {
  if (variant === "long") {
    const paragraph = "Here is a little reminder of a peaceful afternoon. I hope the days ahead bring you small joys, good company, and time to notice the beautiful things around you.\n\n";
    return {
      recipientName: "R".repeat(40),
      senderName: "S".repeat(40),
      message: Array.from(paragraph.repeat(5)).slice(0, 600).join("").trimEnd().padEnd(600, "."),
    };
  }
  if (variant === "unicode") {
    return {
      recipientName: "小明",
      senderName: "你的朋友",
      message: "走在陌生的街道，突然想到你。\n願你每天都能遇見一些美好的小事。\n\nA little hello from far away. ✨",
    };
  }
  return {
    recipientName: "Friend",
    senderName: "A friend",
    message: "Wish you were here.\nA little moment to share with you.",
  };
}
