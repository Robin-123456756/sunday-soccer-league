import { cardStyle, mutedTextStyle, pageStyle, tableStyle, tdStyle, thStyle } from '@/components/ui/styles';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { requireRolePage } from '@/server/queries/auth';
import { getPlayerAppearances } from '@/server/queries/discipline';

export default async function AppearancesPage() {
  await requireRolePage(['admin']);
  const appearances = await getPlayerAppearances();

  return (
    <main className="page-main" style={pageStyle}>
      <div className="page-container" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Player appearances' }]} />
          <h1 style={{ marginBottom: 8 }}>Player appearances</h1>
          <p style={mutedTextStyle}>Match participation stats for all players, sorted by total appearances.</p>
        </div>

        <div style={cardStyle}>
          <p style={{ ...mutedTextStyle, marginBottom: 12 }}>{appearances.length} player{appearances.length !== 1 ? 's' : ''} with recorded appearances</p>
          {appearances.length === 0 ? (
            <p style={mutedTextStyle}>No appearances recorded yet.</p>
          ) : (
            <div className="table-wrapper">
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Player</th>
                    <th style={thStyle}>Team</th>
                    <th style={thStyle}>Number</th>
                    <th style={thStyle}>Position</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Total</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Starter</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Bench</th>
                  </tr>
                </thead>
                <tbody>
                  {appearances.map((row) => (
                    <tr key={row.playerId}>
                      <td style={tdStyle}><strong>{row.playerName}</strong></td>
                      <td style={tdStyle}>{row.teamName ?? '\u2014'}</td>
                      <td style={tdStyle}>{row.jerseyNumber ?? '\u2014'}</td>
                      <td style={tdStyle}>{row.position ?? '\u2014'}</td>
                      <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700 }}>{row.appearances}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{row.asStarter}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{row.asBench}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
