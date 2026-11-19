import type { CardPersonalization } from "@/types/card";

/** Public sample content; private recipient content will come from a card instance. */
export const SKY_DEMO: Readonly<CardPersonalization> = {
  recipientName: "Jamie",
  senderName: "Taylor",
  message:
    "Even when we're far apart, we're looking up at the same sky. I hope you know how often I think of you. Until we see each other again, there's always a little piece of home in every star.",
};
