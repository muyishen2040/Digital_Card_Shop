"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent, PointerEvent, TransitionEvent } from "react";
import { finishFold, toggleFold } from "@/lib/cards/fold";
import type { FoldPhase } from "@/lib/cards/fold";
import { toPreviewContent } from "@/lib/cards/personalization";
import type { CardPersonalization, CityPostcardDesign } from "@/types/card";
import { isPostcardNoteTap } from "./note-tap";
import type { NotePointer } from "./note-tap";
import styles from "./CityPostcard.module.css";

export type { CityPostcardDesign } from "@/types/card";

export function CityPostcard({
  design,
  content,
}: {
  design: CityPostcardDesign;
  content: CardPersonalization;
}) {
  const [phase, setPhase] = useState<FoldPhase>("closed");
  const stageRef = useRef<HTMLElement>(null);
  const frontRef = useRef<HTMLButtonElement>(null);
  const readingRef = useRef<HTMLElement>(null);
  const restoreFrontFocus = useRef(false);
  const notePointer = useRef<NotePointer | null>(null);
  const descriptionId = useId();
  const isClosed = phase === "closed";
  const isOpen = phase === "open";
  const turned = phase === "opening" || isOpen;
  const note = toPreviewContent(content);

  useEffect(() => {
    if (phase === "open") {
      readingRef.current?.focus({ preventScroll: true });
    } else if (phase === "closed" && restoreFrontFocus.current) {
      restoreFrontFocus.current = false;
      frontRef.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  // Restore a stable, readable face even if its CSS transition is interrupted.
  useEffect(() => {
    if (phase !== "opening" && phase !== "closing") return;
    const timeout = window.setTimeout(() => {
      setPhase((current) => finishFold(current));
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  function turn() {
    if (!isClosed && !isOpen) return;
    if (isOpen) restoreFrontFocus.current = true;
    // Move focus out of the outgoing face before it becomes inert.
    stageRef.current?.focus({ preventScroll: true });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase((current) => toggleFold(current, reducedMotion));
  }

  function beginNoteTap(event: PointerEvent<HTMLElement>) {
    notePointer.current = event.isPrimary && event.button === 0
      ? { x: event.clientX, y: event.clientY, scrollTop: event.currentTarget.scrollTop }
      : null;
  }

  function endNoteTap(event: MouseEvent<HTMLElement>) {
    const start = notePointer.current;
    notePointer.current = null;
    // A normal tap anywhere on the note turns the card; selecting or
    // scrolling text must remain possible without accidentally closing it.
    if (!start || event.detail === 0) return;
    const selection = window.getSelection();
    const hasSelection = !!selection && !selection.isCollapsed;
    if (isPostcardNoteTap(start, {
      x: event.clientX,
      y: event.clientY,
      scrollTop: event.currentTarget.scrollTop,
    }, hasSelection)) {
      turn();
    }
  }

  function settle(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    setPhase((current) => finishFold(current));
  }

  return (
    <main
      ref={stageRef}
      tabIndex={-1}
      className={styles.stage}
      aria-label={design.city + " city postcard"}
    >
      <div className={styles.scene}>
        <div
          className={styles.card + (turned ? " " + styles.turned : "")}
          data-phase={phase}
          onTransitionEnd={settle}
        >
          <div
            className={styles.face + " " + styles.front}
            aria-hidden={!isClosed}
            inert={!isClosed}
          >
            <Image
              className={styles.art}
              src={design.frontImage}
              alt=""
              fill
              unoptimized
              loading="eager"
              sizes="(max-width: 600px) 100vw, 560px"
            />
            <span id={descriptionId} className={styles.srOnly}>{design.frontAlt}</span>
            {!design.frontTitleInArtwork && (
              <div className={styles.title}>
                <span className={styles.eyebrow}>Greetings from</span>
                <span className={styles.city}>{design.city}</span>
                {design.sceneCaption ? <span className={styles.caption}>{design.sceneCaption}</span> : null}
              </div>
            )}
            <button
              ref={frontRef}
              className={styles.frontControl}
              type="button"
              aria-label="Turn postcard over to read the message"
              aria-describedby={descriptionId}
              disabled={!isClosed}
              onClick={turn}
            />
          </div>

          <div
            className={styles.face + " " + styles.back}
            aria-hidden={!isOpen}
            inert={!isOpen}
          >
            <Image
              className={styles.art}
              src={design.backImage}
              alt={design.backAlt}
              fill
              unoptimized
              loading="eager"
              sizes="(max-width: 600px) 100vw, 560px"
            />
            <button
              type="button"
              className={styles.backControl}
              aria-label="Turn postcard back to the photograph"
              disabled={!isOpen}
              onClick={turn}
            />
            {/* This region stays laid out even when the reverse is inert, so
                the sender preview can measure real text fit before turning. */}
            <article
              className={styles.note}
              data-card-text-region
              ref={readingRef}
              tabIndex={0}
              aria-label={"Message for " + note.recipientName}
              onPointerDown={beginNoteTap}
              onPointerCancel={() => { notePointer.current = null; }}
              onClick={endNoteTap}
            >
              <p className={styles.salutation}>Dear {note.recipientName},</p>
              <p className={styles.message}>{note.message}</p>
              <p className={styles.signature}>— {note.senderName}</p>
            </article>

          </div>
        </div>
      </div>
    </main>
  );
}
