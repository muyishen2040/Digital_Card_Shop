import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Card Shop — tiny moments, beautifully sent",
  description: "An experiment in interactive, personalized digital greeting cards.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
