import "server-only";
import { storageConfig } from "./storage-config";

/** One small transaction per batch to avoid large, long-running deletes. */
export const RETENTION_BATCH_SIZE = 200;
export const RETENTION_MAX_BATCHES = 20;

export type RetentionSummary = Readonly<{
  deleted: number;
  batches: number;
  mayHaveBacklog: boolean;
}>;

/**
 * Delete only expired card instances. Never fetch or log personal messages,
 * access_token_hash values, names, or bearer links. Request only deleted IDs,
 * and discard them after counting the affected rows.
 *
 * This function is intentionally invoked only by an authorized cron route.
 * A fixed cutoff makes retry behavior deterministic. Subsequent runs are safe.
 */
export async function purgeExpiredCardInstances(now: Date): Promise<RetentionSummary> {
  if (Number.isNaN(now.getTime())) throw new Error("Invalid retention cutoff.");
  const { url: base, secret } = storageConfig();
  const cutoff = now.toISOString();
  let deleted = 0;
  let batches = 0;

  for (let i = 0; i < RETENTION_MAX_BATCHES; i += 1) {
    const url = new URL("/rest/v1/card_instances", base);
    url.searchParams.set("expires_at", `lte.${cutoff}`);
    url.searchParams.set("select", "id");
    // PostgREST requires an explicit unique order for bounded DELETE.
    url.searchParams.set("order", "id.asc");
    url.searchParams.set("limit", String(RETENTION_BATCH_SIZE));

    const response = await fetch(url, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        apikey: secret,
        Prefer: "return=representation",
      },
    });
    if (!response.ok) {
      // Error response bodies can contain sensitive data; never surface them.
      throw new Error("Card retention storage request failed.");
    }

    const result: unknown = await response.json();
    if (!Array.isArray(result) || result.length > RETENTION_BATCH_SIZE ||
      !result.every((row: unknown) => row && typeof row === "object" &&
        Object.keys(row).length === 1 && typeof (row as { id?: unknown }).id === "string")) {
      throw new Error("Unexpected card retention storage response.");
    }

    deleted += result.length;
    batches += 1;
    if (result.length < RETENTION_BATCH_SIZE) {
      return { deleted, batches, mayHaveBacklog: false };
    }
  }

  return { deleted, batches, mayHaveBacklog: true };
}
