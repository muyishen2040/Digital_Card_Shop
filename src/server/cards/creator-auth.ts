import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

/** Independent high-entropy pilot credential; never reuse the database secret. */
export function isCreatorAuthorized(provided: string | null, configured: string | undefined): boolean {
  if (!configured || configured.length < 24 || !provided || provided.length > 512) return false;
  const digest = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(provided), digest(configured));
}
