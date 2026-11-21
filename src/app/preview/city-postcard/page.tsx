import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityPostcard } from "@/components/cards/postcard/CityPostcard";
import { postcardFixture, postcardFixtureContent } from "@/components/cards/postcard/fixture";

// The neutral fixture is reviewable in local development and Vercel previews.
// It is not a product card, and must not be reachable in production.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "City postcard component preview",
  robots: { index: false, follow: false },
};

export default async function PostcardPreview({
  searchParams,
}: {
  searchParams: Promise<{ note?: string | string[] }>;
}) {
  if (process.env.NODE_ENV !== "development" && process.env.VERCEL_ENV !== "preview") {
    notFound();
  }
  const { note } = await searchParams;
  return (
    <CityPostcard
      design={postcardFixture}
      content={postcardFixtureContent(typeof note === "string" ? note : "short")}
    />
  );
}
