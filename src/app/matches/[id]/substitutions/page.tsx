import { RecordSubstitutionForm } from '@/components/forms/RecordSubstitutionForm';
import { pageStyle } from '@/components/ui/styles';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { requireRolePage } from '@/server/queries/auth';
import { getMatchDetails, getMatchSubstitutions } from '@/server/queries/matches';
import { getPlayersByTeam } from '@/server/queries/players';

export default async function MatchSubstitutionsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRolePage(['admin', 'referee']);
  const { id } = await params;
  const match = await getMatchDetails(id);
  const teams = [match.home_team, match.away_team].filter(Boolean) as Array<{ id: string; name: string }>;
  const playerEntries = await Promise.all(teams.map(async (team) => [team.id, await getPlayersByTeam(team.id)] as const));
  const playersByTeam = Object.fromEntries(playerEntries);
  const substitutions = await getMatchSubstitutions(id);

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <Breadcrumbs items={[{ label: 'Matches', href: '/matches' }, { label: `${match.home_team?.name} vs ${match.away_team?.name}`, href: `/matches/${id}` }, { label: 'Substitutions' }]} />
          <h1>Substitutions</h1>
          <p style={{ color: '#4b5563' }}>{match.home_team?.name} vs {match.away_team?.name}</p>
        </div>
        <RecordSubstitutionForm
          matchId={id}
          teams={teams}
          playersByTeam={playersByTeam}
          existingSubstitutions={substitutions}
        />
      </div>
    </main>
  );
}
