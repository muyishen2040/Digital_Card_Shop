-- Run only against the dedicated Digital Card Shop Supabase project
-- after applying schema/card_instances.sql.
do $$
declare
  access_enabled boolean;
  api_readers integer;
  privileged_reader integer;
begin
  select c.relrowsecurity into access_enabled
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relname = 'card_instances';

  if access_enabled is distinct from true then
    raise exception 'card_instances must have RLS enabled';
  end if;

  select count(*) into api_readers
  from (values ('anon'::name), ('authenticated'::name)) roles(role_name)
  where has_table_privilege(roles.role_name, 'public.card_instances', 'SELECT')
     or has_table_privilege(roles.role_name, 'public.card_instances', 'INSERT')
     or has_table_privilege(roles.role_name, 'public.card_instances', 'UPDATE')
     or has_table_privilege(roles.role_name, 'public.card_instances', 'DELETE');

  if api_readers > 0 then
    raise exception 'public card instances grant access to anon/authenticated';
  end if;

  select count(*) into privileged_reader
  from (values ('service_role'::name)) roles(role_name)
  where has_table_privilege(roles.role_name, 'public.card_instances', 'SELECT')
    and has_table_privilege(roles.role_name, 'public.card_instances', 'INSERT');

  if privileged_reader <> 1 then
    raise exception 'service_role missing expected access';
  end if;

  raise notice 'Card instance RLS and grants verified';
end $$;
