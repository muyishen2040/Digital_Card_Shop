"use client";

import { useState } from "react";
import type { CardPersonalization } from "@/types/card";
import { toPreviewContent } from "@/lib/cards/personalization";
import styles from "./SunshineCard.module.css";

function FlowerSprig({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 150 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M52 225C81 185 75 158 89 129C99 105 120 79 114 30"
        stroke="#72836E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M78 169C56 155 37 154 24 159C39 182 60 181 78 169Z"
        fill="#A2B198"
        stroke="#72836E"
        strokeWidth="1.5"
      />
      <path
        d="M88 130C106 107 128 106 140 109C127 132 112 137 88 130Z"
        fill="#C3CDAF"
        stroke="#72836E"
        strokeWidth="1.5"
      />
      <path
        d="M105 98C88 86 74 82 62 85C74 107 87 107 105 98Z"
        fill="#A2B198"
        stroke="#72836E"
        strokeWidth="1.5"
      />
      <g className={styles.flower}>
        <ellipse cx="114" cy="16" rx="10" ry="17" fill="#EDC3B3" />
        <ellipse cx="96" cy="28" rx="10" ry="17" transform="rotate(-65 96 28)" fill="#F2D4C5" />
        <ellipse cx="102" cy="47" rx="10" ry="17" transform="rotate(-138 102 47)" fill="#E5AB9D" />
        <ellipse cx="125" cy="47" rx="10" ry="17" transform="rotate(138 125 47)" fill="#F0CAB4" />
        <ellipse cx="132" cy="27" rx="10" ry="17" transform="rotate(65 132 27)" fill="#E9B9A9" />
        <circle cx="114" cy="31" r="8" fill="#BF904A" />
        <circle cx="112" cy="29" r="2" fill="#F8E3AD" />
      </g>
    </svg>
  );
}

function SealSun() {
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" focusable="false">
      <circle cx="22" cy="22" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M22 6v7M22 31v7M6 22h7M31 22h7M10.8 10.8l5 5M28.2 28.2l5 5M33.2 10.8l-5 5M15.8 28.2l-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SunshineCard({ content }: { content: CardPersonalization }) {
  const [opened, setOpened] = useState(false);
  const note = toPreviewContent(content);

  return (
    <section
      className={`${styles.card} ${opened ? styles.isOpen : ""}`}
      aria-label="A Little Sunshine interactive greeting card"
    >
      <div className={styles.sunwash} aria-hidden="true" />
      <div className={styles.outline} aria-hidden="true" />
      <div className={styles.masthead}>
        <span>little moments</span>
        <span>no. 01 &nbsp; / &nbsp; a little sunshine</span>
      </div>

      <div className={styles.scene}>
        <div className={styles.sundisc} aria-hidden="true">
          <span />
        </div>
        <FlowerSprig className={styles.botanicalLeft} />
        <FlowerSprig className={styles.botanicalRight} />

        <div className={styles.envelope} aria-hidden="true">
          <div className={styles.envelopeBack} />
          <div className={styles.envelopeInsert} />
          <div className={styles.envelopeFront} />
          <div className={styles.envelopeFlap} />
          <div className={styles.seal}><SealSun /></div>
        </div>

        {!opened && (
          <div className={styles.forYou} aria-hidden="true">
            <span>A little something</span>
            <strong>for {note.recipientName}</strong>
          </div>
        )}

        {opened && (
          <article className={styles.letter} aria-label="Your personal note">
            <div className={styles.letterTop}>
              <span>A letter, just for you</span>
              <span className={styles.letterSun} aria-hidden="true"><SealSun /></span>
            </div>
            <h2 className={styles.letterTitle}>Dear {note.recipientName},</h2>
            <p className={styles.letterMessage}>{note.message}</p>
            <div className={styles.letterSignoff}>
              <span>With a little sunshine,</span>
              <strong>{note.senderName}</strong>
            </div>
            <FlowerSprig className={styles.letterFlower} />
          </article>
        )}
      </div>

      <div className={styles.actionRow}>
        <p aria-live="polite" className={styles.actionHint}>
          {opened ? "The note is open. Take your time reading." : "A little note is waiting inside."}
        </p>
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => setOpened((current) => !current)}
          aria-expanded={opened}
        >
          <span>{opened ? "Close & replay" : "Open the envelope"}</span>
          <span className={styles.actionArrow} aria-hidden="true">{opened ? "↶" : "↗"}</span>
        </button>
      </div>
    </section>
  );
}
