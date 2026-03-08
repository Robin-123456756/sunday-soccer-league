import { pageStyle } from '@/components/ui/styles';
import { RefereeForm } from '@/components/forms/RefereeForm';
import { requireRolePage } from '@/server/queries/auth';

export default async function NewRefereePage() {
  await requireRolePage(['admin']);
  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <RefereeForm mode="create" />
      </div>
    </main>
  );
}
