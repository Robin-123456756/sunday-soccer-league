import { pageStyle } from '@/components/ui/styles';
import { PlayerForm } from '@/components/forms/PlayerForm';
import { requireRolePage } from '@/server/queries/auth';
import { getTeams } from '@/server/queries/teams';

export default async function NewPlayerPage() {
  await requireRolePage(['admin']);
  const teams = await getTeams();
  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <PlayerForm mode="create" teams={teams} />
      </div>
    </main>
  );
}
