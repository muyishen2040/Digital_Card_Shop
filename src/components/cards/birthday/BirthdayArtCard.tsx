"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import type { CardPersonalization } from "@/types/card";
import { toPreviewContent } from "@/lib/cards/personalization";
import { CARD_TEXT_SCALES } from "@/lib/cards/text-size";
import type { BirthdayArtSlug } from "@/lib/cards/birthday/designs";
import { artwork as velvet } from "./artwork/velvet-encore";
import { artwork as bloom } from "./artwork/birthday-bloom";
import { artwork as parcel } from "./artwork/golden-parcel";
import { artwork as orbit } from "./artwork/another-orbit";
import { artwork as record } from "./artwork/birthday-record";

const scenes = {
  "velvet-encore": velvet,
  "birthday-bloom": bloom,
  "golden-parcel": parcel,
  "another-orbit": orbit,
  "birthday-record": record,
} as const;

/** Escape sender-controlled text before inserting it into approved static artwork. */
export function escapeCardHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;",
  })[character] ?? character);
}

const FONT_MULTIPLIER = { small: 0.88, medium: 1, large: 1.15 } as const;

export function birthdaySceneMarkup(
  design: BirthdayArtSlug,
  note: CardPersonalization,
): string {
  const scene = scenes[design];
  const data = toPreviewContent(note);
  const size = data.textSize ?? "large";
  const scale = CARD_TEXT_SCALES[size];

  // The visual HTML and SVG are reviewed, static assets. Only escaped text from
  // the shared personalization contract is inserted. No script is evaluated.
  return scene.html
    .replace("__CARD_TO__", escapeCardHtml(data.recipientName))
    .replace("__CARD_FROM__", escapeCardHtml(data.senderName))
    .replace("__CARD_MESSAGE__", escapeCardHtml(data.message))
    .replace('<main class="world">', `<main class="world" style="--font-multiplier:${FONT_MULTIPLIER[size]}">`)
    .replace("data-card-text-region", `data-card-text-region style="--card-text-scale:${scale}"`)
    .replace('class="recipient-note"', 'class="recipient-note" inert')
    .replace(/<article(?![^>]*aria-hidden)[^>]*class="recipient-note"/, '.replace('class="recipient-note"', 'class="recipient-note" aria-hidden="true" inert'); aria-hidden="true"');
}

/** The same recipient object is rendered for demo, sender preview and private links. */
export function BirthdayArtCard({ design, content }: {
  design: BirthdayArtSlug;
  content: CardPersonalization;
}) {
  const [opened, setOpened] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const focusedPhase = useRef(false);
  const scene = scenes[design];
  const markup = useMemo(() => birthdaySceneMarkup(design, content), [
    design, content.recipientName, content.senderName, content.message, content.textSize,
  ]);

  useLayoutEffect(() => {
    const root = host.current?.querySelector<HTMLElement>(".artboard");
    const action = root?.querySelector<HTMLButtonElement>("[data-action]");
    const note = root?.querySelector<HTMLElement>("[data-card-text-region]");
    root?.classList.toggle("opened", opened);
    action?.setAttribute("aria-expanded", String(opened));
    action?.setAttribute("aria-label", opened ? scene.closeLabel : scene.openLabel);
    if (note) {
      note.inert = !opened;
      note.setAttribute("aria-hidden", String(!opened));
    }
  }, [opened, markup, scene]);

  useEffect(() => {
    // Avoid focusing the cover when the card is initially loaded.
    if (focusedPhase.current === opened) return;
    focusedPhase.current = opened;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      const root = host.current;
      const target = opened
        ? root?.querySelector<HTMLElement>("[data-card-text-region]")
        : root?.querySelector<HTMLButtonElement>("[data-action]");
      target?.focus({ preventScroll: true });
    }, reduced ? 0 : 650);
    return () => window.clearTimeout(timer);
  }, [opened]);

  function activate(event: MouseEvent<HTMLDivElement>) {
    const el = event.target;
    if (!(el instanceof Element) || !el.closest("[data-action]")) return;
    setOpened((previous) => !previous);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && opened) {
      event.preventDefault();
      setOpened(false);
    }
  }

  return (
    <>
      <link rel="stylesheet" href={scene.fontHref} />
      <style>{scene.css}</style>
      <div
        ref={host}
        onClick={activate}
        onKeyDown={onKeyDown}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </>
  );
}
