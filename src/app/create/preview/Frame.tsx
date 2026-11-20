"use client";

import { useEffect, useRef, useState } from "react";
import { renderRecipientCard } from "@/components/cards/RecipientCard";
import { measureCardTextFit } from "@/lib/cards/content-fit";
import type { CardPersonalization } from "@/types/card";

/** Isolated viewport-size renderer: no personalized content in URL or browser storage. */
export function Frame() {
  const [draft, setDraft] = useState({
    revision: 0,
    slug: "little-sunshine",
    content: { recipientName: "Alex", senderName: "Sam", message: "A note just for you." } as CardPersonalization,
  });
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const value = event.data as {
        kind?: string; revision?: number; slug?: string; content?: CardPersonalization;
      };
      if (value?.kind !== "card:preview:update" || typeof value.revision !== "number" ||
        typeof value.slug !== "string" || !value.content ||
        typeof value.content.recipientName !== "string" ||
        typeof value.content.senderName !== "string" || typeof value.content.message !== "string") return;
      setDraft({ revision: value.revision, slug: value.slug, content: value.content });
    }
    window.addEventListener("message", receive);
    window.parent.postMessage({ kind: "card:preview:ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  useEffect(() => {
    let canceled = false;
    async function measure() {
      await document.fonts.ready;
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (!canceled && root.current) {
        window.parent.postMessage({
          kind: "card:preview:fit", revision: draft.revision,
          fit: measureCardTextFit(root.current),
        }, window.location.origin);
      }
    }
    void measure();
    return () => { canceled = true; };
  }, [draft]);
  return <div ref={root}>{renderRecipientCard(draft.slug, draft.content)}</div>;
}
