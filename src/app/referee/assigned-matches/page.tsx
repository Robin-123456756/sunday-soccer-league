import Link from 'next/link';
import { cardStyle, mutedTextStyle, pageStyle, secondaryButtonStyle, sectionTitleStyle } from '@/components/ui/styles';
import { getCurrentUserProfile, requireRole } from '@/server/queries/auth';
import { getMatches, getMatchesAssignedToCurrentReferee } from '@/server/queries/matches';

export default async function RefereeAssignedMatchesPage() {
  await requireRole(['referee', 'admin']);
  const profile = await getCurrentUserProfile();
  const myMatches = profile.role === 'admin' ? await getMatches() : await getMatchesAssignedToCurrentReferee(profile.email);

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Assigned matches</h1>
          <p style={mutedTextStyle}>Referees can enter cards and reports directly for their assigned matches.</p>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          {myMatches.length === 0 ? (
            <div style={cardStyle}><p style={mutedTextStyle}>No assigned matches found.</p></div>
          ) : myMatches.map((match) => (
            <div key={match.id} style={{ ...cardStyle, display: 'grid', gap: 12 }}>
              <div>
                <h2 style={sectionTitleStyle}>{match.home_team?.name ?? 'Home'} vs {match.away_team?.name ?? 'Away'}</h2>
                <p style={mutedTextStyle}>{match.match_date} {"\u00b7"}{match.kickoff_time ?? 'Time TBD'} {"\u00b7"}{match.status}</p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href={`/matches/${match.id}`} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Open match</Link>
                <Link href={`/matches/${match.id}/cards`} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Enter cards</Link>
                <Link href={`/matches/${match.id}/referee-report`} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Submit report</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
