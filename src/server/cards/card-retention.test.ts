import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { purgeExpiredCardInstances, RETENTION_BATCH_SIZE, RETENTION_MAX_BATCHES } from "./card-retention";

vi.mock("server-only", () => ({}));
const NOW = new Date("2026-11-20T08:00:00.000Z");

beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "https://cards-test.supabase.co");
  vi.stubEnv("SUPABASE_SECRET_KEY", "sb_secret_test_retention_only");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const response = (items: unknown[], status = 200) =>
  new Response(JSON.stringify(items), { status });

describe("expired card retention", () => {
  it("safely handles zero expired rows", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response([]));
    vi.stubGlobal("fetch", fetchMock);
    expect(await purgeExpiredCardInstances(NOW)).toEqual({
      deleted: 0, batches: 1, mayHaveBacklog: false,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("sends a bounded DELETE for expired cards and requests ID only", async () => {
    const fetchMock = vi.fn().mockResolvedValue(response([{ id: "deleted-uuid" }]));
    vi.stubGlobal("fetch", fetchMock);
    expect(await purgeExpiredCardInstances(NOW)).toEqual({
      deleted: 1, batches: 1, mayHaveBacklog: false,
    });
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.pathname).toBe("/rest/v1/card_instances");
    expect(url.searchParams.get("expires_at")).toBe(`lte.${NOW.toISOString()}`);
    expect(url.searchParams.get("select")).toBe("id");
    expect(url.searchParams.get("limit")).toBe(String(RETENTION_BATCH_SIZE));
    expect(url.searchParams.get("order")).toBe("id.asc");
    expect(init.method).toBe("DELETE");
    expect(init.cache).toBe("no-store");
    expect(new Headers(init.headers).get("apikey")).toBe("sb_secret_test_retention_only");
    expect(new Headers(init.headers).get("Prefer")).toBe("return=representation");
    expect(url.toString()).not.toContain("access_token");
    expect(url.toString()).not.toContain("message");
  });

  it("repeats capped batches and reports exact affected-row counts", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(Array.from({ length: RETENTION_BATCH_SIZE }, (_, i) => ({ id: String(i) }))))
      .mockResolvedValueOnce(response([{ id: "extra" }, { id: "another" }]));
    vi.stubGlobal("fetch", fetchMock);
    expect(await purgeExpiredCardInstances(NOW)).toEqual({
      deleted: RETENTION_BATCH_SIZE + 2, batches: 2, mayHaveBacklog: false,
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("stops after the maximum batches and warns there might be more", async () => {
    const fetchMock = vi.fn().mockImplementation(async () =>
      response(Array.from({ length: RETENTION_BATCH_SIZE }, (_, i) => ({ id: String(i) }))),
    );
    vi.stubGlobal("fetch", fetchMock);
    expect(await purgeExpiredCardInstances(NOW)).toEqual({
      deleted: RETENTION_BATCH_SIZE * RETENTION_MAX_BATCHES,
      batches: RETENTION_MAX_BATCHES,
      mayHaveBacklog: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(RETENTION_MAX_BATCHES);
  });

  it("fails closed before network access when Supabase is not configured", async () => {
    vi.stubEnv("SUPABASE_SECRET_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(purgeExpiredCardInstances(NOW)).rejects.toThrow("not configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("never forwards a sensitive Supabase error body", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "A very private greeting", token: "secret_token" }), { status: 500 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    await expect(purgeExpiredCardInstances(NOW)).rejects.toThrow("Card retention storage request failed.");
  });

  it("rejects unexpected storage shapes without processing private fields", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response([{ id: "test", recipient_name: "private" }])));
    await expect(purgeExpiredCardInstances(NOW)).rejects.toThrow("Unexpected card retention storage response.");
  });

  it("does not allow an invalid deletion cutoff", async () => {
    await expect(purgeExpiredCardInstances(new Date("bad"))).rejects.toThrow("Invalid retention cutoff.");
  });
});
