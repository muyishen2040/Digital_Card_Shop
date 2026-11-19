import { describe, expect, it } from "vitest";
import { hashCardToken, issueCardToken } from "./card-token";

describe("private card access tokens", () => {
  it("issues unpredictable URL-safe tokens and stores only deterministic SHA-256 hashes", () => {
    const first = issueCardToken();
    const second = issueCardToken();
    expect(first).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(second).not.toBe(first);
    const hashed = hashCardToken(first);
    expect(hashed).toMatch(/^[0-9a-f]{64}$/);
    expect(hashed).toBe(hashCardToken(first));
    expect(hashed).not.toContain(first);
  });
  it("rejects malformed tokens before a storage lookup", () => {
    expect(hashCardToken("")).toBeNull();
    expect(hashCardToken("broken/token")).toBeNull();
    expect(hashCardToken("../".repeat(15))).toBeNull();
  });
});
