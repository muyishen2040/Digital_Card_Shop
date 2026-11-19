import Link from "next/link";
import { notFound } from "next/navigation";
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

  return (
    <main className="concept-page">
      <div className="concept-page-inner">
        <Link className="back-link" href="/#gallery">← All concepts</Link>
        <div className={"concept-art concept-art--" + template.theme}>
          <span className="concept-glyph" aria-hidden="true">
            {template.theme === "sunshine" ? "✉" : template.theme === "night-sky" ? "✦" : "✿"}
          </span>
          <span className="concept-status">Interactive prototype coming next</span>
        </div>
        <span className="section-kicker">{template.category.toUpperCase()}</span>
        <h1>{template.title}</h1>
        <p>{template.description}</p>
        <p className="concept-note">
          This is a placeholder route, not a sendable e-card. We&apos;ll design the interactions
          using Superpowers brainstorming before implementing them.
        </p>
      </div>
    </main>
  );
}
