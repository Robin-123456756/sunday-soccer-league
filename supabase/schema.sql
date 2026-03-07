-- Sunday Soccer League - Supabase SQL Schema
-- Run this in the Supabase SQL editor.

create extension if not exists pgcrypto;

-- Enums
create type public.match_status as enum ('scheduled', 'in_progress', 'completed', 'postponed');
create type public.lineup_type as enum ('starter', 'bench');
create type public.card_type as enum ('yellow', 'red', 'second_yellow_red');
create type public.export_type as enum ('player_details', 'team_players', 'discipline_report', 'appearance_report');
create type public.export_format as enum ('csv', 'xlsx');
create type public.export_status as enum ('pending', 'completed', 'failed');
create type public.app_role as enum ('admin', 'referee', 'team_manager');

-- Updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tables
create table public.users_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role public.app_role not null default 'team_manager',
  team_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.matchdays (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  round_number integer,
  season_label text,
  created_at timestamptz not null default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  short_name text,
  primary_color text,
  secondary_color text,
  home_venue text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users_profile
  add constraint users_profile_team_id_fkey
  foreign key (team_id) references public.teams(id) on delete set null;

create table public.players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  full_name text not null,
  jersey_number integer,
  position text,
  registration_number text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint players_team_jersey_unique unique (team_id, jersey_number)
);

create table public.referees (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text unique,
  level text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  matchday_id uuid references public.matchdays(id) on delete set null,
  match_date date not null,
  kickoff_time time,
  venue text,
  home_team_id uuid not null references public.teams(id) on delete restrict,
  away_team_id uuid not null references public.teams(id) on delete restrict,
  home_jersey_color text,
  away_jersey_color text,
  referee_id uuid references public.referees(id) on delete set null,
  status public.match_status not null default 'scheduled',
  home_score integer,
  away_score integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint matches_different_teams check (home_team_id <> away_team_id),
  constraint matches_scores_non_negative check (
    (home_score is null or home_score >= 0) and
    (away_score is null or away_score >= 0)
  )
);

create table public.match_lineups (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  lineup_type public.lineup_type not null,
  is_captain boolean not null default false,
  created_at timestamptz not null default now(),
  constraint match_lineups_match_player_unique unique (match_id, player_id)
);

create table public.substitutions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  player_off_id uuid not null references public.players(id) on delete restrict,
  player_on_id uuid not null references public.players(id) on delete restrict,
  minute integer not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint substitutions_minute_non_negative check (minute >= 0),
  constraint substitutions_players_different check (player_off_id <> player_on_id)
);

create table public.card_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  card_type public.card_type not null,
  minute integer not null,
  reason text not null,
  referee_note text,
  created_at timestamptz not null default now(),
  constraint card_events_minute_non_negative check (minute >= 0)
);

