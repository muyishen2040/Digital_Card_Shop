import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { isCreatorAuthorized } from "./creator-auth";

describe("pilot creator authorization", () => {
  const secret = "high-entropy-independent-test-secret-12345678";
  it("requires the exact credential", () => {
    expect(isCreatorAuthorized(secret, secret)).toBe(true);
    expect(isCreatorAuthorized(secret + " ", secret)).toBe(false);
    expect(isCreatorAuthorized("wrong", secret)).toBe(false);
  });
  it("fails closed on missing or insecure configuration", () => {
    expect(isCreatorAuthorized(secret, undefined)).toBe(false);
    expect(isCreatorAuthorized("demo", "demo")).toBe(false);
    expect(isCreatorAuthorized(null, secret)).toBe(false);
    expect(isCreatorAuthorized("a".repeat(513), secret)).toBe(false);
  });
});
