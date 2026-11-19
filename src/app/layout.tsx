import type { Metadata } from "next";
import { Cormorant_Garamond, Lora } from "next/font/google";
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

export const metadata: Metadata = {
  title: "little moments — interactive greeting cards",
  description: "An evolving collection of thoughtful, interactive greeting cards.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sunshineDisplay.variable} ${sunshineReading.variable}`}>
        {children}
      </body>
    </html>
  );
}
