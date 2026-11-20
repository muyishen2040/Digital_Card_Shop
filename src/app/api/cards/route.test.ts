import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ createCardInstance: vi.fn() }));
vi.mock("@/server/cards/card-instances", () => mocks);
vi.mock("server-only", () => ({}));
import { POST } from "./route";

const code = "pilot-creator-code-for-unit-tests-123456789";
const draft = { templateSlug: "same-sky", recipientName: "Jamie", senderName: "Taylor", message: "Hello!", ttlHours: 24 };
function request(authorization = code, origin = "https://cards.test", data: object = draft) {
  return new Request("https://cards.test/api/cards", {
    method: "POST",
    headers: { origin, "content-type": "application/json", authorization: `Bearer ${authorization}` },
    body: JSON.stringify(data),
  });
}
beforeEach(() => {
  vi.stubEnv("CARD_CREATOR_ACCESS_CODE", code);
  mocks.createCardInstance.mockReset();
  mocks.createCardInstance.mockResolvedValue({
    id: "test-id", accessToken: "A".repeat(43), expiresAt: "2026-11-21T00:00:00Z",
  });
});
afterEach(() => vi.unstubAllEnvs());

describe("private pilot creation API", () => {
  it("fails closed if creator access is not configured", async () => {
    vi.stubEnv("CARD_CREATOR_ACCESS_CODE", "");
    expect((await POST(request())).status).toBe(503);
    expect(mocks.createCardInstance).not.toHaveBeenCalled();
  });
  it("rejects incorrect code and foreign origin", async () => {
    expect((await POST(request("wrong"))).status).toBe(401);
    expect((await POST(request(code, "https://attacker.example"))).status).toBe(403);
    expect(mocks.createCardInstance).not.toHaveBeenCalled();
  });
  it("validates card data before writing", async () => {
    expect((await POST(request(code, "https://cards.test", { ...draft, message: "x".repeat(601) }))).status).toBe(400);
    expect(mocks.createCardInstance).not.toHaveBeenCalled();
  });
  it("returns a private relative link only after authorization", async () => {
    const response = await POST(request());
    expect(response.status).toBe(201);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(await response.json()).toEqual({ path: `/c/${"A".repeat(43)}`, expiresAt: "2026-11-21T00:00:00Z" });
    expect(mocks.createCardInstance).toHaveBeenCalledOnce();
    expect(mocks.createCardInstance.mock.calls[0][0]).toMatchObject(draft);
  });
});
