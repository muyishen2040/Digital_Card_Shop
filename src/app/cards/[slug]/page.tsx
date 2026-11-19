import Link from "next/link";
import { notFound } from "next/navigation";
import { SunshineCard } from "@/components/cards/sunshine/SunshineCard";
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

  if (slug === "little-sunshine") {
    return (
      <main className="recipient-page">
        <div className="recipient-shell">
          <div className="recipient-header">
            <Link className="back-link" href="/#gallery">← All cards</Link>
            <span>AN INTERACTIVE CARD · DEMO</span>
          </div>
          <SunshineCard content={{ ...SUNSHINE_DEMO }} />
          <div className="recipient-under">
            <p>Previewing a sample message. No card has been sent.</p>
            <Link href="/create/little-sunshine">
              Make this card yours <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="concept-page">
      <div className="concept-page-inner">
        <Link className="back-link" href="/#gallery">← All concepts</Link>
        <div className={"concept-art concept-art--" + template.theme}>
          <span className="concept-glyph" aria-hidden="true">
            {template.theme === "night-sky" ? "✦" : "✿"}
          </span>
          <span className="concept-status">Interactive prototype coming next</span>
        </div>
        <span className="section-kicker">{template.category.toUpperCase()}</span>
        <h1>{template.title}</h1>
        <p>{template.description}</p>
        <p className="concept-note">
          This is a placeholder route, not a sendable e-card.
          We&apos;ll design this experience in a future phase.
        </p>
      </div>
    </main>
  );
}
