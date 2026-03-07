import Link from 'next/link';
import { cardStyle, pageStyle, secondaryButtonStyle } from '@/components/ui/styles';
import { getMatches } from '@/server/queries/matches';

export default async function MatchesPage() {
  const matches = await getMatches();

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ marginBottom: 8 }}>Matches</h1>
            <p style={{ color: '#4b5563', margin: 0 }}>Create fixtures and jump into lineups, cards, reports, uploads, and overview pages.</p>
          </div>
          <Link href="/matches/new" style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            + Create match
          </Link>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {matches.length === 0 ? (
            <div style={cardStyle}>No matches yet. Create the first fixture to start recording matchday information.</div>
          ) : (
            matches.map((match) => (
              <div key={match.id} style={{ ...cardStyle, display: 'grid', gap: 12 }}>
                <div>
                  <h2 style={{ margin: '0 0 8px' }}>{match.home_team?.name ?? 'Home team'} vs {match.away_team?.name ?? 'Away team'}</h2>
                  <p style={{ margin: 0, color: '#4b5563' }}>
                    {match.match_date} · {match.kickoff_time ?? 'Time TBD'} · {match.venue ?? 'Venue TBD'} · {match.status}
                  </p>
                  <p style={{ margin: '8px 0 0', color: '#4b5563' }}>Referee: {match.referee?.full_name ?? 'Not assigned'}</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <NavButton href={`/matches/${match.id}`} label="Overview" />
                  <NavButton href={`/matches/${match.id}/lineups`} label="Lineups" />
                  <NavButton href={`/matches/${match.id}/cards`} label="Cards" />
                  <NavButton href={`/matches/${match.id}/referee-report`} label="Referee report" />
                  <NavButton href={`/matches/${match.id}/uploads`} label="Uploads" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function NavButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
      {label}
    </Link>
  );
}
