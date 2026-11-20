import type { Metadata } from "next";
import { SenderEditor } from "./SenderEditor";
export const metadata: Metadata = {
  title: "Create a little moment",
  description: "Personalize an interactive greeting card and preview it before sharing.",
};
export default function CreatePage() { return <SenderEditor />; }
