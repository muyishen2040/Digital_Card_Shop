-- Allow the five independently reviewed Signature Edition birthday card designs.
-- Apply to the Digital Card Shop Supabase project before deploying the app.
-- Preserve existing template slugs, access-token protection, expiration, quotas and RLS.
set local lock_timeout = '5s';
alter table public.card_instances
  drop constraint card_instances_template_slug_check,
  add constraint card_instances_template_slug_check
    check (template_slug in (
      'little-sunshine', 'same-sky', 'make-a-wish',
      'city-postcard-hong-kong', 'city-postcard-taipei',
      'city-postcard-kyoto', 'city-postcard-seoul', 'city-postcard-paris',
      'city-postcard-san-francisco', 'city-postcard-singapore',
      'velvet-encore', 'birthday-bloom', 'golden-parcel',
      'another-orbit', 'birthday-record'
    ));
