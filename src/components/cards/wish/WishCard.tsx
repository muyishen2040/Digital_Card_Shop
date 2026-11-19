"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { CardPersonalization } from "@/types/card";
import { toPreviewContent } from "@/lib/cards/personalization";
import styles from "./WishCard.module.css";

const PAPER_BITS = [
  { x: 11, y: 22, shade: "#f17669", angle: -29 },
  { x: 19, y: 36, shade: "#8279ad", angle: 24 },
  { x: 29, y: 13, shade: "#d68b5a", angle: 43 },
  { x: 74, y: 17, shade: "#bf6484", angle: -47 },
  { x: 89, y: 27, shade: "#856eab", angle: 36 },
  { x: 82, y: 41, shade: "#e87867", angle: -26 },
  { x: 14, y: 57, shade: "#aa6687", angle: -17 },
  { x: 32, y: 48, shade: "#e48c5b", angle: 34 },
  { x: 69, y: 53, shade: "#8477a7", angle: 17 },
  { x: 90, y: 60, shade: "#cf756c", angle: 62 },
  { x: 7, y: 76, shade: "#cb865b", angle: 31 },
  { x: 25, y: 84, shade: "#af779d", angle: -46 },
  { x: 65, y: 83, shade: "#c96a64", angle: 42 },
  { x: 92, y: 82, shade: "#d0838f", angle: 13 },
] as const;

function BirthdayCake() {
  return (
    <svg className={styles.cakeArt} viewBox="0 0 440 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <ellipse cx="220" cy="283" rx="175" ry="14" fill="#b18c81" opacity=".23" />
      <path d="M70 266C122 289 320 291 370 266" stroke="#5b3654" strokeOpacity=".45" strokeWidth="3" strokeLinecap="round" />
      <rect x="81" y="130" width="278" height="139" rx="24" fill="#e98e94" stroke="#654161" strokeWidth="3" />
      <path d="M83 199C123 185 160 211 205 199C248 188 290 208 355 194V247C303 262 258 246 205 252C153 257 112 248 83 257V199Z" fill="#f7b1a9" opacity=".85" />
      <rect x="81" y="223" width="278" height="31" rx="12" fill="#b57fa9" opacity=".85" />
      <path d="M81 154C75 132 84 104 107 105H332C356 105 366 136 359 154C354 169 338 172 332 156C324 136 313 145 313 161C313 184 292 189 284 165C274 138 260 148 260 165C260 190 240 193 234 163C228 138 211 145 210 163C207 191 184 194 180 165C176 138 163 143 160 164C155 189 136 185 132 163C128 142 115 144 114 161C110 177 87 173 81 154Z" fill="#f7e9da" stroke="#654161" strokeWidth="3" />
      <ellipse cx="220" cy="108" rx="112" ry="14" fill="#fff1e3" opacity=".6" />
      <path d="M111 127L122 137M154 121L166 130M189 132L201 123M254 128L264 137M302 124L313 134" stroke="#d78580" strokeWidth="5" strokeLinecap="round" />
      <path d="M117 213L127 208M171 219L181 215M219 204L227 211M277 216L287 210M326 215L336 211" stroke="#fbe3ae" strokeWidth="5" strokeLinecap="round" />
      <path d="M94 267C149 278 282 280 347 266" stroke="#5e3d5b" strokeWidth="3" strokeOpacity=".45" strokeLinecap="round" />
    </svg>
  );
}

export function WishCard({ content }: { content: CardPersonalization }) {
  const [celebrated, setCelebrated] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const candleRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLElement>(null);
  const restoreCandleFocus = useRef(false);
  const note = toPreviewContent(content);

  useEffect(() => {
    if (celebrated) {
      messageRef.current?.focus();
    } else if (restoreCandleFocus.current && !transitioning) {
      candleRef.current?.focus();
      restoreCandleFocus.current = false;
    }
  }, [celebrated, transitioning]);

  useEffect(() => {
    if (!transitioning) return;
    // Prevent a rapid second tap from undoing the burst before it settles.
    const timeout = window.setTimeout(() => setTransitioning(false), 850);
    return () => window.clearTimeout(timeout);
  }, [transitioning]);

  function toggleCandle() {
    if (transitioning) return;
    if (celebrated) restoreCandleFocus.current = true;
    setCelebrated((previous) => !previous);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTransitioning(true);
    }
  }

  return (
    <main className={`${styles.birthday} ${celebrated ? styles.celebrated : ""}`} aria-label="Make a Wish birthday greeting card">
      <div className={styles.leftCutout} aria-hidden="true" />
      <div className={styles.rightCutout} aria-hidden="true" />
      <div className={styles.stage}>
        <div className={styles.confetti} aria-hidden="true">
          {PAPER_BITS.map((bit, index) => (
            <span
              key={index}
              className={styles.paperBit}
              style={{
                left: `${bit.x}%`,
                top: `${bit.y}%`,
                backgroundColor: bit.shade,
                "--paper-angle": `${bit.angle}deg`,
                animationDelay: `${index * 35}ms`,
              } as CSSProperties}
            />
          ))}
        </div>

        <section className={styles.wishPoster} aria-hidden={!celebrated} inert={!celebrated}>
          <article className={styles.posterContent} ref={messageRef} tabIndex={-1} aria-label={`Birthday message for ${note.recipientName}`}>
            <h1>To {note.recipientName},</h1>
            <p className={styles.message}>{note.message}</p>
            <p className={styles.signature}>— {note.senderName}</p>
          </article>
        </section>

        <div className={styles.cakeScene}>
          <BirthdayCake />
          <button
            ref={candleRef}
            type="button"
            className={styles.candle}
            onClick={toggleCandle}
            disabled={transitioning}
            aria-pressed={celebrated}
            aria-label={celebrated ? "Relight the birthday candle" : "Blow out the birthday candle"}
          >
            <span className={styles.candleBody} aria-hidden="true" />
            <span className={styles.wick} aria-hidden="true" />
            <span className={styles.flame} aria-hidden="true" />
            <span className={styles.smoke} aria-hidden="true" />
          </button>
        </div>
      </div>
      <span className={styles.srOnly} role="status">
        {celebrated ? "Candle blown out. Birthday message revealed." : ""}
      </span>
    </main>
  );
}