create table public.referee_reports (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null unique references public.matches(id) on delete cascade,
  referee_id uuid not null references public.referees(id) on delete restrict,
  general_comment text,
  time_management_observation text,
  dress_code_observation text,
  organization_observation text,
  conduct_observation text,
  incidents text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_sheet_uploads (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text not null,
  uploaded_by_user_id uuid references auth.users(id) on delete set null,
  uploaded_at timestamptz not null default now()
);

create table public.export_jobs (
  id uuid primary key default gen_random_uuid(),
  requested_by_user_id uuid not null references auth.users(id) on delete restrict,
  export_type public.export_type not null,
  file_format public.export_format not null,
  filters_json jsonb,
  file_url text,
  status public.export_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.caution_reasons (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_players_team_id on public.players(team_id);
create index idx_matches_matchday_id on public.matches(matchday_id);
create index idx_matches_home_team_id on public.matches(home_team_id);
create index idx_matches_away_team_id on public.matches(away_team_id);
create index idx_matches_referee_id on public.matches(referee_id);
create index idx_match_lineups_match_team on public.match_lineups(match_id, team_id);
create index idx_substitutions_match_team on public.substitutions(match_id, team_id);
create index idx_card_events_match_team on public.card_events(match_id, team_id);
create index idx_card_events_player_id on public.card_events(player_id);
create index idx_referee_reports_referee_id on public.referee_reports(referee_id);
create index idx_team_sheet_uploads_match_team on public.team_sheet_uploads(match_id, team_id);
create index idx_export_jobs_requested_by on public.export_jobs(requested_by_user_id);

-- Triggers
create trigger set_updated_at_users_profile
before update on public.users_profile
for each row execute function public.set_updated_at();

create trigger set_updated_at_teams
before update on public.teams
for each row execute function public.set_updated_at();

create trigger set_updated_at_players
before update on public.players
for each row execute function public.set_updated_at();

create trigger set_updated_at_referees
before update on public.referees
for each row execute function public.set_updated_at();

create trigger set_updated_at_matches
before update on public.matches
for each row execute function public.set_updated_at();

create trigger set_updated_at_referee_reports
before update on public.referee_reports
for each row execute function public.set_updated_at();

-- Validation triggers
create or replace function public.validate_match_lineup_player_team()
returns trigger
language plpgsql
as $$
declare
  player_team uuid;
begin
  select team_id into player_team from public.players where id = new.player_id;
  if player_team is null then
    raise exception 'Player % does not exist', new.player_id;
  end if;
  if player_team <> new.team_id then
    raise exception 'Player % does not belong to team %', new.player_id, new.team_id;
  end if;
  return new;
end;
$$;

create trigger validate_match_lineup_player_team
before insert or update on public.match_lineups
for each row execute function public.validate_match_lineup_player_team();

create or replace function public.validate_substitution_players_team()
returns trigger
language plpgsql
as $$
declare
  off_team uuid;
  on_team uuid;
begin
  select team_id into off_team from public.players where id = new.player_off_id;
  select team_id into on_team from public.players where id = new.player_on_id;

  if off_team <> new.team_id or on_team <> new.team_id then
    raise exception 'Substitution players must belong to the selected team';
  end if;

  return new;
end;
$$;

create trigger validate_substitution_players_team
before insert or update on public.substitutions
for each row execute function public.validate_substitution_players_team();

create or replace function public.validate_card_event_player_team()
returns trigger
language plpgsql
as $$
declare
  player_team uuid;
begin
  select team_id into player_team from public.players where id = new.player_id;
  if player_team <> new.team_id then
    raise exception 'Carded player must belong to the selected team';
  end if;
  return new;
end;
$$;

create trigger validate_card_event_player_team
before insert or update on public.card_events
for each row execute function public.validate_card_event_player_team();

-- RLS
alter table public.users_profile enable row level security;
alter table public.matchdays enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.referees enable row level security;
alter table public.matches enable row level security;
alter table public.match_lineups enable row level security;
alter table public.substitutions enable row level security;
alter table public.card_events enable row level security;
alter table public.referee_reports enable row level security;
alter table public.team_sheet_uploads enable row level security;
alter table public.export_jobs enable row level security;
alter table public.caution_reasons enable row level security;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
as $$
  select coalesce((select role from public.users_profile where id = auth.uid()), 'team_manager'::public.app_role);
$$;

-- Read access for authenticated users
create policy "authenticated read users_profile" on public.users_profile
for select to authenticated using (true);
create policy "authenticated read matchdays" on public.matchdays
for select to authenticated using (true);
create policy "authenticated read teams" on public.teams
for select to authenticated using (true);
create policy "authenticated read players" on public.players
for select to authenticated using (true);
create policy "authenticated read referees" on public.referees
for select to authenticated using (true);
create policy "authenticated read matches" on public.matches
for select to authenticated using (true);
create policy "authenticated read match_lineups" on public.match_lineups
for select to authenticated using (true);
create policy "authenticated read substitutions" on public.substitutions
for select to authenticated using (true);
create policy "authenticated read card_events" on public.card_events
for select to authenticated using (true);
create policy "authenticated read referee_reports" on public.referee_reports
for select to authenticated using (true);
create policy "authenticated read team_sheet_uploads" on public.team_sheet_uploads
for select to authenticated using (true);
create policy "authenticated read caution_reasons" on public.caution_reasons
for select to authenticated using (true);

-- Admin full access
create policy "admin manage users_profile" on public.users_profile
for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admin manage matchdays" on public.matchdays
for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admin manage teams" on public.teams
for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admin manage players" on public.players
for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admin manage referees" on public.referees
for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admin manage matches" on public.matches
for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admin manage lineups" on public.match_lineups
for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admin manage substitutions" on public.substitutions
for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admin manage card_events" on public.card_events
for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admin manage referee_reports" on public.referee_reports
for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admin manage caution_reasons" on public.caution_reasons
for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy "admin manage export_jobs" on public.export_jobs
for all to authenticated using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');

-- Team managers can manage uploads and see their own team's uploads
create policy "team managers manage own team uploads" on public.team_sheet_uploads
for all to authenticated
using (
  public.current_app_role() in ('admin', 'team_manager')
  and (
    public.current_app_role() = 'admin'
    or team_id = (select team_id from public.users_profile where id = auth.uid())
  )
)
with check (
  public.current_app_role() in ('admin', 'team_manager')
  and (
    public.current_app_role() = 'admin'
    or team_id = (select team_id from public.users_profile where id = auth.uid())
  )
);

-- Referees can manage reports for matches assigned to them
create policy "referees manage assigned reports" on public.referee_reports
for all to authenticated
using (
  public.current_app_role() in ('admin', 'referee')
  and (
    public.current_app_role() = 'admin'
    or referee_id in (
      select r.id
      from public.referees r
      join public.matches m on m.referee_id = r.id
      where m.id = referee_reports.match_id
        and lower(coalesce(r.email, '')) = lower(coalesce((select email from public.users_profile where id = auth.uid()), ''))
    )
  )
)
with check (
  public.current_app_role() in ('admin', 'referee')
);

-- Export jobs visible to requester and admins
create policy "requester read own export_jobs" on public.export_jobs
for select to authenticated
using (
  public.current_app_role() = 'admin' or requested_by_user_id = auth.uid()
);

create policy "requester create own export_jobs" on public.export_jobs
for insert to authenticated
with check (
  public.current_app_role() = 'admin' or requested_by_user_id = auth.uid()
);

-- Storage bucket guidance
insert into storage.buckets (id, name, public)
values ('team-sheets', 'team-sheets', false)
on conflict (id) do nothing;

-- Storage policies
create policy "authenticated read team sheet objects"
on storage.objects for select to authenticated
using (bucket_id = 'team-sheets');

create policy "team managers upload own team sheets"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'team-sheets'
  and public.current_app_role() in ('admin', 'team_manager')
);

create policy "admins and team managers update team sheet objects"
on storage.objects for update to authenticated
using (
  bucket_id = 'team-sheets'
  and public.current_app_role() in ('admin', 'team_manager')
)
with check (
  bucket_id = 'team-sheets'
  and public.current_app_role() in ('admin', 'team_manager')
);

-- Seed caution reasons
insert into public.caution_reasons (name, category)
values
  ('Dissent', 'yellow'),
  ('Dangerous play', 'yellow'),
  ('Persistent fouling', 'yellow'),
  ('Handball', 'yellow'),
  ('Delaying restart', 'yellow'),
  ('Unsporting behavior', 'yellow'),
  ('Violent conduct', 'red'),
  ('Serious foul play', 'red')
on conflict (name) do nothing;

-- -------------------------------------------------------------------
-- Role-specific hardening additions
-- -------------------------------------------------------------------

create or replace function public.current_user_team_id()
returns uuid
language sql
stable
as $$
  select team_id from public.users_profile where id = auth.uid();
$$;

create or replace function public.current_user_email()
returns text
language sql
stable
as $$
  select lower(coalesce(email, '')) from public.users_profile where id = auth.uid();
$$;

create or replace function public.current_referee_id()
returns uuid
language sql
stable
as $$
  select id
  from public.referees
  where lower(coalesce(email, '')) = public.current_user_email()
  limit 1;
$$;

create or replace function public.team_is_in_match(p_match_id uuid, p_team_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.matches m
    where m.id = p_match_id
      and (m.home_team_id = p_team_id or m.away_team_id = p_team_id)
  );
$$;

create or replace function public.is_match_referee(p_match_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.matches m
    where m.id = p_match_id
      and m.referee_id = public.current_referee_id()
  );
$$;

-- Team managers should edit only their own team lineups.
drop policy if exists "admin manage lineups" on public.match_lineups;
create policy "admin manage all lineups" on public.match_lineups
for all to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "team manager manage own team lineups" on public.match_lineups
for all to authenticated
using (
  public.current_app_role() = 'team_manager'
  and team_id = public.current_user_team_id()
)
with check (
  public.current_app_role() = 'team_manager'
  and team_id = public.current_user_team_id()
  and public.team_is_in_match(match_id, team_id)
);

-- Referees should enter cards directly, but only on matches assigned to them.
drop policy if exists "admin manage card_events" on public.card_events;
create policy "admin manage all card events" on public.card_events
for all to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');

create policy "referees manage assigned card events" on public.card_events
for all to authenticated
using (
  public.current_app_role() = 'referee'
  and public.is_match_referee(match_id)
)
with check (
  public.current_app_role() = 'referee'
  and public.is_match_referee(match_id)
  and public.team_is_in_match(match_id, team_id)
);

-- Admins should be the only users exporting files.
drop policy if exists "requester read own export_jobs" on public.export_jobs;
drop policy if exists "requester create own export_jobs" on public.export_jobs;
drop policy if exists "admin manage export_jobs" on public.export_jobs;

create policy "admins manage export jobs only" on public.export_jobs
for all to authenticated
using (public.current_app_role() = 'admin')
with check (public.current_app_role() = 'admin');
