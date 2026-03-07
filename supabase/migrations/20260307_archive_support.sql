alter table public.teams add column if not exists is_archived boolean not null default false;
alter table public.matches add column if not exists is_archived boolean not null default false;

create index if not exists idx_teams_is_archived on public.teams(is_archived);
create index if not exists idx_matches_is_archived on public.matches(is_archived);
