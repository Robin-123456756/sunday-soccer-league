import Link from 'next/link';
import { cardStyle, mutedTextStyle, pageStyle, secondaryButtonStyle, sectionTitleStyle } from '@/components/ui/styles';
import { getCurrentUserProfile, requireRole } from '@/server/queries/auth';
import { getMatches } from '@/server/queries/matches';
import { getTeamById } from '@/server/queries/teams';

export default async function TeamManagerLineupsPage() {
  await requireRole(['team_manager', 'admin']);
  const profile = await getCurrentUserProfile();

  if (!profile.team_id) {
    return (
      <main style={pageStyle}><div style={{ maxWidth: 1000, margin: '0 auto' }}><div style={cardStyle}><h1>No team assigned</h1><p style={mutedTextStyle}>Your user profile needs a team before you can manage lineups.</p></div></div></main>
    );
  }

  const [team, matches] = await Promise.all([getTeamById(profile.team_id), getMatches()]);
  const teamMatches = matches.filter((m) => m.home_team?.id === profile.team_id || m.away_team?.id === profile.team_id);

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>My team lineups</h1>
          <p style={mutedTextStyle}>Only {team?.name ?? 'your team'} lineups can be edited from this area.</p>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {teamMatches.length === 0 ? (
            <div style={cardStyle}><p style={mutedTextStyle}>No matches found yet for your team.</p></div>
          ) : teamMatches.map((match) => (
            <div key={match.id} style={{ ...cardStyle, display: 'grid', gap: 12 }}>
              <div>
                <h2 style={sectionTitleStyle}>{match.home_team?.name ?? 'Home'} vs {match.away_team?.name ?? 'Away'}</h2>
                <p style={mutedTextStyle}>{match.match_date} {"\u00b7"}{match.kickoff_time ?? 'Time TBD'} {"\u00b7"}{match.venue ?? 'Venue TBD'}</p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href={`/matches/${match.id}`} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Open match</Link>
                <Link href={`/matches/${match.id}/lineups?teamId=${profile.team_id}`} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Edit my lineup</Link>
                <Link href={`/matches/${match.id}/uploads?teamId=${profile.team_id}`} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Upload team sheet</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
