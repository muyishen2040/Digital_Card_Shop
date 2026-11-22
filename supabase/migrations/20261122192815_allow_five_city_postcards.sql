-- Register the five city postcards without changing RLS, grants or message rules.
-- This migration is additive to the approved public card-creation allowlist.
set local lock_timeout = '5s';
alter table public.card_instances
  drop constraint card_instances_template_slug_check,
  add constraint card_instances_template_slug_check
    check (template_slug in ('little-sunshine', 'same-sky', 'make-a-wish', 'city-postcard-hong-kong', 'city-postcard-taipei', 'city-postcard-kyoto', 'city-postcard-seoul', 'city-postcard-paris', 'city-postcard-san-francisco', 'city-postcard-singapore'));
