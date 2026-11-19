-- Digital Card Shop: private personalized card instances (Phase 2 foundation).
-- Apply ONLY to a dedicated Digital Card Shop Supabase project. This file is
-- intentionally staged as a schema proposal; it has NOT been applied remotely.
--
-- Use a new Supabase CLI migration after a dedicated project is provisioned.
-- Never apply it to unrelated connected Supabase projects.

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
  -- Store only SHA-256(token), never the bearer token itself.
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

-- The table is in the exposed public schema for privileged server-side REST
-- access only. A secret key bypasses RLS, so it must NEVER reach browser code.
alter table public.card_instances enable row level security;

-- Supabase legacy projects may grant exposed-table access by default.
revoke all on table public.card_instances from anon, authenticated, public;
grant select, insert, update, delete on table public.card_instances to service_role;

-- Intentionally no anon/authenticated policies. All card reads/writes must
-- pass through trusted server code that validates identity/capabilities.
comment on table public.card_instances is
  'Private greeting-card instances; hashed bearer tokens, server-enforced availability and expiration.';

-- Cleanup (future scheduled job, NOT installed by this PR):
-- delete from public.card_instances where expires_at <= now();
