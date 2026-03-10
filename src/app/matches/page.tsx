import Link from 'next/link';
import { cardStyle, inputStyle, labelStyle, pageStyle, secondaryButtonStyle, buttonStyle, mutedTextStyle } from '@/components/ui/styles';
import { getMatches } from '@/server/queries/matches';
import { getTeams } from '@/server/queries/teams';
import { getReferees } from '@/server/queries/referees';
import { requireSignedInPage } from '@/server/queries/auth';

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const profile = await requireSignedInPage();
  const params = await searchParams;

  const teamId = typeof params.team === 'string' ? params.team : undefined;
  const refereeId = typeof params.referee === 'string' ? params.referee : undefined;
  const status = typeof params.status === 'string' ? params.status : undefined;
  const dateFrom = typeof params.dateFrom === 'string' ? params.dateFrom : undefined;
  const dateTo = typeof params.dateTo === 'string' ? params.dateTo : undefined;

  const hasFilters = teamId || refereeId || status || dateFrom || dateTo;

  const [matches, teams, referees] = await Promise.all([
    getMatches({ teamId, refereeId, status, dateFrom, dateTo }),
    getTeams(),
    getReferees(),
  ]);

  return (
    <main className="page-main" style={pageStyle}>
      <div className="page-container" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ marginBottom: 8 }}>Matches</h1>
            <p style={mutedTextStyle}>Create fixtures and jump into lineups, cards, reports, uploads, and overview pages.</p>
          </div>
          {profile.role === 'admin' ? (
            <Link href="/matches/new" style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              + Create match
            </Link>
          ) : null}
        </div>

        {/* Filters */}
        <form method="GET" style={{ ...cardStyle, display: 'grid', gap: 12 }}>
          <div className="filter-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <label>
              <span style={labelStyle}>Team</span>
              <select name="team" defaultValue={teamId ?? ''} style={inputStyle}>
                <option value="">All teams</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </label>
            <label>
              <span style={labelStyle}>Referee</span>
              <select name="referee" defaultValue={refereeId ?? ''} style={inputStyle}>
                <option value="">All referees</option>
                {referees.map((r) => <option key={r.id} value={r.id}>{r.full_name}</option>)}
              </select>
            </label>
            <label>
              <span style={labelStyle}>Status</span>
              <select name="status" defaultValue={status ?? ''} style={inputStyle}>
                <option value="">All statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
                <option value="postponed">Postponed</option>
              </select>
            </label>
            <label>
              <span style={labelStyle}>Date from</span>
              <input name="dateFrom" type="date" defaultValue={dateFrom ?? ''} style={inputStyle} />
            </label>
            <label>
              <span style={labelStyle}>Date to</span>
              <input name="dateTo" type="date" defaultValue={dateTo ?? ''} style={inputStyle} />
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={{ ...buttonStyle, padding: '8px 20px' }}>Search</button>
            {hasFilters ? (
              <Link href="/matches" style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '8px 20px' }}>
                Clear filters
              </Link>
            ) : null}
          </div>
        </form>

        {/* Results */}
        <div style={{ display: 'grid', gap: 12 }}>
          {matches.length === 0 ? (
            <div style={cardStyle}>
              {hasFilters
                ? 'No matches found for the selected filters.'
                : 'No matches yet. Create the first fixture to start recording matchday information.'}
            </div>
          ) : (
            <>
              <p style={mutedTextStyle}>{matches.length} match{matches.length !== 1 ? 'es' : ''} found</p>
              {matches.map((match) => (
                <div key={match.id} style={{ ...cardStyle, display: 'grid', gap: 12 }}>
                  <div>
                    <h2 style={{ margin: '0 0 8px' }}>{match.home_team?.name ?? 'Home team'} vs {match.away_team?.name ?? 'Away team'}</h2>
                    <p style={{ margin: 0, color: '#4b5563' }}>
                      {match.match_date} {"\u00b7"}{match.kickoff_time ?? 'Time TBD'} {"\u00b7"}{match.venue ?? 'Venue TBD'} {"\u00b7"}{match.status}
                    </p>
                    <p style={{ margin: '8px 0 0', color: '#4b5563' }}>Referee: {match.referee?.full_name ?? 'Not assigned'}</p>
                  </div>
                  <div className="action-buttons" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <NavButton href={`/matches/${match.id}`} label="Overview" />
                    {profile.role === 'admin' ? <NavButton href={`/matches/${match.id}/edit`} label="Edit match" /> : null}
                    {(profile.role === 'admin' || profile.role === 'team_manager') ? <NavButton href={`/matches/${match.id}/lineups`} label="Lineups" /> : null}
                    {(profile.role === 'admin' || profile.role === 'referee') ? <NavButton href={`/matches/${match.id}/substitutions`} label="Substitutions" /> : null}
                    {(profile.role === 'admin' || profile.role === 'referee') ? <NavButton href={`/matches/${match.id}/cards`} label="Cards" /> : null}
                    {(profile.role === 'admin' || profile.role === 'referee') ? <NavButton href={`/matches/${match.id}/referee-report`} label="Referee report" /> : null}
                    {(profile.role === 'admin' || profile.role === 'team_manager') ? <NavButton href={`/matches/${match.id}/uploads`} label="Uploads" /> : null}
                  </div>
                </div>
              ))}
            </>
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
