
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
