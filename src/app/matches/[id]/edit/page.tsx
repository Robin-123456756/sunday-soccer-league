import { notFound } from 'next/navigation';
import { pageStyle } from '@/components/ui/styles';
import { EditMatchForm } from '@/components/forms/EditMatchForm';
import { DangerZone } from '@/components/forms/DangerZone';
import { archiveMatch, deleteMatch, restoreMatch } from '@/server/actions/archive';
import { requireRolePage } from '@/server/queries/auth';
import { getMatchById } from '@/server/queries/matches';
import { getReferees } from '@/server/queries/referees';
import { getTeams } from '@/server/queries/teams';

export default async function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRolePage(['admin']);
  const { id } = await params;
  const [match, teams, referees] = await Promise.all([
    getMatchById(id, { includeArchived: true }),
    getTeams(),
    getReferees(),
  ]);
  if (!match) notFound();

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gap: 20 }}>
        <EditMatchForm match={match} teams={teams} referees={referees.map((r) => ({ id: r.id, full_name: r.full_name }))} />
        <DangerZone
          title={match.is_archived ? 'Restore match' : 'Archive match'}
          description={match.is_archived ? 'Restore this match to active lists.' : 'Archive this match without deleting its events and reports.'}
          actionLabel={match.is_archived ? 'Restore match' : 'Archive match'}
          action={() => (match.is_archived ? restoreMatch(id) : archiveMatch(id))}
        />
        <DangerZone
          title="Delete match"
          description="Permanently delete this match and its dependent matchday records. Use with care."
          actionLabel="Delete match"
          action={() => deleteMatch(id)}
        />
      </div>
    </main>
  );
}
