import Link from 'next/link';
import { SaveLineupForm } from '@/components/forms/SaveLineupForm';
import { pageStyle, cardStyle } from '@/components/ui/styles';
import { getCurrentUserProfile } from '@/server/queries/auth';
import { getMatchDetails, getMatchLineupRows } from '@/server/queries/matches';
import { getPlayersByTeam } from '@/server/queries/players';

export default async function MatchLineupsPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const [profile, match] = await Promise.all([getCurrentUserProfile(), getMatchDetails(matchId)]);

  const teams = [match.home_team, match.away_team].filter(Boolean) as Array<{ id: string; name: string }>;
  const visibleTeams = profile.role === 'team_manager' ? teams.filter((team) => team.id === profile.team_id) : teams;

  const teamData = await Promise.all(
    visibleTeams.map(async (team) => {
      const [players, lineupRows] = await Promise.all([
        getPlayersByTeam(team.id),
        getMatchLineupRows(matchId, team.id),
      ]);
      return { team, players, lineupRows };
    })
  );

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <Link href="/matches">← Back to matches</Link>
          <h1>Match lineups</h1>
          <p style={{ color: '#4b5563' }}>{match.home_team?.name} vs {match.away_team?.name}</p>
        </div>

        <div style={cardStyle}>
          <strong>Permission note:</strong> team managers can only edit their own team lineup; admins can manage both teams.
        </div>

        {teamData.map(({ team, players, lineupRows }) => (
          <SaveLineupForm
            key={team.id}
            matchId={matchId}
            teamId={team.id}
            teamName={team.name}
            players={players}
            initialStarterIds={lineupRows.filter((row) => row.lineup_type === 'starter').map((row) => row.player_id)}
            initialBenchIds={lineupRows.filter((row) => row.lineup_type === 'bench').map((row) => row.player_id)}
            initialCaptainId={lineupRows.find((row) => row.is_captain)?.player_id ?? null}
          />
        ))}
      </div>
    </main>
  );
}
