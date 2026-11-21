import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityPostcard } from "@/components/cards/postcard/CityPostcard";
import { postcardFixtureContent } from "@/components/cards/postcard/fixture";
import { TAIPEI_DEMO, taipeiPostcardDesign } from "@/lib/cards/postcards/taipei";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Taipei postcard preview",
  robots: { index: false, follow: false },
};

export default async function TaipeiPreview({
  searchParams,
}: {
  searchParams: Promise<{ note?: string | string[] }>;
}) {
  if (process.env.NODE_ENV !== "development" && process.env.VERCEL_ENV !== "preview") {
    notFound();
  }
  const { note } = await searchParams;
  const content = note === "long" || note === "unicode" ? postcardFixtureContent(note) : TAIPEI_DEMO;
  return <CityPostcard design={taipeiPostcardDesign} content={content} />;
}
