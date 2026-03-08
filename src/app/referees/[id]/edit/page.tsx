import { notFound } from 'next/navigation';
import { pageStyle } from '@/components/ui/styles';
import { RefereeForm } from '@/components/forms/RefereeForm';
import { DangerZone } from '@/components/forms/DangerZone';
import { archiveReferee, deleteReferee, restoreReferee } from '@/server/actions/archive';
import { requireRolePage } from '@/server/queries/auth';
import { getRefereeRecord } from '@/server/queries/referees';

export default async function EditRefereePage({ params }: { params: Promise<{ id: string }> }) {
  await requireRolePage(['admin']);
  const { id } = await params;
  const referee = await getRefereeRecord(id);
  if (!referee) notFound();

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gap: 20 }}>
        <RefereeForm mode="edit" initialValues={referee} />
        <DangerZone
          title={referee.is_active ? 'Archive referee' : 'Restore referee'}
          description={referee.is_active ? 'Archive this referee to remove them from active assignment lists.' : 'Restore this referee to active assignment lists.'}
          actionLabel={referee.is_active ? 'Archive referee' : 'Restore referee'}
          action={() => (referee.is_active ? archiveReferee(id) : restoreReferee(id))}
        />
        <DangerZone
          title="Delete referee"
          description="Permanently delete this referee record. Only use this when the record is invalid and not needed."
          actionLabel="Delete referee"
          action={() => deleteReferee(id)}
        />
      </div>
    </main>
  );
}
