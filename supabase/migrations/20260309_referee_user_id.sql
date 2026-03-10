-- Add user_id column to referees table for stable ID-based assignment checks.
-- This replaces fragile email-based matching between referees and users_profile.

alter table public.referees
  add column if not exists user_id uuid unique references auth.users(id) on delete set null;

create index if not exists idx_referees_user_id on public.referees(user_id);

-- Update current_referee_id() to prefer user_id, fall back to email for unmigrated rows.
create or replace function public.current_referee_id()
returns uuid
language sql
stable
as $$
  select id
  from public.referees
  where user_id = auth.uid()
     or (user_id is null and lower(coalesce(email, '')) = public.current_user_email())
  limit 1;
$$;

-- Backfill user_id for existing referees that share an email with a users_profile row.
update public.referees r
set user_id = up.id
from public.users_profile up
where lower(coalesce(r.email, '')) = lower(coalesce(up.email, ''))
  and r.email is not null
  and up.role = 'referee'
  and r.user_id is null;
