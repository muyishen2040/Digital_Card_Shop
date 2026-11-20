import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCardInstance, findActiveCardByToken } from "./card-instances";
import { hashCardToken, issueCardToken } from "./card-token";

vi.mock("server-only", () => ({}));

const FIXED_NOW = "2026-11-19T23:00:00.000Z";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(FIXED_NOW));
  vi.stubEnv("SUPABASE_URL", "https://cards-test.supabase.co");
  vi.stubEnv("SUPABASE_SECRET_KEY", "sb_secret_test_for_unit_only");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("private Supabase card-instance repository", () => {
  it("inserts a private token digest, never the bearer token, with no-store", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ id: "test-uuid" }]), { status: 201 }),
    );
    vi.stubGlobal("fetch", mockFetch);

    const result = await createCardInstance({
      templateSlug: "same-sky",
      recipientName: "Jamie",
      senderName: "Taylor",
      message: "A private hello.",
      ttlHours: 24,
    });

    const [url, init] = mockFetch.mock.calls[0] as [URL, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(url.pathname).toBe("/rest/v1/card_instances");
    expect(body.access_token_hash).toBe(hashCardToken(result.accessToken));
    expect(body.access_token_hash).not.toBe(result.accessToken);
    expect(JSON.stringify(body)).not.toContain(result.accessToken);
    expect(body.message).toBe("A private hello.");
    expect(result.expiresAt).toBe("2026-11-20T23:00:00.000Z");
    expect(init.method).toBe("POST");
    expect(init.cache).toBe("no-store");
    expect((init.headers as Headers).get("apikey")).toBe("sb_secret_test_for_unit_only");
  });

  it("does not make a network call for malformed access tokens", async () => {
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
    expect(await findActiveCardByToken("../invalid")).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("looks up only the SHA-256 digest and rejects expired rows defensively", async () => {
    const token = issueCardToken();
    const example = {
      id: "test-uuid",
      template_slug: "make-a-wish",
      recipient_name: "Morgan",
      sender_name: "Riley",
      message: "A private birthday note",
      available_at: "2026-11-19T22:00:00Z",
      expires_at: "2026-11-19T23:00:00Z",
    };
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([example]), { status: 200 }),
    );
    vi.stubGlobal("fetch", mockFetch);
    expect(await findActiveCardByToken(token)).toBeNull();

    const [url, init] = mockFetch.mock.calls[0] as [URL, RequestInit];
    expect(url.searchParams.get("access_token_hash")).toBe(`eq.${hashCardToken(token)}`);
    expect(url.searchParams.get("expires_at")).toBe(`gt.${FIXED_NOW}`);
    expect(url.toString()).not.toContain(token);
    expect(init.cache).toBe("no-store");
  });

  it("returns the correct content when a card is active", async () => {
    const token = issueCardToken();
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify([{
      id: "test-uuid",
      template_slug: "make-a-wish",
      recipient_name: "Morgan",
      sender_name: "Riley",
      message: "Enjoy your birthday!",
      available_at: "2026-11-19T20:00:00Z",
      expires_at: "2026-11-20T20:00:00Z",
    }])));
    vi.stubGlobal("fetch", mockFetch);

    expect(await findActiveCardByToken(token)).toEqual({
      id: "test-uuid",
      templateSlug: "make-a-wish",
      recipientName: "Morgan",
      senderName: "Riley",
      message: "Enjoy your birthday!",
      expiresAt: "2026-11-20T20:00:00Z",
    });
  });

  it("does not echo sensitive response data on storage errors", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Private message should not be logged" }), { status: 500 }),
    );
    vi.stubGlobal("fetch", mockFetch);
    await expect(findActiveCardByToken(issueCardToken()))
      .rejects.toThrow("Card storage request failed.");
  });
});
