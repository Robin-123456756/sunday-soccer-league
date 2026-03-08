import { notFound } from 'next/navigation';
import { pageStyle } from '@/components/ui/styles';
import { PlayerForm } from '@/components/forms/PlayerForm';
import { DangerZone } from '@/components/forms/DangerZone';
import { archivePlayer, deletePlayer, restorePlayer } from '@/server/actions/archive';
import { requireRolePage } from '@/server/queries/auth';
import { getPlayerRecord } from '@/server/queries/players';
import { getTeams } from '@/server/queries/teams';

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRolePage(['admin']);
  const { id } = await params;
  const [player, teams] = await Promise.all([getPlayerRecord(id), getTeams()]);
  if (!player) notFound();

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gap: 20 }}>
        <PlayerForm mode="edit" teams={teams} initialValues={player} />
        <DangerZone
          title={player.is_active ? 'Archive player' : 'Restore player'}
          description={player.is_active ? 'Archive this player to keep history without showing them as active.' : 'Restore this player to active squad selection.'}
          actionLabel={player.is_active ? 'Archive player' : 'Restore player'}
          action={() => (player.is_active ? archivePlayer(id) : restorePlayer(id))}
        />
        <DangerZone
          title="Delete player"
          description="Permanently delete this player. Use this only if the record was created by mistake."
          actionLabel="Delete player"
          action={() => deletePlayer(id)}
        />
      </div>
    </main>
  );
}
