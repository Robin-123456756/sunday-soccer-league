import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import './globals.css';
import { shellStyle } from '@/components/ui/styles';
import { GlobalFlashBanner } from '@/components/auth/GlobalFlashBanner';
import { SessionRefresh } from '@/components/auth/SessionRefresh';
import { getCurrentUserProfileOrNull } from '@/server/queries/auth';
import { SignOutButton } from '@/components/forms/SignOutButton';
import { MobileNav } from '@/components/ui/MobileNav';

export const metadata = {
  title: 'Sunday Soccer League',
  description: 'Matchday recording system for a Sunday soccer league',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const publicLinks = [{ href: '/sign-in', label: 'Sign in' }];

const roleLinks = {
  admin: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/matches', label: 'Matches' },
    { href: '/teams', label: 'Teams' },
    { href: '/players', label: 'Players' },
    { href: '/referees', label: 'Referees' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/settings', label: 'Settings' },
    { href: '/reports/exports', label: 'Exports' },
    { href: '/reports/discipline', label: 'Discipline' },
    { href: '/reports/appearances', label: 'Appearances' },
  ],
  team_manager: [
    { href: '/team-manager/lineups', label: 'My lineups' },
    { href: '/matches', label: 'Matches' },
  ],
  referee: [
    { href: '/referee/assigned-matches', label: 'Assigned matches' },
    { href: '/matches', label: 'Matches' },
  ],
} as const;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentUserProfileOrNull();
  const links = profile ? [...roleLinks[profile.role]] : [...publicLinks];

  return (
    <html lang="en">
      <body style={shellStyle}>
        <SessionRefresh />
        <MobileNav
          links={links}
          userSlot={
            profile ? (
              <>
                <div style={{ fontSize: 14 }}>
                  <strong>{profile.full_name ?? profile.email ?? 'User'}</strong>
                  <div style={{ color: '#4b5563', textTransform: 'capitalize' }}>{profile.role.replace('_', ' ')}</div>
                </div>
                <SignOutButton />
              </>
            ) : null
          }
        />
        <GlobalFlashBanner />
        {children}
      </body>
    </html>
  );
}
