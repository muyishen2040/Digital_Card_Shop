import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  createCardInstance: vi.fn(), publicCreationConfigured: vi.fn(),
  getClientIp: vi.fn(), verifyTurnstile: vi.fn(), reservePublicCardSlot: vi.fn(),
}));
vi.mock("@/server/cards/card-instances", () => ({ createCardInstance: mocks.createCardInstance }));
vi.mock("@/server/cards/public-creation", () => ({
  publicCreationConfigured: mocks.publicCreationConfigured,
  getClientIp: mocks.getClientIp,
  verifyTurnstile: mocks.verifyTurnstile,
  reservePublicCardSlot: mocks.reservePublicCardSlot,
}));
vi.mock("server-only", () => ({}));
import { POST } from "./route";
import { batchOneCities } from "@/lib/cards/postcards/batch-01";

const draft = { templateSlug: "same-sky", recipientName: "Jamie", senderName: "Taylor", message: "Hello!", ttlHours: 24, turnstileToken: "valid-token" };
const request = (data: object = draft, origin = "https://cards.test") => new Request("https://cards.test/api/public/cards", {
  method: "POST",
  headers: { origin, "content-type": "application/json", "x-forwarded-for": "192.0.2.1" },
  body: JSON.stringify(data),
});
beforeEach(() => {
  Object.values(mocks).forEach((mock) => mock.mockReset());
  mocks.publicCreationConfigured.mockReturnValue(true);
  mocks.getClientIp.mockReturnValue("192.0.2.1");
  mocks.verifyTurnstile.mockResolvedValue(true);
  mocks.reservePublicCardSlot.mockResolvedValue(true);
  mocks.createCardInstance.mockResolvedValue({ accessToken: "A".repeat(43), expiresAt: "2026-11-21T00:00:00Z" });
});
afterEach(() => vi.restoreAllMocks());

describe("public card creation", () => {
  it("is disabled until all safeguards are provisioned", async () => {
    mocks.publicCreationConfigured.mockReturnValue(false);
    expect((await POST(request())).status).toBe(503);
    expect(mocks.verifyTurnstile).not.toHaveBeenCalled();
  });
  it("rejects cross-origin requests without calling services", async () => {
    expect((await POST(request(draft, "https://evil.test"))).status).toBe(403);
    expect(mocks.verifyTurnstile).not.toHaveBeenCalled();
  });
  it("rejects invalid drafts before paid verification or storage", async () => {
    expect((await POST(request({ ...draft, message: "X".repeat(601) }))).status).toBe(400);
    expect(mocks.verifyTurnstile).not.toHaveBeenCalled();
  });
  it("rejects missing captcha and missing verified client address", async () => {
    expect((await POST(request({ ...draft, turnstileToken: "" }))).status).toBe(400);
    mocks.getClientIp.mockReturnValue(null);
    expect((await POST(request())).status).toBe(403);
    expect(mocks.createCardInstance).not.toHaveBeenCalled();
  });
  it("checks human verification before reserving a slot", async () => {
    mocks.verifyTurnstile.mockResolvedValue(false);
    expect((await POST(request())).status).toBe(403);
    expect(mocks.reservePublicCardSlot).not.toHaveBeenCalled();
    expect(mocks.createCardInstance).not.toHaveBeenCalled();
  });
  it("returns 429 if the atomic quota is exhausted", async () => {
    mocks.reservePublicCardSlot.mockResolvedValue(false);
    const result = await POST(request());
    expect(result.status).toBe(429);
    expect(result.headers.get("Retry-After")).toBe("3600");
    expect(mocks.createCardInstance).not.toHaveBeenCalled();
  });
  it("returns a private relative URL after verification and quota reservation", async () => {
    const result = await POST(request());
    expect(result.status).toBe(201);
    expect(result.headers.get("cache-control")).toContain("no-store");
    expect(await result.json()).toEqual({ path: "/c/" + "A".repeat(43), expiresAt: "2026-11-21T00:00:00Z" });
    expect(mocks.verifyTurnstile).toHaveBeenCalledWith("valid-token", "cards.test", "192.0.2.1");
    expect(mocks.reservePublicCardSlot).toHaveBeenCalledWith("192.0.2.1");
    expect(mocks.createCardInstance).toHaveBeenCalledOnce();
  });
  it("creates the Hong Kong template through the same verification and quota flow", async () => {
    const result = await POST(request({ ...draft, templateSlug: "city-postcard-hong-kong" }));
    expect(result.status).toBe(201);
    expect(mocks.verifyTurnstile).toHaveBeenCalledOnce();
    expect(mocks.reservePublicCardSlot).toHaveBeenCalledOnce();
    expect(mocks.createCardInstance).toHaveBeenCalledWith(expect.objectContaining({
      templateSlug: "city-postcard-hong-kong", message: draft.message,
    }));
  });
  it("persists the chosen text size through the guarded creation route", async () => {
    expect((await POST(request({ ...draft, textSize: "small" }))).status).toBe(201);
    expect(mocks.createCardInstance).toHaveBeenCalledWith(expect.objectContaining({ textSize: "small" }));
  });
  it("rejects an invalid text size before verification or quota reservation", async () => {
    expect((await POST(request({ ...draft, textSize: "huge" }))).status).toBe(400);
    expect(mocks.verifyTurnstile).not.toHaveBeenCalled();
    expect(mocks.reservePublicCardSlot).not.toHaveBeenCalled();
  });
  it("creates Taipei through the existing verified creation flow", async () => {
    expect((await POST(request({ ...draft, templateSlug: "city-postcard-taipei", textSize: "small" }))).status).toBe(201);
    expect(mocks.verifyTurnstile).toHaveBeenCalledOnce();
    expect(mocks.reservePublicCardSlot).toHaveBeenCalledOnce();
    expect(mocks.createCardInstance).toHaveBeenCalledWith(expect.objectContaining({ templateSlug: "city-postcard-taipei", textSize: "small" }));
  });
  it.each(batchOneCities.map((city) => city.assetKey))(
    "creates %s via the same verification and quota path",
    async (assetKey) => {
      const slug = `city-postcard-${assetKey}`;
      expect((await POST(request({ ...draft, templateSlug: slug, textSize: "medium" }))).status).toBe(201);
      expect(mocks.verifyTurnstile).toHaveBeenCalledOnce();
      expect(mocks.reservePublicCardSlot).toHaveBeenCalledOnce();
      expect(mocks.createCardInstance).toHaveBeenCalledWith(
        expect.objectContaining({ templateSlug: slug, textSize: "medium" }),
      );
    },
  );

  it("fails closed if verification or quota storage is unavailable", async () => {
    mocks.reservePublicCardSlot.mockRejectedValue(new Error("database down"));
    expect((await POST(request())).status).toBe(503);
    expect(mocks.createCardInstance).not.toHaveBeenCalled();
  });
});
