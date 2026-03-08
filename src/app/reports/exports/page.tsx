import { cardStyle, pageStyle } from '@/components/ui/styles';
import { requireRolePage } from '@/server/queries/auth';

export default async function ExportsPage() {
  await requireRolePage(['admin']);

  return (
    <main style={{ ...pageStyle, padding: 24 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Exports</h1>
          <p style={{ margin: 0, color: '#4b5563' }}>Only admins can generate CSV or Excel files for player details and league reports.</p>
        </div>

        <section style={{ ...cardStyle, display: 'grid', gap: 8 }}>
          <h2 style={{ margin: 0 }}>Export filters</h2>
          <ul style={{ margin: 0, color: '#4b5563' }}>
            <li>Team</li>
            <li>Player</li>
            <li>Season</li>
            <li>Matchday</li>
            <li>Date range</li>
            <li>Card type</li>
          </ul>
        </section>

        <section style={{ ...cardStyle, display: 'grid', gap: 8 }}>
          <h2 style={{ margin: 0 }}>Formats</h2>
          <p style={{ margin: 0, color: '#4b5563' }}>CSV and Excel (.xlsx)</p>
        </section>
      </div>
    </main>
  );
}
