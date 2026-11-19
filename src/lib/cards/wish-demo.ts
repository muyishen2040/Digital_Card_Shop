import type { CardPersonalization } from "@/types/card";

/** Public sample content; a card-serving service will provide real recipient data. */
export const WISH_DEMO: Readonly<CardPersonalization> = {
  recipientName: "Morgan",
  senderName: "Riley",
  message:
    "Here's to more ridiculous laughter, unexpected adventures, and all the beautiful things waiting for you this year. Hope today feels as wonderful as you make life for the people around you.",
};
