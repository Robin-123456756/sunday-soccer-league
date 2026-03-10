# System Overview

## Purpose
This system helps a Sunday soccer league record, store, and retrieve official matchday information.

## Problems It Solves
- Loss of paper team sheets
- Poor discipline tracking
- Hard-to-trace referee reports
- No central history of player participation
- Slow preparation of league reports

## Main Modules
- Authentication and roles
- Teams and players
- Fixtures and matches
- Lineups and substitutions
- Card events and caution reasons
- Referee reporting
- Team sheet uploads
- Exports and reports
- Score recording
- Discipline tracking (repeat offenders)
- Player appearance stats

## Authentication & Route Protection

### Proxy (`src/proxy.ts`)
- Refreshes Supabase session on every request
- Queries `users_profile` for role and `is_active` status
- Redirects unauthenticated users to `/sign-in?next=<path>&flash=auth_required`
- Redirects authenticated users away from public auth pages to their role's default route
- Enforces role-based route access via `routeAllowsRole()` — unauthorized users are redirected with `flash=unauthorized`
- Inactive/missing profiles redirected to sign-in with `flash=inactive_profile`

### Route Authorization (`src/lib/auth/routes.ts`)
- Centralized route permission logic
- Admin-only: `/dashboard`, `/admin/*`, `/reports/*`, `/teams`, `/players`, `/referees`
- Role-specific: `/team-manager/*` (team_manager), `/referee/*` (referee)
- Shared: `/matches` list and detail (all roles), match sub-pages (lineups, cards, substitutions, referee-report, uploads)
- `/matches/new` is admin-only

### Server-Side Guards (`src/server/queries/auth.ts`)
- `requireRole()` - throws for unauthorized API/action calls
- `requireMatchRole()` - centralized admin/referee match authorization; admins pass through, referees verified via `referees.user_id` (stable) with email fallback for unmigrated rows
- `validateTeamInMatch()` - verifies a team is home or away in the given match
- `validatePlayerInTeam()` - verifies a player belongs to the specified team
- `requireSignedInPage()` - redirects to `/sign-in` if not authenticated or inactive
- `requireRolePage()` - redirects to default route if role not allowed

### Domain Validation (`src/lib/validation.ts` + Server Actions)
- Shared pure validators: `validateCardType()`, `validateActionMinute()`, `validateScore()`, `validateDifferentPlayers()`, `validateMatchTeams()`, `validateSubstitution()`, `validateLineupPlayer()`
- Cards: validates card type, minute (0-130), team-in-match, and player-in-team before insert
- Substitutions: validates minute, different players, team-in-match, and both players-in-team
- Score: validates non-negative integers
- These supplement the DB triggers (`validate_card_event_player_team`, `validate_substitution_players_team`, `validate_match_lineup_player_team`) for defense in depth

### Referee ID Linking
- `referees` table has a `user_id` column (FK to `auth.users`) for stable identity linking
- Migration: `supabase/migrations/20260309_referee_user_id.sql` adds the column and backfills existing rows by email match
- `current_referee_id()` SQL function prefers `user_id`, falls back to email for unmigrated rows
- `requireMatchRole()` in server actions uses the same user_id-first, email-fallback strategy
- `createReferee()` and `updateReferee()` auto-resolve `user_id` by looking up `users_profile` by email when no explicit `userId` is provided

### Auth Confirmation (`src/app/auth/confirm/route.ts`)
- Server-side route handler for Supabase PKCE email OTP verification
- Handles invite, recovery, signup, magic link, and email change token types
- Validates `token_hash` and `type`, calls `supabase.auth.verifyOtp()`
- Redirects to type-appropriate page on success with flash (`invite_verified`, `recovery_verified`)
- On failure, redirects to `/auth/error` with `flash=expired_link` or `flash=invalid_link`
- Sanitizes `next` param to prevent open redirects

### Flash Messages (`src/lib/auth/flash.ts` + `GlobalFlashBanner`)
- Dismissable banner displayed at the top of every page via the root layout
- Driven by `?flash=<code>` URL parameter — automatically cleaned from URL on dismiss
- Tone-coded: success (green), error (red), info (blue)
- Flash codes: `invite_verified`, `invite_completed`, `recovery_verified`, `password_updated`, `signed_out`, `auth_required`, `unauthorized`, `inactive_profile`, `invalid_link`, `expired_link`
- Middleware, auth confirm, sign-out, post-login, and form completions all set flash codes

### Session Refresh (`src/components/auth/SessionRefresh.tsx`)
- Client-side component rendered in root layout
- Listens to Supabase `onAuthStateChange` events (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, PASSWORD_RECOVERY, USER_UPDATED)
- Calls `router.refresh()` to re-render server components when auth state changes
- Ensures the nav and page content stay in sync with the current session

### Auth Error Page (`src/app/auth/error/page.tsx`)
- Displays descriptive error message from failed auth confirmations
- Provides links to sign-in and password reset for recovery

### Email Templates
- Styled invite and password-reset emails in `supabase/email-templates/`
- Setup instructions in `supabase/AUTH_EMAIL_SETUP.md`

### REST API Error Handling
- All API routes (`/api/matches`, `/api/players`, `/api/teams`, `/api/referees`, `/api/exports`) return proper JSON error responses
- 401 (`UNAUTHENTICATED`) for missing/invalid session
- 403 (`FORBIDDEN`) for authenticated users with insufficient role
- 500 (`INTERNAL_ERROR`) for unexpected server errors
- Typed error classes in `src/lib/errors.ts`: `UnauthenticatedError`, `ForbiddenError`
- Shared response helper in `src/lib/api-error.ts`: `authErrorResponse()`, `internalErrorResponse()`
- Pattern: separate try/catch for auth vs business logic; all responses include a `code` field for traceability

## Testing & CI

### Test Suite (`src/__tests__/`)
- `auth-routes.test.ts` - 40 tests covering `routeAllowsRole()`, `isPublicPath()`, `isExcludedFromAuth()`, `getDefaultRouteForRole()` for all role/route combinations
- `auth-guards.test.ts` - 13 tests covering `getCurrentUserProfile`, `requireRole`, and `requireMatchRole` with mocked Supabase (admin pass-through, referee user_id match, email fallback, wrong referee, unassigned match, team_manager denied, non-existent match)
- `errors.test.ts` - 15 tests covering `UnauthenticatedError`, `ForbiddenError`, `isUnauthenticated()`, `isForbidden()` type guards
- `api-error.test.ts` - 4 tests covering `authErrorResponse()` (401/403 dispatch) and `internalErrorResponse()` (500 with code)
- `flash.test.ts` - 6 tests covering `getFlashFromCode()` for all flash codes and edge cases
- `validation.test.ts` - 30 tests covering `validateCardType()`, `validateActionMinute()`, `validateScore()`, `validateDifferentPlayers()`, `validateMatchTeams()`, `validateSubstitution()`, and form-level validators
- Framework: Vitest with `@/` path alias support
- Run: `npx vitest run`

### CI Pipeline (`.github/workflows/ci.yml`)
- Triggers on push to main and pull requests
- **lint-type-build job**: `npm run lint` + `tsc --noEmit` + `next build` in clean environment with placeholder env vars
- **test job**: `vitest run` for unit tests
- Node 20, npm ci for reproducible installs

## User Roles
### League Admin
Can manage teams, players, referees, fixtures, reports, uploads, exports, scores, and user accounts.

### Referee
Can view assigned matches, record cards and substitutions, submit referee reports, and record scores.

### Team Manager
Can submit lineups and upload team sheet files.
