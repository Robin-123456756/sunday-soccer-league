import { notFound } from 'next/navigation';
import { pageStyle } from '@/components/ui/styles';
import { TeamForm } from '@/components/forms/TeamForm';
import { DangerZone } from '@/components/forms/DangerZone';
import { archiveTeam, deleteTeam, restoreTeam } from '@/server/actions/archive';
import { requireRolePage } from '@/server/queries/auth';
import { getTeamRecord } from '@/server/queries/teams';

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRolePage(['admin']);
  const { id } = await params;
  const team = await getTeamRecord(id);
  if (!team) notFound();

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gap: 20 }}>
        <TeamForm mode="edit" initialValues={team} />
        <DangerZone
          title={team.is_archived ? 'Restore team' : 'Archive team'}
          description={team.is_archived ? 'Restore this team to active league workflows.' : 'Archive this team without deleting its historical records.'}
          actionLabel={team.is_archived ? 'Restore team' : 'Archive team'}
          action={() => (team.is_archived ? restoreTeam(id) : archiveTeam(id))}
        />
        <DangerZone
          title="Delete team"
          description="Permanently delete this team. This can fail if players or matches still reference the team."
          actionLabel="Delete team"
          action={() => deleteTeam(id)}
        />
      </div>
    </main>
  );
}
