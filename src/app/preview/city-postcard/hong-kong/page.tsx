import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityPostcard } from "@/components/cards/postcard/CityPostcard";
import { postcardFixtureContent } from "@/components/cards/postcard/fixture";
import { HONG_KONG_DEMO, hongKongPostcardDesign } from "@/lib/cards/postcards/hong-kong";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Hong Kong postcard preview",
  robots: { index: false, follow: false },
};

export default async function HongKongPreview({
  searchParams,
}: {
  searchParams: Promise<{ note?: string | string[] }>;
}) {
  if (process.env.NODE_ENV !== "development" && process.env.VERCEL_ENV !== "preview") {
    notFound();
  }
  const { note } = await searchParams;
  const content = note === "long" || note === "unicode"
    ? postcardFixtureContent(note)
    : HONG_KONG_DEMO;
  return <CityPostcard design={hongKongPostcardDesign} content={content} />;
}
