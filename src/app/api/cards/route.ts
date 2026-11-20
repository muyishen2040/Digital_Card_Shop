import { createCardInstance } from "@/server/cards/card-instances";
import { isCreatorAuthorized } from "@/server/cards/creator-auth";
import { validateCardDraft } from "@/lib/cards/instance-model";
import type { CreateCardDraft } from "@/lib/cards/instance-model";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};
const reply = (body: object, status: number) => Response.json(body, { status, headers: HEADERS });

/** Pilot-only publishing; public anonymous writes are intentionally disabled. */
export async function POST(request: Request): Promise<Response> {
  const configured = process.env.CARD_CREATOR_ACCESS_CODE;
  if (!configured || configured.length < 24) return reply({ error: "Card creation is not enabled yet." }, 503);

  try {
    const origin = request.headers.get("origin");
    if (!origin || new URL(origin).origin !== new URL(request.url).origin) {
      return reply({ error: "Request origin is not allowed." }, 403);
    }
  } catch {
    return reply({ error: "Request origin is not allowed." }, 403);
  }

  const header = request.headers.get("authorization");
  if (!isCreatorAuthorized(header?.startsWith("Bearer ") ? header.slice(7) : null, configured)) {
    return reply({ error: "Creator access code is incorrect." }, 401);
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return reply({ error: "Expected JSON card content." }, 415);
  }
  if (Number(request.headers.get("content-length")) > 4096) {
    return reply({ error: "Card content is too large." }, 413);
  }

  try {
    const raw = await request.text();
    if (raw.length > 4096) return reply({ error: "Card content is too large." }, 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return reply({ error: "Enter valid card details." }, 400);
    }
    const draft = validateCardDraft(parsed as CreateCardDraft);
    const created = await createCardInstance(draft);
    return reply({ path: `/c/${created.accessToken}`, expiresAt: created.expiresAt }, 201);
  } catch (error) {
    if (error instanceof SyntaxError) return reply({ error: "Enter valid JSON." }, 400);
    if (error instanceof Error && /required|valid card|characters|24, 48, or 72/.test(error.message)) {
      return reply({ error: error.message }, 400);
    }
    // No logging of private messages, bearer tokens or storage responses.
    return reply({ error: "Unable to create this card right now." }, 503);
  }
}
export async function GET() { return reply({ error: "Method not allowed." }, 405); }
