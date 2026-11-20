"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileAPI = {
  render: (container: HTMLElement, options: {
    sitekey: string;
    action: string;
    callback: (token: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
  }) => string;
  remove: (id: string) => void;
};

export function TurnstileChallenge({ siteKey, onToken }: {
  siteKey: string;
  onToken: (token: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ready || !host.current) return;
    const turnstile = (window as Window & { turnstile?: TurnstileAPI }).turnstile;
    if (!turnstile) return;
    const id = turnstile.render(host.current, {
      sitekey: siteKey,
      action: "create_card",
      callback: onToken,
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
    return () => { turnstile.remove(id); onToken(""); };
  }, [ready, siteKey, onToken]);

  return <>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive" onReady={() => setReady(true)} />
    <div ref={host} aria-label="Verify you are human" />
  </>;
}
