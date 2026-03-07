# Supabase Setup

## Files
- `schema.sql` — full database schema, RLS, storage bucket setup, and starter seed data.

## Recommended order
1. Create a Supabase project.
2. Open the SQL Editor.
3. Run `supabase/schema.sql`.
4. Create users in Supabase Auth.
5. Insert matching rows into `public.users_profile`.
6. Start adding teams, players, referees, and fixtures.

## Notes
- `users_profile.id` must match the `auth.users.id` value.
- Team sheet files are intended for the `team-sheets` storage bucket.
- RLS assumes users are authenticated.
- Referee access is matched by email in `users_profile.email` and `referees.email`.

## Suggested first admin bootstrap
After creating your first auth user, run something like:

```sql
insert into public.users_profile (id, full_name, email, role)
values (
  'YOUR_AUTH_USER_UUID',
  'League Admin',
  'admin@example.com',
  'admin'
);
```

## Role rules now enforced
- Team managers can edit only their own team lineups.
- Referees can enter card events directly, but only for matches assigned to them.
- Admins are the only users allowed to generate export files or export jobs.

## New app files added
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/admin.ts`
- `src/server/queries/auth.ts`
- `src/server/queries/matches.ts`
- `src/server/queries/players.ts`
- `src/server/actions/matches.ts`
- `src/server/actions/lineups.ts`
- `src/server/actions/cards.ts`
- `src/server/actions/referee-reports.ts`
- `src/server/actions/uploads.ts`
- `src/server/actions/exports.ts`
