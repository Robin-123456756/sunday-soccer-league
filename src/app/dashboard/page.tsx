import Link from 'next/link';
import {
  cardStyle,
  gridStyle,
  mutedTextStyle,
  pageStyle,
  secondaryButtonStyle,
  sectionTitleStyle,
} from '@/components/ui/styles';
import { getMatches } from '@/server/queries/matches';
import { requireSignedInPage } from '@/server/queries/auth';
import {
  getDashboardStats,
  getRecentCardEvents,
  getRefereeDashboardData,
  getTeamManagerDashboardData,
} from '@/server/queries/dashboard';

export default async function DashboardPage() {
  const profile = await requireSignedInPage();
  const [stats, matches, recentCards] = await Promise.all([
    getDashboardStats(),
    getMatches(),
    getRecentCardEvents(),
  ]);

  const upcomingMatches = matches.slice(0, 5);
  const teamManagerData = profile.team_id ? await getTeamManagerDashboardData(profile.team_id) : null;
  const refereeData = profile.role === 'referee' ? await getRefereeDashboardData(profile) : null;

  return (
    <main className="page-main" style={pageStyle}>
      <div className="page-container" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Sunday Soccer League Dashboard</h1>
          <p style={mutedTextStyle}>Welcome {profile.full_name ?? profile.email ?? 'league user'}. Your dashboard is tailored to your role: {profile.role}.</p>
        </div>

        <div style={gridStyle}>
          <StatCard label="Matches" value={stats.totalMatches} helper={`${stats.scheduledMatches} scheduled {"\u00b7"}${stats.completedMatches} completed`} />
          <StatCard label="Teams" value={stats.totalTeams} helper="Registered clubs in the league" />
          <StatCard label="Players" value={stats.totalPlayers} helper="Available across all squads" />
          <StatCard label="Referees" value={stats.totalReferees} helper={`${stats.pendingReports} matches need referee reports`} />
        </div>

        {profile.role === 'admin' ? (
          <div style={gridStyle}>
            <RoleCard
              title="Admin controls"
              description={`Total recorded card events: ${stats.totalCards}. Manage exports, users, and operational data.`}
              links={[
                { href: '/matches/new', label: 'Create match' },
                { href: '/admin/users', label: 'Manage users' },
                { href: '/admin/settings', label: 'Open settings' },
                { href: '/reports/exports', label: 'Generate export' },
              ]}
            />
            <RoleCard
              title="League operations"
              description="Use the admin area to edit records, archive data, and keep matchday operations consistent."
              links={[
                { href: '/teams', label: 'Manage teams' },
                { href: '/players', label: 'Manage players' },
                { href: '/referees', label: 'Manage referees' },
                { href: '/matches', label: 'Open matches' },
              ]}
            />
          </div>
        ) : null}

        {profile.role === 'team_manager' ? (
          <div style={gridStyle}>
            <StatCard label="My lineups saved" value={teamManagerData?.lineupCount ?? 0} helper="Saved lineup rows for your team" />
            <StatCard label="My uploads" value={teamManagerData?.uploadCount ?? 0} helper="Team sheet uploads linked to your team" />
            <RoleCard
              title="Team manager area"
              description="Use the dedicated lineup area to edit only your own team's lineups and team sheet uploads."
              links={[
                { href: '/team-manager/lineups', label: 'Open my lineups' },
                { href: '/matches', label: 'View matches' },
              ]}
            />
          </div>
        ) : null}

        {profile.role === 'referee' ? (
          <div style={gridStyle}>
            <StatCard label="Assigned matches" value={refereeData?.assignedMatches.length ?? 0} helper="Matches assigned to you" />
            <StatCard label="Reports submitted" value={refereeData?.reportsCount ?? 0} helper="Reports already filed" />
            <StatCard label="Cards entered" value={refereeData?.cardCount ?? 0} helper="Card events across your matches" />
            <RoleCard
              title="Referee area"
              description="Go straight to your assigned matches to submit cards and referee reports."
              links={[
                { href: '/referee/assigned-matches', label: 'Open assigned matches' },
                { href: '/matches', label: 'Browse all matches' },
              ]}
            />
          </div>
        ) : null}

        <div style={gridStyle}>
          <div style={{ ...cardStyle, minHeight: 320 }}>
            <h2 style={sectionTitleStyle}>Recent matches</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {upcomingMatches.length === 0 ? (
                <p style={mutedTextStyle}>No matches have been created yet.</p>
              ) : (
                upcomingMatches.map((match) => (
                  <div key={match.id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 12 }}>
                    <strong>{match.home_team?.name ?? 'Home'} vs {match.away_team?.name ?? 'Away'}</strong>
                    <p style={{ ...mutedTextStyle, marginTop: 6 }}>{match.match_date} {"\u00b7"}{match.kickoff_time ?? 'Time TBD'} {"\u00b7"}{match.status}</p>
                    <Link href={`/matches/${match.id}`} style={{ color: '#111827' }}>Open match {"\u2192"}</Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ ...cardStyle, minHeight: 320 }}>
            <h2 style={sectionTitleStyle}>Recent card incidents</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {recentCards.length === 0 ? (
                <p style={mutedTextStyle}>No card incidents recorded yet.</p>
              ) : (
                recentCards.map((event) => (
                  <div key={event.id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 12 }}>
                    <strong>{event.player?.full_name ?? 'Unknown player'}</strong>
                    <p style={{ ...mutedTextStyle, marginTop: 6 }}>
                      {event.match?.home_team?.name ?? 'Home'} vs {event.match?.away_team?.name ?? 'Away'} {"\u00b7"}{event.card_type} {"\u00b7"}{event.minute}&apos;
                    </p>
                    <p style={{ ...mutedTextStyle, marginTop: 6 }}>{event.reason}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, helper }: { label: string; value: number; helper: string }) {
  return (
    <div style={cardStyle}>
      <p style={{ ...mutedTextStyle, marginBottom: 10 }}>{label}</p>
      <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{value}</div>
      <p style={mutedTextStyle}>{helper}</p>
    </div>
  );
}

function RoleCard({ title, description, links }: { title: string; description: string; links: { href: string; label: string }[] }) {
  return (
    <div style={cardStyle}>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <p style={{ ...mutedTextStyle, marginBottom: 14 }}>{description}</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>{link.label}</Link>
        ))}
      </div>
    </div>
  );
}
