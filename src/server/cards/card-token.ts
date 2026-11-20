import { createHash, randomBytes } from "node:crypto";

// 32 bytes of entropy, represented as a 43-character URL-safe bearer capability.
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function issueCardToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashCardToken(token: string): string | null {
  if (!TOKEN_PATTERN.test(token)) return null;
  return createHash("sha256").update(token, "utf8").digest("hex");
}
