# Supabase Setup

## Files
- `schema.sql`: full schema with RLS, storage policies, seed data, and role-hardening additions.
- `migrations/20260307_role_hardening_and_actions.sql`: incremental role policy hardening for existing databases.
- `migrations/00_schema.sql`: ordered baseline schema migration file.
- `migrations/01_role_hardening.sql`: ordered role hardening migration file.
- `migrations/RUNBOOK.md`: execution order and environment-specific guidance.
- `imported/schema-1.sql`: imported external schema snapshot.
- `imported/schema-2.sql`: imported external schema snapshot (same content as schema-1).

## Recommended Setup Paths

### Path A: Fresh Database
1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/migrations/00_schema.sql`.
4. Run `supabase/migrations/01_role_hardening.sql`.
5. Create auth users in Supabase Auth.
6. Insert matching rows into `public.users_profile`.

### Path B: Existing Database
1. Ensure your current schema is already applied.
2. Run `supabase/migrations/01_role_hardening.sql` (or `20260307_role_hardening_and_actions.sql`).
3. Validate policy behavior for admin, referee, and team_manager roles.

## Notes
- `users_profile.id` must match `auth.users.id`.
- Team sheet files use the `team-sheets` storage bucket.
- RLS policies assume authenticated sessions.
- Referee access checks rely on email matching between `users_profile.email` and `referees.email`.

## Suggested Admin Bootstrap
```sql
insert into public.users_profile (id, full_name, email, role)
values (
  'YOUR_AUTH_USER_UUID',
  'League Admin',
  'admin@example.com',
  'admin'
);
```
