"use client";

import { useEffect, useRef, useState } from "react";
import type { CardPersonalization } from "@/types/card";
import { toPreviewContent } from "@/lib/cards/personalization";
import { isConstellationComplete, lightStar } from "@/lib/cards/constellation";
import styles from "./SkyCard.module.css";

const STARS = [
  { name: "western", x: 23, y: 33 },
  { name: "northern", x: 43, y: 19 },
  { name: "eastern", x: 68, y: 28 },
  { name: "horizon", x: 78, y: 43 },
] as const;

// These tiny background stars are decorative; only the four large stars are interactive.
const SKY_DUST = [
  [11, 14], [18, 57], [30, 12], [35, 42], [48, 8],
  [53, 45], [58, 14], [84, 14], [90, 39], [12, 43],
  [8, 71], [24, 77], [78, 67], [92, 79], [62, 69],
  [45, 75], [72, 8], [37, 63], [56, 87],
] as const;

export function SkyCard({ content }: { content: CardPersonalization }) {
  const [selected, setSelected] = useState<number[]>([]);
  const firstStarRef = useRef<HTMLButtonElement>(null);
  const noteRef = useRef<HTMLElement>(null);
  const shouldRestoreFocus = useRef(false);
  const note = toPreviewContent(content);
  const complete = isConstellationComplete(selected);

  useEffect(() => {
    if (complete) {
      noteRef.current?.focus();
    } else if (shouldRestoreFocus.current) {
      firstStarRef.current?.focus();
      shouldRestoreFocus.current = false;
    }
  }, [complete]);

  function resetSky() {
    if (!complete) return;
    shouldRestoreFocus.current = true;
    setSelected([]);
  }

  return (
    <main className={styles.sky} aria-label="Under the Same Sky greeting card">
      <div className={styles.horizon} aria-hidden="true" />
      <div className={styles.scene}>
        <div className={styles.dust} aria-hidden="true">
          {SKY_DUST.map(([x, y]) => (
            <span key={`${x}-${y}`} className={styles.dustPoint} style={{ left: `${x}%`, top: `${y}%` }} />
          ))}
        </div>

        <button
          className={styles.moon}
          type="button"
          disabled={!complete}
          onClick={resetSky}
          aria-label="Dim the constellation and return to the stars"
          title={complete ? "Return to the stars" : undefined}
        >
          <span className={styles.crescent} aria-hidden="true" />
        </button>

        <div className={styles.constellation}>
          <svg className={styles.connections} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {selected.slice(1).map((index, position) => {
              const previous = STARS[selected[position]];
              const current = STARS[index];
              return (
                <line
                  pathLength="1"
                  key={`${selected[position]}-${index}`}
                  x1={previous.x}
                  y1={previous.y}
                  x2={current.x}
                  y2={current.y}
                />
              );
            })}
          </svg>
          {STARS.map((star, index) => {
            const lit = selected.includes(index);
            return (
              <button
                key={star.name}
                ref={index === 0 ? firstStarRef : undefined}
                type="button"
                className={`${styles.star} ${lit ? styles.lit : ""}`}
                style={{ left: `${star.x}%`, top: `${star.y}%` }}
                aria-label={`${lit ? "Illuminated" : "Illuminate"} ${star.name} star`}
                aria-pressed={lit}
                disabled={complete}
                onClick={() => setSelected((current) => lightStar(current, index))}
              >
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
                  <path d="M24 3C25.9 17.1 30.9 22.1 45 24C30.9 25.9 25.9 30.9 24 45C22.1 30.9 17.1 25.9 3 24C17.1 22.1 22.1 17.1 24 3Z" fill="currentColor" />
                  <circle cx="24" cy="24" r="3" fill="#fff8da" />
                </svg>
              </button>
            );
          })}
        </div>

        <section className={`${styles.note} ${complete ? styles.revealed : ""}`} aria-hidden={!complete} inert={!complete}>
          <article className={styles.reading} ref={noteRef} tabIndex={-1} aria-label={`Message for ${note.recipientName}`}>
            <h1>For {note.recipientName}</h1>
            <p className={styles.message}>{note.message}</p>
            <p className={styles.signature}>— {note.senderName}</p>
          </article>
        </section>
      </div>
      <span className={styles.srOnly} role="status">
        {complete ? "Constellation complete. Your message is ready." : `${selected.length} of ${STARS.length} stars illuminated.`}
      </span>
    </main>
  );
}
