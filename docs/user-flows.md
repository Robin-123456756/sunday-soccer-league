# User Flows

## Authentication Flow
1. User visits any protected route while unauthenticated
2. Middleware redirects to `/sign-in?next=<original-path>&flash=auth_required`
3. Flash banner shows "Sign in required" message (dismissable)
4. User enters email and password
5. On success, redirected to `next` param or role-based default route
6. Middleware checks `users_profile` for role and `is_active` on every request
7. Inactive profiles redirected to sign-in with `flash=inactive_profile`
8. Users trying to access routes outside their role are redirected with `flash=unauthorized`
9. SessionRefresh component listens for auth state changes and triggers server component re-renders

## Admin Flow
1. Log in (redirected to `/dashboard`)
2. Create teams, players, referees, venues, and matchdays
3. Create match fixture and assign referee
4. Review lineups and uploaded team sheets
5. Record or update match scores, optionally mark match as completed
6. Record substitutions during matches
7. Review discipline reports (repeat offenders with 2+ cards)
8. Review player appearance stats (total, starter, bench counts)
9. Export league data (CSV/Excel with team filters)
10. Manage users — invite new users with role assignment

## Referee Flow
1. Log in (redirected to `/referee/assigned-matches`)
2. Open assigned match
3. Record card events with minute, reason, and notes
4. Record substitutions with minute and player details
5. Record or update match score
6. Add comments and observations
7. Submit referee report

## Team Manager Flow
1. Log in (redirected to `/team-manager/lineups`)
2. Open scheduled match
3. Select starters and bench players, designate captain
4. Upload team sheet file
5. Submit lineup

## Auth Confirmation Flow (PKCE / Email OTP)
All Supabase email links (invite, password reset, magic link, signup) go through
`/auth/confirm?token_hash=...&type=...&next=...`:
1. Supabase sends an email with a `token_hash` and `type` parameter
2. User clicks the link, hitting `/auth/confirm` route handler
3. Route validates the `type` (invite, recovery, signup, etc.) and `token_hash`
4. Calls `supabase.auth.verifyOtp()` to exchange the token for a session
5. On success, redirects to a type-appropriate destination with flash banner:
   - `recovery` -> `/auth/update-password?flash=recovery_verified`
   - `invite` -> `/auth/accept-invite?flash=invite_verified`
   - others -> `/auth/post-login`
6. On failure, redirects to `/auth/error` with `flash=expired_link` or `flash=invalid_link`

## Password Reset Flow
1. User clicks "Forgot your password?" on sign-in page
2. Enters email address
3. Receives styled reset email (via Supabase)
4. Clicks link -> `/auth/confirm` verifies token -> redirects to `/auth/update-password`
5. Flash banner shows "Reset link verified"
6. Sets new password -> redirected to default route with `flash=password_updated`

## Invite Flow
1. Admin invites new user via `/admin/users` with email, role, and optional team
2. User receives styled invite email
3. Clicks link -> `/auth/confirm` verifies token -> redirects to `/auth/accept-invite`
4. Flash banner shows "Invitation verified"
5. Sets password and completes account setup -> redirected with `flash=invite_completed`

## Sign Out Flow
1. User clicks "Sign out" button
2. Supabase session cleared, SessionRefresh triggers re-render
3. Redirected to `/sign-in?flash=signed_out`
4. Flash banner shows "Signed out" confirmation

## Auth Error Flow
1. If a confirmation link has an invalid/expired token or missing type, user lands on `/auth/error`
2. Page shows a descriptive error message
3. Links to sign-in page and password reset for recovery
