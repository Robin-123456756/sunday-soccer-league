-- Sunday Soccer League - Supplementary SQL
-- Run this in Supabase SQL Editor AFTER prisma db push
-- Adds indexes, validation triggers, check constraints, storage bucket, and seed data
-- Works with the existing Prisma-created tables (camelCase columns)

-- ─── Helper function ─────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$;

-- ─── Indexes ─────────────────────────────────────────────────────────
create index if not exists idx_players_team_id on public.players("teamId");
create index if not exists idx_matches_matchday_id on public.matches("matchdayId");
create index if not exists idx_matches_home_team_id on public.matches("homeTeamId");
create index if not exists idx_matches_away_team_id on public.matches("awayTeamId");
create index if not exists idx_matches_referee_id on public.matches("refereeId");
create index if not exists idx_match_lineups_match_team on public.match_lineups("matchId", "teamId");
create index if not exists idx_substitutions_match_team on public.substitutions("matchId", "teamId");
create index if not exists idx_card_events_match_team on public.card_events("matchId", "teamId");
create index if not exists idx_card_events_player_id on public.card_events("playerId");
create index if not exists idx_referee_reports_referee_id on public.referee_reports("refereeId");
create index if not exists idx_team_sheet_uploads_match_team on public.team_sheet_uploads("matchId", "teamId");
create index if not exists idx_export_jobs_requested_by on public.export_jobs("requestedByUserId");

-- ─── Check constraints ──────────────────────────────────────────────
-- Prevent a team playing itself
alter table public.matches
  drop constraint if exists matches_different_teams;
alter table public.matches
  add constraint matches_different_teams
  check ("homeTeamId" <> "awayTeamId");

-- Scores must be non-negative
alter table public.matches
  drop constraint if exists matches_scores_non_negative;
alter table public.matches
  add constraint matches_scores_non_negative
  check (
    ("homeScore" is null or "homeScore" >= 0) and
    ("awayScore" is null or "awayScore" >= 0)
  );

-- Substitution minute non-negative
alter table public.substitutions
  drop constraint if exists substitutions_minute_non_negative;
alter table public.substitutions
  add constraint substitutions_minute_non_negative
  check (minute >= 0);

-- Substitution players must be different
alter table public.substitutions
  drop constraint if exists substitutions_players_different;
alter table public.substitutions
  add constraint substitutions_players_different
  check ("playerOffId" <> "playerOnId");

-- Card event minute non-negative
alter table public.card_events
  drop constraint if exists card_events_minute_non_negative;
alter table public.card_events
  add constraint card_events_minute_non_negative
  check (minute >= 0);

-- ─── Validation triggers ────────────────────────────────────────────

-- Lineup: player must belong to the specified team
create or replace function public.validate_match_lineup_player_team()
returns trigger
language plpgsql
as $$
declare
  player_team uuid;
begin
  select "teamId" into player_team from public.players where id = new."playerId";
  if player_team is null then
    raise exception 'Player % does not exist', new."playerId";
  end if;
  if player_team <> new."teamId" then
    raise exception 'Player % does not belong to team %', new."playerId", new."teamId";
  end if;
  return new;
end;
$$;

drop trigger if exists validate_match_lineup_player_team on public.match_lineups;
create trigger validate_match_lineup_player_team
before insert or update on public.match_lineups
for each row execute function public.validate_match_lineup_player_team();

-- Substitution: both players must belong to the specified team
create or replace function public.validate_substitution_players_team()
returns trigger
language plpgsql
as $$
declare
  off_team uuid;
  on_team uuid;
begin
  select "teamId" into off_team from public.players where id = new."playerOffId";
  select "teamId" into on_team from public.players where id = new."playerOnId";

  if off_team <> new."teamId" or on_team <> new."teamId" then
    raise exception 'Substitution players must belong to the selected team';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_substitution_players_team on public.substitutions;
create trigger validate_substitution_players_team
before insert or update on public.substitutions
for each row execute function public.validate_substitution_players_team();

-- Card event: player must belong to the specified team
create or replace function public.validate_card_event_player_team()
returns trigger
language plpgsql
as $$
declare
  player_team uuid;
begin
  select "teamId" into player_team from public.players where id = new."playerId";
  if player_team <> new."teamId" then
    raise exception 'Carded player must belong to the selected team';
  end if;
  return new;
end;
$$;

drop trigger if exists validate_card_event_player_team on public.card_events;
create trigger validate_card_event_player_team
before insert or update on public.card_events
for each row execute function public.validate_card_event_player_team();

-- ─── Storage bucket ─────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('team-sheets', 'team-sheets', false)
on conflict (id) do nothing;

-- Storage policies
do $$
begin
  -- Allow authenticated users to read team sheet files
  if not exists (
    select 1 from pg_policies where policyname = 'authenticated read team sheet objects' and tablename = 'objects'
  ) then
    create policy "authenticated read team sheet objects"
    on storage.objects for select to authenticated
    using (bucket_id = 'team-sheets');
  end if;

  -- Allow authenticated users to upload team sheet files
  if not exists (
    select 1 from pg_policies where policyname = 'authenticated upload team sheets' and tablename = 'objects'
  ) then
    create policy "authenticated upload team sheets"
    on storage.objects for insert to authenticated
    with check (bucket_id = 'team-sheets');
  end if;
end $$;

-- ─── Seed caution reasons ───────────────────────────────────────────
insert into public.caution_reasons (id, name, category)
values
  (gen_random_uuid(), 'Dissent', 'yellow'),
  (gen_random_uuid(), 'Dangerous play', 'yellow'),
  (gen_random_uuid(), 'Persistent fouling', 'yellow'),
  (gen_random_uuid(), 'Handball', 'yellow'),
  (gen_random_uuid(), 'Delaying restart', 'yellow'),
  (gen_random_uuid(), 'Unsporting behavior', 'yellow'),
  (gen_random_uuid(), 'Violent conduct', 'red'),
  (gen_random_uuid(), 'Serious foul play', 'red')
on conflict do nothing;
