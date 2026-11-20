"use client";

import { useEffect, useRef, useState } from "react";
import type { CardPersonalization } from "@/types/card";
import { toPreviewContent } from "@/lib/cards/personalization";
import { finishFold, toggleFold } from "@/lib/cards/fold";
import type { FoldPhase } from "@/lib/cards/fold";
import styles from "./SkyCard.module.css";

const SMALL_STARS = [
  [11, 14], [21, 29], [33, 11], [42, 56], [58, 18], [72, 31],
  [85, 15], [92, 56], [13, 73], [26, 87], [53, 79], [77, 82],
] as const;

function Crescent({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 88 88" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M64 12a35 35 0 1 0 11 61 34 34 0 0 1-11-61Z"
        fill="#F1E3BF"
        stroke="#F6ECD4"
        strokeWidth="1.3"
      />
      <path d="M25 68c7 7 17 10 25 10" stroke="#E8CF9D" strokeWidth="1.1" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

function CelestialArt({ inside = false }: { inside?: boolean }) {
  return (
    <div className={inside ? styles.insideArt : styles.coverArt} aria-hidden="true">
      <Crescent className={styles.moon} />
      <svg className={styles.constellation} viewBox="0 0 300 310" fill="none" focusable="false">
        <path d="M49 170L114 102L181 143L255 60" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2 5" />
        {[[49,170],[114,102],[181,143],[255,60]].map(([x,y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="3.3" fill="currentColor"/>
            <path d={`M${x} ${y - 11}v22M${x-11} ${y}h22`} stroke="currentColor" strokeWidth=".8" opacity=".72" />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function SkyCard({ content }: { content: CardPersonalization }) {
  const [phase, setPhase] = useState<FoldPhase>("closed");
  const [readingExpanded, setReadingExpanded] = useState(false);
  const coverRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLElement>(null);
  const restoreCoverFocus = useRef(false);
  const note = toPreviewContent(content);
  const unfolded = phase === "opening" || phase === "open";

  useEffect(() => {
    if (phase === "open") {
      messageRef.current?.focus();
    } else if (phase === "closed" && restoreCoverFocus.current) {
      restoreCoverFocus.current = false;
      coverRef.current?.focus();
    }
  }, [phase]);

  // A fallback restores controls if a CSS transition is interrupted or never fires.
  useEffect(() => {
    if (phase !== "opening" && phase !== "closing") return;
    const timeout = window.setTimeout(() => {
      setPhase((current) => finishFold(current));
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  function activateFold() {
    if (phase === "open") {
      restoreCoverFocus.current = true;
      setReadingExpanded(false);
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase((current) => toggleFold(current, reducedMotion));
  }

  function settleFold(event: React.TransitionEvent<HTMLButtonElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    setPhase((current) => finishFold(current));
  }

  return (
    <main className={styles.sky} aria-label="Under the Same Sky greeting card">
      <div className={styles.atmosphere} aria-hidden="true">
        {SMALL_STARS.map(([x, y]) => (
          <span key={`${x}-${y}`} className={styles.ambientStar} style={{ left: `${x}%`, top: `${y}%` }} />
        ))}
      </div>
      <div className={styles.scene}>
        <div className={`${styles.book} ${unfolded ? styles.unfolded : ""}`}>
          <section
            className={`${styles.rightPage} ${readingExpanded ? styles.readingExpanded : ""}`}
            aria-hidden={phase !== "open"}
            inert={phase !== "open"}
          >
            <article
              className={styles.messagePage}
              data-card-text-region
              ref={messageRef}
              tabIndex={-1}
              aria-label={`Message for ${note.recipientName}`}
            >
              <span className={styles.insideSun} aria-hidden="true">✧</span>
              <h1>For {note.recipientName}</h1>
              <p className={styles.message}>{note.message}</p>
              <p className={styles.signature}>— {note.senderName}</p>
            </article>
            <button
              className={styles.readingToggle}
              type="button"
              onClick={() => {
                setReadingExpanded((wasExpanded) => !wasExpanded);
                requestAnimationFrame(() => messageRef.current?.focus());
              }}
              aria-pressed={readingExpanded}
              disabled={phase !== "open"}
            >
              {readingExpanded ? "Full card" : "Read note"}
            </button>
            <button
              type="button"
              className={styles.foldCorner}
              aria-label="Fold the night-sky card closed"
              onClick={activateFold}
              disabled={phase !== "open"}
            >
              <span className={styles.cornerShape} aria-hidden="true" />
            </button>
          </section>
          <button
            ref={coverRef}
            type="button"
            className={styles.cover}
            aria-label={unfolded ? "Fold the night-sky card closed" : "Unfold the night-sky card"}
            aria-expanded={unfolded}
            disabled={phase === "opening" || phase === "closing"}
            onClick={activateFold}
            onTransitionEnd={settleFold}
          >
            <span className={`${styles.face} ${styles.front}`}>
              <span className={styles.coverBorder} aria-hidden="true" />
              <CelestialArt />
              <span className={styles.coverTitle}>under the same sky</span>
              <span className={styles.coverBottom} aria-hidden="true">✦</span>
            </span>
            <span className={`${styles.face} ${styles.inside}`}>
              <CelestialArt inside />
            </span>
          </button>
        </div>
      </div>
      <span className={styles.srOnly} role="status">
        {phase === "open" ? "Card unfolded. Personal message ready." : ""}
      </span>
    </main>
  );
}
