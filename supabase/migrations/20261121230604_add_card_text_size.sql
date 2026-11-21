-- Preserve the original typography for existing rows and older clients.
set local lock_timeout = '5s';
alter table public.card_instances
  add column text_size text not null default 'large'
  constraint card_instances_text_size_check check (text_size in ('small', 'medium', 'large'));
