import type { ReactNode } from 'react';
import Link from 'next/link';
import { navStyle, shellStyle, secondaryButtonStyle } from '@/components/ui/styles';
import { getCurrentUserProfileOrNull } from '@/server/queries/auth';
import { SignOutButton } from '@/components/forms/SignOutButton';

export const metadata = {
  title: 'Sunday Soccer League',
  description: 'Matchday recording system for a Sunday soccer league',
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
  const links = profile ? roleLinks[profile.role] : publicLinks;

  return (
    <html lang="en">
      <body style={shellStyle}>
        <nav style={{ ...navStyle, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {profile ? (
              <>
                <div style={{ fontSize: 14 }}>
                  <strong>{profile.full_name ?? profile.email ?? 'User'}</strong>
                  <div style={{ color: '#4b5563', textTransform: 'capitalize' }}>{profile.role.replace('_', ' ')}</div>
                </div>
                <SignOutButton />
              </>
            ) : null}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
