# SQL Migration Runbook

## Ordered Files
1. `supabase/migrations/00_schema.sql`
2. `supabase/migrations/01_role_hardening.sql`

## When to Use

### Fresh Environment
- Run `00_schema.sql`
- Run `01_role_hardening.sql`

### Existing Environment (already has schema objects)
- Run `01_role_hardening.sql` only

## Execution Notes
- Run scripts in Supabase SQL Editor as a project owner/admin.
- Execute each file in a single transaction block if your workflow allows it.
- Validate RLS behavior after applying:
  - `admin` can manage all relevant records
  - `team_manager` can manage own team lineups only
  - `referee` can manage card events only for assigned matches
- Confirm `users_profile` rows exist for authenticated users and roles are set correctly.
