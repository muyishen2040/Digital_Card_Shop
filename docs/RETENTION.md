# Expired-card cleanup

Digital Card Shop refuses expired private links on every request to `/c/[token]`, regardless of whether the underlying record has been deleted. A separate scheduled job permanently removes expired records from Supabase to limit how long private messages are retained.

## Schedule and authorization

The [`vercel.json`](../vercel.json) schedule calls `GET /api/cron/expire-cards` daily at **03:15 UTC**, in Vercel Production. Vercel Hobby may invoke the job later within the scheduled hour; Preview deployments do not run it.

Set a unique, cryptographically random `CRON_SECRET` (at least 32 characters) as a sensitive Production-only environment variable. Vercel sends it as `Authorization: Bearer <CRON_SECRET>`. The route checks authorization before accessing Supabase. Missing or short configuration returns HTTP 503; an invalid bearer token returns HTTP 401. Never reuse another service secret or place this value in source control, logs, screenshots, or URLs.

## Deletion behavior

The server selects records with `expires_at` at or before a fixed UTC cutoff, deleting at most **200 rows per batch** and **20 batches per invocation**. Only deleted row IDs are requested for counting; names, personal notes, and access tokens are never logged. Running the job again is safe. If the final batch is full, the job reports `backlog_possible`; the next run can continue deleting expired records.

The job emits one structured `card_retention_cleanup` log with status `ok`, `backlog_possible`, or `failed`, plus non-sensitive counts and duration where available. Storage failures return HTTP 503 without logging raw database responses.

## Operations and verification

1. Check **Vercel → Digital Card Shop → Cron Jobs** for the Production schedule and execution history. The existence of an API route does not prove that scheduled invocations succeed.
2. Search **Functions Logs** for `card_retention_cleanup`. Investigate missing runs, failures, and `backlog_possible` results.
3. With controlled, non-sensitive test data, verify that an expired row is deleted while an active row remains. Confirm that a fresh request for an expired private link is already rejected before cleanup.
4. After changes to the schedule or handler, run `npm run check` and `npm run build` and verify the Production configuration.

To pause scheduled deletion, remove the cron entry from `vercel.json` and deploy the change. To stop authorized deletion immediately during an incident, remove `CRON_SECRET` from Production (the route fails closed). Deletion cannot be undone through the application; database backups are a separate responsibility.

The original feature design and rollout notes are available in [the archive](archive/expired-card-retention.md).
