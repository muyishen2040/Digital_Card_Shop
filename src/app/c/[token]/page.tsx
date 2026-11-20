import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { renderRecipientCard } from "@/components/cards/RecipientCard";
import { hashCardToken } from "@/server/cards/card-token";
import { findActiveCardByToken } from "@/server/cards/card-instances";

// Bearer-token routes must never be statically generated, ISR-cached, or indexed.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "A little moment for you",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function PrivateRecipientCardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Fail closed. Missing configuration is not a reason to show private demo text.
  // No secret or token values should appear in logs or error messages.
  if (!hashCardToken(token) || !process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    notFound();
  }

  const card = await findActiveCardByToken(token);
  if (!card) notFound();

  const experience = renderRecipientCard(card.templateSlug, {
    recipientName: card.recipientName,
    senderName: card.senderName,
    message: card.message,
  });
  if (!experience) notFound();
  return experience;
}
