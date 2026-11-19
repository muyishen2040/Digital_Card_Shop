import Link from "next/link";
import { notFound } from "next/navigation";
import { SunshineCard } from "@/components/cards/sunshine/SunshineCard";
import { SkyCard } from "@/components/cards/sky/SkyCard";
import { WishCard } from "@/components/cards/wish/WishCard";
import { WISH_DEMO } from "@/lib/cards/wish-demo";
import { SKY_DEMO } from "@/lib/cards/sky-demo";
import { SUNSHINE_DEMO } from "@/lib/cards/personalization";
import { cardTemplates, getCardTemplate } from "@/lib/cards/catalog";

export function generateStaticParams() {
  return cardTemplates.map(({ slug }) => ({ slug }));
}

export default async function CardConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getCardTemplate(slug);
  if (!template) notFound();

  // Recipient experience: no store, banners, instructional text, or demo chrome.
  if (slug === "little-sunshine") {
    return <SunshineCard content={SUNSHINE_DEMO} />;
  }
  if (slug === "same-sky") {
    return <SkyCard content={SKY_DEMO} />;
  }
  if (slug === "make-a-wish") {
    return <WishCard content={WISH_DEMO} />;
  }

  return (
    <main className="concept-page">
      <div className="concept-page-inner">
        <Link className="back-link" href="/">← Experiences</Link>
        <div className={"concept-art concept-art--" + template.theme}>
          <span className="concept-glyph" aria-hidden="true">
            {template.theme === "night-sky" ? "✦" : "✿"}
          </span>
          <span className="concept-status">In development</span>
        </div>
        <h1>{template.title}</h1>
        <p>{template.description}</p>
      </div>
    </main>
  );
}
