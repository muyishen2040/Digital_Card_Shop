import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ purgeExpiredCardInstances: vi.fn() }));
vi.mock("@/server/cards/card-retention", () => mocks);
vi.mock("server-only", () => ({}));
import { GET } from "./route";

const SECRET = "cron-secret-for-tests-1234567890-abcdefghij";
const request = (value?: string) => new Request("https://cards.test/api/cron/expire-cards", {
  headers: value === undefined ? {} : { Authorization: `Bearer ${value}` },
});
let info: ReturnType<typeof vi.spyOn>;
let warn: ReturnType<typeof vi.spyOn>;
let error: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubEnv("CRON_SECRET", SECRET);
  mocks.purgeExpiredCardInstances.mockReset();
  mocks.purgeExpiredCardInstances.mockResolvedValue({ deleted: 2, batches: 1, mayHaveBacklog: false });
  info = vi.spyOn(console, "info").mockImplementation(() => {});
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  error = vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("cron-only expired-card cleanup endpoint", () => {
  it("does not query storage when cron auth is missing", async () => {
    expect((await GET(request())).status).toBe(401);
    expect(mocks.purgeExpiredCardInstances).not.toHaveBeenCalled();
    expect(info).not.toHaveBeenCalled();
  });

  it("rejects wrong codes including lookalikes", async () => {
    for (const code of [SECRET.slice(0, -1), SECRET + "x", "incorrect"]) {
      expect((await GET(request(code))).status).toBe(401);
    }
    expect(mocks.purgeExpiredCardInstances).not.toHaveBeenCalled();
  });

  it("fails closed when the production secret is missing or too short", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await GET(request(SECRET))).status).toBe(503);
    vi.stubEnv("CRON_SECRET", "short");
    expect((await GET(request("short"))).status).toBe(503);
    expect(mocks.purgeExpiredCardInstances).not.toHaveBeenCalled();
  });

  it("returns only aggregate metrics and logs no personal content", async () => {
    const result = await GET(request(SECRET));
    expect(result.status).toBe(200);
    expect(result.headers.get("cache-control")).toContain("no-store");
    expect(await result.json()).toEqual({ status: "ok", deleted: 2, batches: 1 });
    expect(mocks.purgeExpiredCardInstances).toHaveBeenCalledOnce();
    expect(info).toHaveBeenCalledOnce();
    const log = String(info.mock.calls[0][0]);
    expect(log).toContain("card_retention_cleanup");
    expect(log).not.toContain(SECRET);
    expect(log).not.toContain("recipient");
    expect(log).not.toContain("message");
  });

  it("warns when a bounded cleanup may leave a backlog", async () => {
    mocks.purgeExpiredCardInstances.mockResolvedValueOnce({
      deleted: 4000, batches: 20, mayHaveBacklog: true,
    });
    const result = await GET(request(SECRET));
    expect(result.status).toBe(200);
    expect(await result.json()).toEqual({ status: "backlog_possible", deleted: 4000, batches: 20 });
    expect(warn).toHaveBeenCalledOnce();
  });

  it("does not leak storage errors, private messages or tokens on failure", async () => {
    mocks.purgeExpiredCardInstances.mockRejectedValueOnce(
      new Error("customer message and private_token that must not leak"),
    );
    const result = await GET(request(SECRET));
    expect(result.status).toBe(503);
    expect(await result.json()).toEqual({ status: "failed" });
    const log = String(error.mock.calls[0][0]);
    expect(log).not.toContain("customer message");
    expect(log).not.toContain("private_token");
    expect(log).not.toContain(SECRET);
  });
});
