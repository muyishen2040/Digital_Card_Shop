"use client";

import { useEffect, useRef, useState } from "react";
import type { CardPersonalization } from "@/types/card";
import { toPreviewContent } from "@/lib/cards/personalization";
import styles from "./SunshineCard.module.css";

function BotanicalSprig({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 150 230" fill="none" aria-hidden="true" focusable="false">
      <path d="M52 225C81 185 75 158 89 129C99 105 120 79 114 30" stroke="#72836E" strokeWidth="2" strokeLinecap="round" />
      <path d="M78 169C56 155 37 154 24 159C39 182 60 181 78 169Z" fill="#A2B198" stroke="#72836E" strokeWidth="1.5" />
      <path d="M88 130C106 107 128 106 140 109C127 132 112 137 88 130Z" fill="#C3CDAF" stroke="#72836E" strokeWidth="1.5" />
      <path d="M105 98C88 86 74 82 62 85C74 107 87 107 105 98Z" fill="#A2B198" stroke="#72836E" strokeWidth="1.5" />
      <g className={styles.bloom}>
        <ellipse cx="114" cy="16" rx="10" ry="17" fill="#EDC3B3" />
        <ellipse cx="96" cy="28" rx="10" ry="17" transform="rotate(-65 96 28)" fill="#F2D4C5" />
        <ellipse cx="102" cy="47" rx="10" ry="17" transform="rotate(-138 102 47)" fill="#E5AB9D" />
        <ellipse cx="125" cy="47" rx="10" ry="17" transform="rotate(138 125 47)" fill="#F0CAB4" />
        <ellipse cx="132" cy="27" rx="10" ry="17" transform="rotate(65 132 27)" fill="#E9B9A9" />
        <circle cx="114" cy="31" r="8" fill="#BF904A" />
      </g>
    </svg>
  );
}

function SunMark() {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" focusable="false">
      <circle cx="22" cy="22" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M22 6v7M22 31v7M6 22h7M31 22h7M10.8 10.8l5 5M28.2 28.2l5 5M33.2 10.8l-5 5M15.8 28.2l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** A recipient-only card with no instructions or storefront elements. */
export function SunshineCard({ content }: { content: CardPersonalization }) {
  const [opened, setOpened] = useState(false);
  const envelopeRef = useRef<HTMLButtonElement>(null);
  const letterRef = useRef<HTMLElement>(null);
  const note = toPreviewContent(content);

  useEffect(() => {
    if (opened) letterRef.current?.focus();
  }, [opened]);

  function replay() {
    setOpened(false);
    requestAnimationFrame(() => envelopeRef.current?.focus());
  }

  return (
    <main className={`${styles.card} ${opened ? styles.open : ""}`} aria-label="A Little Sunshine greeting card">
      <div className={styles.sunlight} aria-hidden="true" />
      <div className={styles.stage}>
        <BotanicalSprig className={styles.sprigLeft} />
        <BotanicalSprig className={styles.sprigRight} />

        <button
          ref={envelopeRef}
          className={styles.envelope}
          type="button"
          aria-label={`Open the envelope for ${note.recipientName}`}
          aria-expanded={opened}
          onClick={() => setOpened(true)}
          disabled={opened}
        >
          <span className={styles.envelopeBack} />
          <span className={styles.letterEdge} />
          <span className={styles.envelopeFront} />
          <span className={styles.envelopeFlap} />
          <span className={styles.seal}><SunMark /></span>
          <span className={styles.address}>For {note.recipientName}</span>
        </button>

        <article
          ref={letterRef}
          className={styles.letter}
          tabIndex={-1}
          aria-label={`Letter to ${note.recipientName}`}
          aria-hidden={!opened}
          inert={!opened}
        >
          <div className={styles.letterContent}>
            <p className={styles.salutation}>Dear {note.recipientName},</p>
            <p className={styles.message}>{note.message}</p>
            <p className={styles.signature}>— {note.senderName}</p>
          </div>
          <BotanicalSprig className={styles.letterSprig} />
          <button
            className={styles.replay}
            type="button"
            onClick={replay}
            aria-label="Close the letter and replay the opening"
            title="Replay"
            tabIndex={opened ? 0 : -1}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 10a9 9 0 1 1 2.6 6.4M3 4v6h6" />
            </svg>
          </button>
        </article>
      </div>
      <span className={styles.srOnly} role="status">{opened ? "Letter opened" : ""}</span>
    </main>
  );
}
