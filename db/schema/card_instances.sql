-- HISTORICAL BOOTSTRAP SNAPSHOT: this original schema is not the deployed schema.
-- Do NOT execute it on an existing Supabase project. Changes since bootstrap
-- (quota, allowed templates, text sizes) are tracked in supabase/migrations/.
-- Refer to db/README.md for the current migration and deployment runbook.
-- Digital Card Shop: server-only personalized card instances.
-- Apply only to the dedicated Digital Card Shop Supabase project.
-- This SQL is NOT automatically applied by a GitHub/Vercel deployment.
--
-- Use an actual CLI-generated migration after confirming the target project.

create table public.card_instances (
  id uuid primary key default gen_random_uuid(),
  template_slug text not null
    check (template_slug in ('little-sunshine', 'same-sky', 'make-a-wish')),
  recipient_name text not null
    check (char_length(btrim(recipient_name)) between 1 and 40),
  sender_name text not null
    check (char_length(btrim(sender_name)) between 1 and 40),
  message text not null
    check (char_length(btrim(message)) between 1 and 600),
  -- Never persist a raw capability token.
  access_token_hash text not null unique
    check (access_token_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  available_at timestamptz not null default now(),
  expires_at timestamptz not null,
  constraint card_access_window check (
    expires_at >= available_at + interval '24 hours'
    and expires_at <= available_at + interval '72 hours'
  )
);

create index card_instances_expiry_idx on public.card_instances (expires_at);

-- Access only through backend code with a server-only secret key.
alter table public.card_instances enable row level security;
revoke all on table public.card_instances from anon, authenticated, public;
grant select, insert, update, delete on table public.card_instances to service_role;

-- Intentionally no anon/authenticated policies.
comment on table public.card_instances is
  'Private per-recipient card instances with SHA-256 bearer token hashes and a server-checked access window.';

-- Scheduled deletion is separate from server-enforced expiration.
-- TODO: Create and test an expired-row retention job before public launch.
