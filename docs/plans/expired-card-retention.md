# Expired-card retention and monitoring

**Status: Implemented — operational runbook with historical launch instructions.** The expiration-cleanup cron route and schedule are deployed. Recheck deployment configuration and real cron history before asserting successful execution; the original pre-merge setup steps below describe release preparation, not remaining work.

## Why this exists

The recipient route already refuses an expired bearer link (`expires_at <= now()`), but the underlying message otherwise persists in Supabase. This change adds a separate data-retention job to permanently delete expired rows. It does **not** change link TTLs or the existing Supabase schema.

## Schedule and ownership

- Vercel reads `vercel.json` and invokes `GET /api/cron/expire-cards` **on Production only** daily at **03:15 UTC**. On Vercel Hobby, invocations may be delayed within the scheduled hour.
- Vercel sends `Authorization: Bearer <CRON_SECRET>`; the route rejects missing/mismatched secrets before any database access.
- Set `CRON_SECRET` as a **Sensitive, Production-only** Vercel environment variable. Generate an independent value from a cryptographically secure 32+ byte source; **do not reuse** `SUPABASE_SECRET_KEY` or the sender pilot `CARD_CREATOR_ACCESS_CODE`.
- The secret is never rendered in client JavaScript. Do not include it in GitHub, PR comments, screenshots, issue trackers, or request URLs.
- Provision the secret **before** merging this PR; a missing or short secret causes the cron endpoint to fail closed with HTTP 503 and no deletion.
- This work requires no database migrations. The existing `card_instances(expires_at)` index, RLS, and service-role-only grants remain unchanged.

## Retention algorithm

- A fixed UTC cutoff is computed once per run. Only rows with `expires_at <= cutoff` are eligible.
- The server sends a PostgREST `DELETE` filtering by expiration, ordered by unique `id`, at most **200 rows per transaction**.
- It sets `select=id` and `Prefer: return=representation` to count only the actually deleted IDs. Personal messages, sender/recipient names, and bearer token hashes are never selected, logged, or sent to the browser.
- Each invocation handles up to **20 batches / 4,000 deletions**. A full final batch produces `backlog_possible` (could include an exact 4,000-row boundary). Later scheduled invocations safely continue. The job is idempotent: running again won't re-delete removed rows.
- If the Supabase request fails or returns an unexpected shape, the endpoint returns HTTP 503. It does not retry blindly or reveal sensitive response bodies.

## Privacy-safe observability

Each authorized run emits one structured Vercel Function log containing only:

```json
{"event":"card_retention_cleanup","status":"ok","deleted":3,"batches":1,"durationMs":110}
```

Possible statuses are `ok`, `backlog_possible` (warning), and `failed` (error). Error logs intentionally omit raw exceptions, SQL, HTTP responses, row IDs, personal messages, and tokens.

Inspect job execution in **Vercel → Digital Card Shop → Cron Jobs**, and filter **Functions Logs** for `card_retention_cleanup`. Investigate `failed`, `backlog_possible`, HTTP 503, or a missing daily run. Logs alone cannot detect a schedule that never fires; also check the cron execution history. A future production monitoring milestone may add external alerting for missing runs.

## Verification plan

1. CI must pass lint, TypeScript, unit tests, and Next.js build. Tests check authorization, bounded batches, actual deletion counts, and no secret/message logging.
2. Confirm the new Preview endpoint responds with 503 when `CRON_SECRET` is absent, **without deleting anything**. Vercel Cron is not scheduled on Preview.
3. Verify `CRON_SECRET` exists as a Sensitive **Production-only** variable before merging; `CARD_CREATOR_ACCESS_CODE` remains separate.
4. After merging, inspect the Vercel Cron registration and the first scheduled run. Confirm a successful aggregate log. To verify actual deletion, use a controlled expired test row (do not modify user messages or active cards) and check its removal; concurrently verify active rows remain.
5. Check that existing valid recipient links still work, expired/invalid links still return the same unavailable page, and cleanup never logs raw request/response data.

## Backout

To pause scheduled deletions, revert the `vercel.json` cron entry in a new PR and deploy it. To stop deletion immediately during an incident, remove `CRON_SECRET` from Production (the handler then fails closed), then investigate before re-enabling. **Deleted rows are not recoverable through the application**; database backups and their retention policies are a separate operational concern.

## References

- [Vercel cron configuration](https://vercel.com/docs/project-configuration/vercel-json)
- [PostgREST limited DELETE](https://docs.postgrest.org/en/stable/references/api/tables_views.html#limited-update-delete)
- [Supabase data-deletion strategies](https://supabase.com/docs/guides/database/postgres/data-deletion)
