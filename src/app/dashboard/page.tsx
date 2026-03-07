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
import { getDashboardStats, getRecentCardEvents } from '@/server/queries/dashboard';

export default async function DashboardPage() {
  const [stats, matches, recentCards] = await Promise.all([
    getDashboardStats(),
    getMatches(),
    getRecentCardEvents(),
  ]);

  const upcomingMatches = matches.slice(0, 5);

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Sunday Soccer League Dashboard</h1>
          <p style={mutedTextStyle}>Review fixtures, reports, incidents, teams, and exports from one place.</p>
        </div>

        <div style={gridStyle}>
          <StatCard label="Matches" value={stats.totalMatches} helper={`${stats.scheduledMatches} scheduled · ${stats.completedMatches} completed`} />
          <StatCard label="Teams" value={stats.totalTeams} helper="Registered clubs in the league" />
          <StatCard label="Players" value={stats.totalPlayers} helper="Available across all squads" />
          <StatCard label="Referees" value={stats.totalReferees} helper={`${stats.pendingReports} matches need referee reports`} />
        </div>

        <div style={gridStyle}>
          <div style={{ ...cardStyle, minHeight: 320 }}>
            <h2 style={sectionTitleStyle}>Quick actions</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/matches/new" style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Create match</Link>
              <Link href="/matches" style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Open matches</Link>
              <Link href="/players" style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>View players</Link>
              <Link href="/reports/exports" style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Generate export</Link>
            </div>
            <p style={{ ...mutedTextStyle, marginTop: 14 }}>Total recorded card events: {stats.totalCards}</p>
          </div>

          <div style={{ ...cardStyle, minHeight: 320 }}>
            <h2 style={sectionTitleStyle}>Recent matches</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {upcomingMatches.length === 0 ? (
                <p style={mutedTextStyle}>No matches have been created yet.</p>
              ) : (
                upcomingMatches.map((match) => (
                  <div key={match.id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 12 }}>
                    <strong>{match.home_team?.name ?? 'Home'} vs {match.away_team?.name ?? 'Away'}</strong>
                    <p style={{ ...mutedTextStyle, marginTop: 6 }}>{match.match_date} · {match.kickoff_time ?? 'Time TBD'} · {match.status}</p>
                    <Link href={`/matches/${match.id}`} style={{ color: '#111827' }}>Open match →</Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Recent card incidents</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {recentCards.length === 0 ? (
              <p style={mutedTextStyle}>No card incidents recorded yet.</p>
            ) : (
              recentCards.map((event) => (
                <div key={event.id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 12 }}>
                  <strong>{event.player?.full_name ?? 'Unknown player'}</strong>
                  <p style={{ ...mutedTextStyle, marginTop: 6 }}>
                    {event.match?.home_team?.name ?? 'Home'} vs {event.match?.away_team?.name ?? 'Away'} · {event.card_type} · {event.minute}'
                  </p>
                  <p style={{ ...mutedTextStyle, marginTop: 6 }}>{event.reason}</p>
                </div>
              ))
            )}
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
