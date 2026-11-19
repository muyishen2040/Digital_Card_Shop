export type CardTheme = "sunshine" | "night-sky" | "birthday";

export interface CardTemplate {
  slug: string;
  title: string;
  category: string;
  description: string;
  theme: CardTheme;
}

export interface CardPersonalization {
  recipientName: string;
  senderName: string;
  message: string;
  imageUrl?: string;
}
