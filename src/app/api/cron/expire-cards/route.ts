import { createHash, timingSafeEqual } from "node:crypto";
import { purgeExpiredCardInstances } from "@/server/cards/card-retention";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function respond(status: number, payload: object): Response {
  return Response.json(payload, { status, headers: HEADERS });
}

/** Exact, constant-time bearer check, independent of the creator access code. */
function isAuthorized(value: string | null, configured: string): boolean {
  if (!value?.startsWith("Bearer ") || value.length > 600) return false;
  const received = value.slice("Bearer ".length);
  const digest = (str: string) => createHash("sha256").update(str, "utf8").digest();
  return timingSafeEqual(digest(received), digest(configured));
}

/** Vercel Cron invokes GET only on production, once per day. */
export async function GET(request: Request): Promise<Response> {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || cronSecret.length < 32) {
    return respond(503, { status: "unconfigured" });
  }
  if (!isAuthorized(request.headers.get("authorization"), cronSecret)) {
    return respond(401, { status: "unauthorized" });
  }

  const started = Date.now();
  try {
    const summary = await purgeExpiredCardInstances(new Date());
    // Only operational aggregates. No names, notes, row IDs or access tokens.
    const event = {
      event: "card_retention_cleanup",
      status: summary.mayHaveBacklog ? "backlog_possible" : "ok",
      deleted: summary.deleted,
      batches: summary.batches,
      durationMs: Date.now() - started,
    };
    if (summary.mayHaveBacklog) console.warn(JSON.stringify(event));
    else console.info(JSON.stringify(event));

    return respond(200, {
      status: event.status,
      deleted: summary.deleted,
      batches: summary.batches,
    });
  } catch {
    // Never log thrown errors or raw Supabase responses, which might be sensitive.
    console.error(JSON.stringify({
      event: "card_retention_cleanup",
      status: "failed",
      durationMs: Date.now() - started,
    }));
    return respond(503, { status: "failed" });
  }
}
