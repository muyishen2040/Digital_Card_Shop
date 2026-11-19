import type { Metadata } from "next";
import { SunshineStudio } from "@/components/editor/SunshineStudio";

export const metadata: Metadata = {
  title: "Personalize A Little Sunshine — little moments",
  description: "Write a little note and preview an interactive envelope card.",
};

export default function SunshineCreatePage() {
  return <SunshineStudio />;
}
