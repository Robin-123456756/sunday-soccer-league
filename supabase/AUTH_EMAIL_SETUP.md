# Supabase Auth Email Setup

This project uses Supabase Auth for:
- password reset emails
- admin invite emails
- email/password sign-in after onboarding

## 1. Configure URL settings
In Supabase Dashboard:
- Authentication -> URL Configuration

Set:
- Site URL: `http://localhost:3000`
- Redirect URLs:
  - `http://localhost:3000/auth/update-password`
  - `http://localhost:3000/auth/accept-invite`
  - `http://localhost:3000/sign-in`
  - your production domain equivalents later

## 2. Open the email templates page
In Supabase Dashboard:
- Authentication -> Email Templates

Templates you should edit for this project:
- Invite user
- Reset password

## 3. Recommended subjects
### Invite user subject
`You have been invited to the Sunday Soccer League system`

### Reset password subject
`Reset your Sunday Soccer League password`

## 4. Recommended template approach
For this project, keep the link target as `{{ .ConfirmationURL }}`.
That works well with the existing invite and password reset flows because Supabase verifies the token and then redirects the user to the `redirectTo` URL defined by the app.

## 5. Invite user HTML
Paste the contents of `supabase/email-templates/invite-user.html` into the **Invite user** template.

## 6. Reset password HTML
Paste the contents of `supabase/email-templates/reset-password.html` into the **Reset password** template.

## 7. Optional plain-text fallbacks
If you prefer plain text, use the matching `.txt` files in `supabase/email-templates/`.

## 8. Production checklist
Before going live:
- replace `http://localhost:3000` with your real domain in URL Configuration
- make sure the same production URLs are added to Redirect URLs
- send yourself a test invite
- send yourself a test password reset email
- confirm both links land on the correct pages in the app
