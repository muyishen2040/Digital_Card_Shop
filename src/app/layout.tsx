import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Fraunces, Italiana, Lora, Pinyon_Script } from "next/font/google";
import "./globals.css";

const sunshineDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-sunshine-display",
  display: "swap",
});

const sunshineReading = Lora({
  subsets: ["latin"],
  variable: "--font-sunshine-reading",
  display: "swap",
});

const skyDisplay = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sky-display",
  display: "swap",
});

const skyBody = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sky-body",
  display: "swap",
});

const wishDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-wish-display",
  display: "swap",
});

const postcardScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-postcard-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "little moments — interactive greeting cards",
  description: "An evolving collection of thoughtful, interactive greeting cards.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sunshineDisplay.variable} ${sunshineReading.variable} ${skyDisplay.variable} ${skyBody.variable} ${wishDisplay.variable} ${postcardScript.variable}`}>
        {children}
      </body>
    </html>
  );
}
