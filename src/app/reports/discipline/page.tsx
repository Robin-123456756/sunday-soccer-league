import { cardStyle, mutedTextStyle, pageStyle, tableStyle, tdStyle, thStyle } from '@/components/ui/styles';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { requireRolePage } from '@/server/queries/auth';
import { getRepeatOffenders } from '@/server/queries/discipline';

export default async function DisciplinePage() {
  await requireRolePage(['admin']);
  const offenders = await getRepeatOffenders();

  return (
    <main className="page-main" style={pageStyle}>
      <div className="page-container" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Repeat offenders' }]} />
          <h1 style={{ marginBottom: 8 }}>Repeat offenders</h1>
          <p style={mutedTextStyle}>Players with 2 or more cards across all matches, sorted by total card count.</p>
        </div>

        <div style={cardStyle}>
          <p style={{ ...mutedTextStyle, marginBottom: 12 }}>{offenders.length} player{offenders.length !== 1 ? 's' : ''} with multiple cards</p>
          {offenders.length === 0 ? (
            <p style={mutedTextStyle}>No repeat offenders found.</p>
          ) : (
            <div className="table-wrapper">
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Player</th>
                    <th style={thStyle}>Team</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Yellow</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Red</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {offenders.map((row) => (
                    <tr key={row.playerId}>
                      <td style={tdStyle}><strong>{row.playerName}</strong></td>
                      <td style={tdStyle}>{row.teamName ?? '\u2014'}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
                          {row.yellowCards}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <span style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
                          {row.redCards}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700 }}>{row.totalCards}</td>
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
