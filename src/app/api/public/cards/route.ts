import { createCardInstance } from "@/server/cards/card-instances";
import { getClientIp, publicCreationConfigured, reservePublicCardSlot, verifyTurnstile } from "@/server/cards/public-creation";
import { validateCardDraft } from "@/lib/cards/instance-model";
import type { CreateCardDraft } from "@/lib/cards/instance-model";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};
const reply = (body: object, status: number, extra?: Record<string, string>) =>
  Response.json(body, { status, headers: { ...HEADERS, ...extra } });

/** Anonymous creation requires verified human interaction and atomic quotas. */
export async function POST(request: Request): Promise<Response> {
  if (!publicCreationConfigured()) return reply({ error: "Public card creation is not enabled yet." }, 503);

  let hostname: string;
  try {
    const target = new URL(request.url);
    if (!request.headers.get("origin") || new URL(request.headers.get("origin")!).origin !== target.origin) {
      return reply({ error: "Request origin is not allowed." }, 403);
    }
    hostname = target.hostname;
  } catch {
    return reply({ error: "Request origin is not allowed." }, 403);
  }

  const ip = getClientIp(request);
  if (!ip) return reply({ error: "Unable to verify this request." }, 403);
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return reply({ error: "Expected JSON card content." }, 415);
  }
  if (Number(request.headers.get("content-length")) > 8192) {
    return reply({ error: "Card content is too large." }, 413);
  }

  let draft: ReturnType<typeof validateCardDraft>;
  let token: string;
  try {
    const raw = await request.text();
    if (raw.length > 8192) return reply({ error: "Card content is too large." }, 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return reply({ error: "Enter valid card details." }, 400);
    }
    const input = parsed as Record<string, unknown>;
    if (typeof input.turnstileToken !== "string" || input.turnstileToken.length < 1 || input.turnstileToken.length > 2048) {
      return reply({ error: "Complete the verification to create your card." }, 400);
    }
    token = input.turnstileToken;
    draft = validateCardDraft(input as unknown as CreateCardDraft);
  } catch (error) {
    if (error instanceof SyntaxError) return reply({ error: "Enter valid JSON." }, 400);
    if (error instanceof Error && /required|valid card|characters|24, 48, or 72/.test(error.message)) {
      return reply({ error: error.message }, 400);
    }
    return reply({ error: "Unable to process this card." }, 400);
  }

  try {
    if (!await verifyTurnstile(token, hostname, ip)) {
      return reply({ error: "Verification failed or expired. Please try again." }, 403);
    }
    if (!await reservePublicCardSlot(ip)) {
      return reply({ error: "Today's free-card limit has been reached. Please try again later." }, 429, { "Retry-After": "3600" });
    }
    const created = await createCardInstance(draft);
    return reply({ path: "/c/" + created.accessToken, expiresAt: created.expiresAt }, 201);
  } catch {
    // Do not log user text, IP, verification tokens, or private links.
    return reply({ error: "Unable to create the card right now. Please try again later." }, 503);
  }
}

export async function GET() {
  return reply({ error: "Method not allowed." }, 405);
}
