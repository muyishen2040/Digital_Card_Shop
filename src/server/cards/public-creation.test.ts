import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { getClientIp, publicCreationConfigured, reservePublicCardSlot, verifyTurnstile } from "./public-creation";

const IP = "192.0.2.1";
beforeEach(() => {
  vi.stubEnv("CARD_PUBLIC_CREATION_ENABLED", "true");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret-1234567890abcdefghij");
  vi.stubEnv("CARD_RATE_LIMIT_SECRET", "rate-secret-1234567890abcdefghijklmnopqrstuvwxyz");
  vi.stubEnv("SUPABASE_URL", "https://cards-test.supabase.co");
  vi.stubEnv("SUPABASE_SECRET_KEY", "sb_secret_only_for_tests");
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe("public creation security", () => {
  it("requires an explicit flag and independent secrets", () => {
    expect(publicCreationConfigured()).toBe(true);
    vi.stubEnv("CARD_PUBLIC_CREATION_ENABLED", "false");
    expect(publicCreationConfigured()).toBe(false);
    vi.stubEnv("CARD_PUBLIC_CREATION_ENABLED", "true");
    vi.stubEnv("CARD_RATE_LIMIT_SECRET", "");
    expect(publicCreationConfigured()).toBe(false);
  });
  it("accepts only a valid Vercel-forwarded IP", () => {
    const r = (ip?: string) => new Request("https://cards.test", { headers: ip ? { "x-forwarded-for": ip } : {} });
    expect(getClientIp(r(IP))).toBe(IP);
    expect(getClientIp(r("2001:db8::1, 192.0.2.2"))).toBe("2001:db8::1");
    expect(getClientIp(r("garbage"))).toBe(null);
    expect(getClientIp(r())).toBe(null);
  });
  it("checks hostname and action, not just Turnstile success", async () => {
    const mock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "cards.test", action: "create_card" })));
    vi.stubGlobal("fetch", mock);
    expect(await verifyTurnstile("test-token", "cards.test", IP)).toBe(true);
    const body = mock.mock.calls[0][1].body as URLSearchParams;
    expect(body.get("remoteip")).toBe(IP);
    mock.mockResolvedValue(new Response(JSON.stringify({ success: true, hostname: "evil.test", action: "create_card" })));
    expect(await verifyTurnstile("test-token", "cards.test", IP)).toBe(false);
  });
  it("uses only HMAC fingerprints in the quota RPC body", async () => {
    const mock = vi.fn().mockResolvedValue(new Response("true", { status: 200 }));
    vi.stubGlobal("fetch", mock);
    expect(await reservePublicCardSlot(IP)).toBe(true);
    const [url, init] = mock.mock.calls[0] as [URL, RequestInit];
    expect(url.pathname).toBe("/rest/v1/rpc/reserve_public_card_slot");
    const body = JSON.parse(String(init.body)) as { p_fingerprint: string };
    expect(body.p_fingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(body)).not.toContain(IP);
    expect(new Headers(init.headers).get("apikey")).toBe("sb_secret_only_for_tests");
  });
  it("fails closed on an invalid quota response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("[]")));
    await expect(reservePublicCardSlot(IP)).rejects.toThrow();
  });
});
