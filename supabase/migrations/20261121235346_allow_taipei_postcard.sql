-- Extend the existing template allowlist without changing access or text-size checks.
set local lock_timeout = '5s';
alter table public.card_instances
  drop constraint card_instances_template_slug_check,
  add constraint card_instances_template_slug_check
    check (template_slug in ('little-sunshine', 'same-sky', 'make-a-wish', 'city-postcard-hong-kong', 'city-postcard-taipei'));
