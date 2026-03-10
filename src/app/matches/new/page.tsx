import { CreateMatchForm } from '@/components/forms/CreateMatchForm';
import { pageStyle } from '@/components/ui/styles';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getReferees } from '@/server/queries/referees';
import { getTeams } from '@/server/queries/teams';
import { requireRolePage } from '@/server/queries/auth';

export default async function NewMatchPage() {
  await requireRolePage(['admin']);
  const [teams, referees] = await Promise.all([getTeams(), getReferees()]);

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <Breadcrumbs items={[{ label: 'Matches', href: '/matches' }, { label: 'New match' }]} />
          <h1>Create a match</h1>
        </div>
        <CreateMatchForm teams={teams} referees={referees} />
      </div>
    </main>
  );
}
