export type FlashTone = 'success' | 'error' | 'info';

export type FlashConfig = {
  title: string;
  message: string;
  tone: FlashTone;
};

export const AUTH_FLASHES: Record<string, FlashConfig> = {
  invite_verified: {
    title: 'Invitation verified',
    message: 'Set your name and password to finish joining the league system.',
    tone: 'success',
  },
  invite_completed: {
    title: 'Account ready',
    message: 'Your account setup is complete and you are now signed in.',
    tone: 'success',
  },
  recovery_verified: {
    title: 'Reset link verified',
    message: 'Choose your new password below to finish securing your account.',
    tone: 'success',
  },
  password_updated: {
    title: 'Password updated',
    message: 'Your password has been changed successfully.',
    tone: 'success',
  },
  signed_out: {
    title: 'Signed out',
    message: 'You have been signed out successfully.',
    tone: 'info',
  },
  auth_required: {
    title: 'Sign in required',
    message: 'Please sign in to continue.',
    tone: 'info',
  },
  unauthorized: {
    title: 'Access limited',
    message: 'That page is not available for your role, so you were redirected.',
    tone: 'info',
  },
  inactive_profile: {
    title: 'Account inactive',
    message: 'Your profile is not active yet. Contact an admin if this looks wrong.',
    tone: 'error',
  },
  invalid_link: {
    title: 'Link problem',
    message: 'This sign-in link is missing information or has already been used.',
    tone: 'error',
  },
  expired_link: {
    title: 'Link expired',
    message: 'That auth link could not be completed. Request a fresh one and try again.',
    tone: 'error',
  },
};

export function getFlashFromCode(code: string | null | undefined): FlashConfig | null {
  if (!code) return null;
  return AUTH_FLASHES[code] ?? null;
}
