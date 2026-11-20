-- Anonymous card creation quota. Apply only to the dedicated Digital Card Shop project.
-- Not applied automatically by deploying a PR.
-- Only service_role may read or modify counters; never expose IP addresses or hashes.
create table public.card_creation_counters (
  bucket_key text primary key,
  uses integer not null check (uses >= 0),
  expires_at timestamptz not null
);
create index card_creation_counters_expiry_idx on public.card_creation_counters (expires_at);
alter table public.card_creation_counters enable row level security;
revoke all on table public.card_creation_counters from public, anon, authenticated;
grant select, insert, update, delete on table public.card_creation_counters to service_role;

-- One database transaction serializes all creation-slot reservations.
-- Fixed server-side limits: 3 per IP per UTC hour, 10 per IP per UTC day,
-- and 150 total per UTC day. Never accept quota parameters from callers.
create function public.reserve_public_card_slot(p_fingerprint text)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_now timestamptz := now();
  v_hour timestamptz := date_trunc('hour', v_now at time zone 'UTC') at time zone 'UTC';
  v_day timestamptz := date_trunc('day', v_now at time zone 'UTC') at time zone 'UTC';
  v_ip_hour text;
  v_ip_day text;
  v_global text;
begin
  if p_fingerprint is null or p_fingerprint !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid fingerprint';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('digital-card-public-creation-quota', 0));
  -- Clean stale HMAC counters on the next legitimate reservation.
  delete from public.card_creation_counters where expires_at < v_now;
  v_ip_hour := 'ip-hour:' || p_fingerprint || ':' || v_hour::text;
  v_ip_day := 'ip-day:' || p_fingerprint || ':' || v_day::text;
  v_global := 'global-day:' || v_day::text;

  if coalesce((select uses from public.card_creation_counters where bucket_key = v_ip_hour), 0) >= 3
    or coalesce((select uses from public.card_creation_counters where bucket_key = v_ip_day), 0) >= 10
    or coalesce((select uses from public.card_creation_counters where bucket_key = v_global), 0) >= 150
  then
    return false;
  end if;

  insert into public.card_creation_counters(bucket_key, uses, expires_at)
  values (v_ip_hour, 1, v_hour + interval '1 hour'),
         (v_ip_day, 1, v_day + interval '1 day'),
         (v_global, 1, v_day + interval '1 day')
  on conflict (bucket_key) do update
    set uses = public.card_creation_counters.uses + 1;
  return true;
end;
$$;
revoke all on function public.reserve_public_card_slot(text) from public, anon, authenticated;
grant execute on function public.reserve_public_card_slot(text) to service_role;

comment on function public.reserve_public_card_slot(text) is
  'Service-role-only atomic quota reservations for anonymous card creation; argument must be an HMAC fingerprint, never a raw IP.';
