import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "little moments — interactive greeting cards",
  description: "An evolving collection of thoughtful, interactive greeting cards.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
