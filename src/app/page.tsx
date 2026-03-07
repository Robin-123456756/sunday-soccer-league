import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cardStyle, pageStyle, secondaryButtonStyle } from '@/components/ui/styles';
import { getCurrentUserProfileOrNull, getDefaultRouteForRole } from '@/server/queries/auth';

export default async function HomePage() {
  const profile = await getCurrentUserProfileOrNull();

  if (profile?.is_active) {
    redirect(getDefaultRouteForRole(profile.role));
  }

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div style={cardStyle}>
          <h1 style={{ marginTop: 0 }}>Sunday Soccer League</h1>
          <p>
            This starter includes match management, lineups, referee reporting, card recording, team sheet uploads,
            exports, role-aware dashboards, and admin-ready operations.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/sign-in" style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Sign in</Link>
            <Link href="/matches" style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Browse matches</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
