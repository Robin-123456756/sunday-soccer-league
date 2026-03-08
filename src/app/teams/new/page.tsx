import { pageStyle } from '@/components/ui/styles';
import { TeamForm } from '@/components/forms/TeamForm';
import { requireRolePage } from '@/server/queries/auth';

export default async function NewTeamPage() {
  await requireRolePage(['admin']);

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <TeamForm mode="create" />
      </div>
    </main>
  );
}
