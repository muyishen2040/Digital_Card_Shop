import type { Metadata } from "next";
import { Frame } from "./Frame";
export const metadata: Metadata = { title: "Card preview", robots: { index: false, follow: false, noarchive: true } };
export default function PreviewPage() { return <Frame />; }
