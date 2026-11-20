"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cardTemplates } from "@/lib/cards/catalog";
import { characterCount, getCardContentPolicy } from "@/lib/cards/content-policy";
import { validateCardDraft } from "@/lib/cards/instance-model";
import type { CardTtlHours } from "@/lib/cards/instance-model";
import type { CardTextFitResult } from "@/lib/cards/content-fit";
import styles from "./SenderEditor.module.css";
import { TurnstileChallenge } from "./TurnstileChallenge";
import { recipientCardUrl } from "@/lib/cards/recipient-link";
import { cardShareData } from "@/lib/cards/sharing";

const PUBLIC_CREATION = process.env.NEXT_PUBLIC_CARD_PUBLIC_CREATION_ENABLED === "true";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const SIZES = [
  { label: "Small phone", width: 320, height: 568 },
  { label: "Phone", width: 390, height: 844 },
  { label: "Tablet", width: 768, height: 1024 },
] as const;
type Fit = "checking" | CardTextFitResult["status"];

export function SenderEditor() {
  const [slug, setSlug] = useState("little-sunshine");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [ttl, setTtl] = useState<CardTtlHours>(48);
  const [accessCode, setAccessCode] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challengeRevision, setChallengeRevision] = useState(0);
  const [viewport, setViewport] = useState(0);
  const [fit, setFit] = useState<Fit>("checking");
  const [confirmScroll, setConfirmScroll] = useState(false);
  const [frameReady, setFrameReady] = useState(0);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [expiration, setExpiration] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const linkInput = useRef<HTMLInputElement>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const previewStage = useRef<HTMLDivElement>(null);
  const [previewAvailableWidth, setPreviewAvailableWidth] = useState<number | null>(null);
  const revision = useRef(0);
  const selected = cardTemplates.find((card) => card.slug === slug)!;
  const hint = getCardContentPolicy(slug)!.recommendedMessageCharacters;
  const count = characterCount(message);

  // Keep the iframe's CSS viewport at exactly 320/390/768px. Only scale the
  // surrounding rendered display when the editor's preview column is narrower.
  const selectedViewport = SIZES[viewport];
  const frameOuterWidth = selectedViewport.width + 8; // 4px preview border on each side.
  const frameOuterHeight = selectedViewport.height + 8;
  const previewScale = previewAvailableWidth === null
    ? 1
    : Math.min(1, Math.max(0.1, previewAvailableWidth / frameOuterWidth));
  let invalid = "";
  try {
    validateCardDraft({ templateSlug: slug, recipientName: to, senderName: from, message, ttlHours: ttl });
  } catch (cause) {
    invalid = cause instanceof Error ? cause.message : "Please check your card.";
  }

  function changed() {
    setFit("checking");
    setConfirmScroll(false);
    setUrl("");
    setExpiration("");
    setError("");
    setCopied(false);
    setShareStatus("");
  }

  useEffect(() => {
    const stage = previewStage.current;
    if (!stage) return;
    const measureWidth = () => {
      const styles = window.getComputedStyle(stage);
      const usableWidth = stage.clientWidth
        - parseFloat(styles.paddingLeft)
        - parseFloat(styles.paddingRight);
      setPreviewAvailableWidth(Math.max(1, usableWidth));
    };
    measureWidth();
    const observer = new ResizeObserver(measureWidth);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== iframe.current?.contentWindow) return;
      const value = event.data as { kind?: string; revision?: number; fit?: CardTextFitResult };
      if (value?.kind === "card:preview:ready") setFrameReady((v) => v + 1);
      if (value?.kind === "card:preview:fit" && value.revision === revision.current && value.fit) {
        setFit(value.fit.status);
      }
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);

  useEffect(() => {
    if (!frameReady) return;
    revision.current += 1;
    iframe.current?.contentWindow?.postMessage({
      kind: "card:preview:update", revision: revision.current, slug,
      content: { recipientName: to, senderName: from, message },
    }, window.location.origin);
  }, [frameReady, slug, to, from, message, viewport]);

  const authorizedToPublish = PUBLIC_CREATION ? !!TURNSTILE_SITE_KEY && !!turnstileToken : accessCode.length > 0;
  // Only compute availability once a card link exists; avoid effect-driven state.
  const nativeShareAvailable = (() => {
    if (!url || typeof navigator === "undefined" || typeof navigator.share !== "function") return false;
    try {
      return typeof navigator.canShare !== "function" || navigator.canShare(cardShareData(url));
    } catch {
      return false;
    }
  })();

  const canPublish = !invalid && !creating && authorizedToPublish &&
    fit !== "checking" && (fit === "fits" || confirmScroll);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canPublish) return;
    setCreating(true);
    setError("");
    try {
      const response = await fetch(PUBLIC_CREATION ? "/api/public/cards" : "/api/cards", {
        method: "POST", cache: "no-store",
        headers: PUBLIC_CREATION
          ? { "Content-Type": "application/json" }
          : { "Content-Type": "application/json", Authorization: `Bearer ${accessCode}` },
        body: JSON.stringify({ templateSlug: slug, recipientName: to, senderName: from, message, ttlHours: ttl,
          ...(PUBLIC_CREATION ? { turnstileToken } : {}) }),
      });
      const result: unknown = await response.json();
      if (!result || typeof result !== "object") throw new Error("Unexpected server response.");
      const data = result as { error?: string; path?: string; expiresAt?: string };
      if (!response.ok) throw new Error(data.error ?? "Unable to create the card.");
      if (!data.path || !/^\/c\/[A-Za-z0-9_-]{43}$/.test(data.path) || !data.expiresAt) {
        throw new Error("Unexpected link returned.");
      }
      setUrl(recipientCardUrl(data.path));
      setExpiration(data.expiresAt);
      setAccessCode("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the card.");
    } finally {
      setCreating(false);
      if (PUBLIC_CREATION) {
        setTurnstileToken("");
        setChallengeRevision((n) => n + 1);
      }
    }
  }

  async function copyLink() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShareStatus("Private link copied. Share it only with your intended recipient.");
    } catch {
      linkInput.current?.focus();
      linkInput.current?.select();
      setShareStatus("Clipboard access is unavailable. The link is selected for manual copying.");
    }
  }

  async function shareLink() {
    if (!url || !nativeShareAvailable) return;
    try {
      await navigator.share(cardShareData(url));
      setShareStatus("Your share sheet has closed.");
    } catch (cause) {
      // Dismissing a share sheet is a normal action, not an error.
      if (cause instanceof Error && cause.name === "AbortError") return;
      setShareStatus("Sharing is unavailable. Copy the private link instead.");
    }
  }

  return <main className={styles.page}>
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>little <em>moments</em></Link>
      <span className={styles.headerHint}>a note, made yours</span>
    </header>

    <div className={styles.grid}>
      <section className={styles.editor} aria-label="Personalize your card">
        <span className={styles.eyebrow}>01 / PERSONALIZE</span>
        <h1>Make someone&apos;s day.</h1>
        <p className={styles.intro}>A few words, a little interaction, and a moment worth sharing.</p>
        <form onSubmit={create}>
          <fieldset className={styles.choices}>
            <legend>Choose your card</legend>
            <div className={styles.options}>
              {cardTemplates.map((card) => <button type="button" key={card.slug}
                aria-pressed={slug === card.slug}
                className={slug === card.slug ? styles.selected : ""}
                onClick={() => { setSlug(card.slug); changed(); }}>
                <strong>{card.title}</strong><small>{card.category}</small>
              </button>)}
            </div>
          </fieldset>

          <div className={styles.names}>
            <label>To · {characterCount(to)} / 40
              <input required placeholder="Recipient's name" value={to}
                onChange={(e) => { setTo(e.target.value); changed(); }} />
            </label>
            <label>From · {characterCount(from)} / 40
              <input required placeholder="Your name" value={from}
                onChange={(e) => { setFrom(e.target.value); changed(); }} />
            </label>
          </div>
          <label htmlFor="card-message">Your message</label>
          <textarea id="card-message" required rows={6} placeholder="Write what only you could say…"
            value={message} onChange={(e) => { setMessage(e.target.value); changed(); }} />
          <div className={styles.counter}><span>Suggested for {selected.title}: ~{hint}</span>
            <span className={count > 600 ? styles.warning : ""}>{count} / 600 characters</span></div>
          <p className={styles.note}>Longer messages are welcome. Your recipient can scroll to read everything.</p>
          <label htmlFor="card-duration">Link lifetime</label>
          <select id="card-duration" value={ttl} onChange={(e) => { setTtl(Number(e.target.value) as CardTtlHours); changed(); }}>
            <option value={24}>1 day</option><option value={48}>2 days</option><option value={72}>3 days</option>
          </select>
          <p className={styles.fit} role="status">
            {fit === "checking" && "Measuring the card layout…"}
            {fit === "fits" && "Your note fits the selected preview."}
            {fit === "overflows" && "Some text needs scrolling. Consider shortening it for a one-screen reveal."}
            {fit === "unmeasurable" && "The message area could not be measured. Please inspect it manually."}
          </p>
          {(fit === "overflows" || fit === "unmeasurable") &&
            <label className={styles.confirm}><input type="checkbox" checked={confirmScroll}
              onChange={(e) => setConfirmScroll(e.target.checked)} />
              I&apos;ve reviewed the card and want to keep this note.</label>}
          {PUBLIC_CREATION ? <div className={styles.access} aria-label="Human verification">
            <p className={styles.note}>One last check before making your private link. Free cards are limited to prevent abuse.</p>
            {TURNSTILE_SITE_KEY
              ? <TurnstileChallenge key={challengeRevision} siteKey={TURNSTILE_SITE_KEY} onToken={setTurnstileToken} />
              : <p className={styles.warning} role="alert">Card creation is not configured yet.</p>}
          </div> : <div className={styles.access}>
            <label htmlFor="creator-code">Creator access code</label>
            <input id="creator-code" type="password" autoComplete="off" placeholder="Private pilot access"
              value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
            <p className={styles.note}>Private pilot only. Your code stays in this page and is not saved.</p>
          </div>}
          {!!invalid && !!(to || from || message) && <p className={styles.warning} role="alert">{invalid}</p>}
          {!!error && <p className={styles.warning} role="alert">{error}</p>}
          <button type="submit" className={styles.publish} disabled={!canPublish}>
            {creating ? "Creating your card…" : "Create private link"} <span aria-hidden="true">↗</span>
          </button>
        </form>

        {url && <section className={styles.result} aria-label="Private recipient link">
          <span className={styles.eyebrow}>YOUR CARD IS READY</span>
          <h2>Send a little moment.</h2>
          <p>Only someone with this link can open your card until it expires. Share privately.</p>
          <label htmlFor="result-link">Recipient link</label>
          <input id="result-link" ref={linkInput} type="text" readOnly value={url}
            onFocus={(e) => e.target.select()} aria-describedby="link-privacy-note" />
          <div className={styles.resultActions}>
            {nativeShareAvailable && <button type="button" onClick={shareLink} className={styles.sharePrimary}>Share card</button>}
            <button type="button" onClick={copyLink}>{copied ? "Copy again" : "Copy link"}</button>
            <a href={url} rel="noopener noreferrer" target="_blank">Open card</a>
          </div>
          <p id="link-privacy-note" className={styles.privacyNote}>Anyone who has this private link can view your card until it expires. Share thoughtfully.</p>
          <p className={styles.shareStatus} role="status" aria-live="polite">{shareStatus}</p>
          <small>Expires {new Date(expiration).toLocaleString()}</small>
        </section>}
      </section>

      <section className={styles.preview} aria-label="Live card preview">
        <div className={styles.previewHeader}>
          <div><span className={styles.eyebrow}>02 / INTERACTIVE PREVIEW</span>
            <h2>See their moment.</h2><p>Try opening the card to reveal your note.</p></div>
          <div className={styles.viewports} role="group" aria-label="Preview size">
            {SIZES.map((size, index) => <button type="button" key={size.width} title={size.label}
              aria-pressed={viewport === index} className={viewport === index ? styles.active : ""}
              onClick={() => { setViewport(index); changed(); }}>{size.width}</button>)}
          </div>
        </div>
        <div className={styles.previewStage} ref={previewStage}>
          <div
            className={styles.previewSizer}
            style={{ width: frameOuterWidth * previewScale, height: frameOuterHeight * previewScale }}
          >
            <div className={styles.device} style={{
              width: selectedViewport.width,
              height: selectedViewport.height,
              transform: `scale(${previewScale})`,
            }}>
              <iframe title={`${selected.title} live preview`} src="/create/preview"
                ref={iframe} onLoad={() => setFrameReady((v) => v + 1)} />
            </div>
          </div>
        </div>
        <p className={styles.note}>The entire card is scaled to fit the available space when needed; its internal viewport stays at the selected size. Review the small-phone view before sharing.</p>
      </section>
    </div>
  </main>;
}
