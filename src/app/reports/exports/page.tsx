import { cardStyle, pageStyle, mutedTextStyle } from '@/components/ui/styles';
import { requireRolePage } from '@/server/queries/auth';
import { getTeams } from '@/server/queries/teams';
import { ExportForm } from '@/components/forms/ExportForm';

export default async function ExportsPage() {
  await requireRolePage(['admin']);
  const teams = await getTeams();

  return (
    <main style={{ ...pageStyle, padding: 24 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Exports</h1>
          <p style={mutedTextStyle}>Generate CSV or Excel files for player details, discipline records, and appearances.</p>
        </div>

        <section style={cardStyle}>
          <ExportForm teams={teams} />
        </section>
      </div>
    </main>
  );
}
