"use client";

import { useState } from "react";
import Link from "next/link";
import type { CardPersonalization } from "@/types/card";
import {
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  SUNSHINE_DEMO,
  toPreviewContent,
} from "@/lib/cards/personalization";
import { SunshineCard } from "@/components/cards/sunshine/SunshineCard";
import styles from "./SunshineStudio.module.css";

export function SunshineStudio() {
  const [draft, setDraft] = useState<CardPersonalization>({ ...SUNSHINE_DEMO });
  const preview = toPreviewContent(draft);

  function change(field: "recipientName" | "senderName" | "message", value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.wordmark} aria-label="Back to card gallery">
            little <em>moments</em>
          </Link>
          <Link className={styles.backLink} href="/">
            <span aria-hidden="true">←</span> Back to the collection
          </Link>
        </header>

        <div className={styles.editorLayout}>
          <div className={styles.editorPane}>
            <span className={styles.kicker}>THE WRITING DESK / 01</span>
            <h1>Make someone&apos;s day <em>a little lighter.</em></h1>
            <p className={styles.intro}>
              Write a note from the heart. Then open the envelope to see exactly
              how your little surprise will feel.
            </p>

            <div className={styles.fields} role="group" aria-label="Personalize A Little Sunshine">
              <div className={styles.field}>
                <label htmlFor="sunshine-recipient">Who is it for?</label>
                <input
                  id="sunshine-recipient"
                  type="text"
                  autoComplete="off"
                  maxLength={MAX_NAME_LENGTH}
                  value={draft.recipientName}
                  onChange={(event) => change("recipientName", event.target.value)}
                  placeholder="A friend's name"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="sunshine-sender">From</label>
                <input
                  id="sunshine-sender"
                  type="text"
                  autoComplete="off"
                  maxLength={MAX_NAME_LENGTH}
                  value={draft.senderName}
                  onChange={(event) => change("senderName", event.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label htmlFor="sunshine-message">Your message</label>
                  <span className={styles.counter} aria-live="off">
                    {draft.message.length} / {MAX_MESSAGE_LENGTH}
                  </span>
                </div>
                <textarea
                  id="sunshine-message"
                  rows={7}
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={draft.message}
                  onChange={(event) => change("message", event.target.value)}
                  placeholder="Something you'd like them to know..."
                />
              </div>
              <button
                className={styles.resetButton}
                type="button"
                onClick={() => setDraft({ ...SUNSHINE_DEMO })}
              >
                <span aria-hidden="true">↺</span> Restore sample text
              </button>
            </div>

            <p className={styles.privacyNote}>
              <span className={styles.privacyDot} aria-hidden="true" />
              This is a browser-only preview. Nothing is saved, shared, or emailed.
            </p>
          </div>

          <div className={styles.previewPane}>
            <div className={styles.previewHeading}>
              <div>
                <span className={styles.kicker}>A LITTLE SUNSHINE</span>
                <h2>Live preview</h2>
              </div>
              <span className={styles.previewBadge}>Not sent</span>
            </div>
            <SunshineCard content={preview} />
            <p className={styles.previewFootnote}>
              Tap &ldquo;Open the envelope&rdquo; to experience the recipient&apos;s view.
              You can keep editing the note at any time.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
