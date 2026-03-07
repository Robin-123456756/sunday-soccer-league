import { cardStyle, mutedTextStyle, pageStyle, tableStyle, tdStyle, thStyle } from '@/components/ui/styles';
import { getRefereesList } from '@/server/queries/referees';

export default async function RefereesPage() {
  const referees = await getRefereesList();

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Referees</h1>
          <p style={mutedTextStyle}>Monitor active referees and see how many matches each one has been assigned.</p>
        </div>

        <div style={cardStyle}>
          {referees.length === 0 ? (
            <p style={mutedTextStyle}>No referees found yet.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Referee</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Level</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Assigned matches</th>
                </tr>
              </thead>
              <tbody>
                {referees.map((referee) => (
                  <tr key={referee.id}>
                    <td style={tdStyle}><strong>{referee.full_name}</strong></td>
                    <td style={tdStyle}>{referee.email ?? '-'}</td>
                    <td style={tdStyle}>{referee.level ?? '-'}</td>
                    <td style={tdStyle}>{referee.is_active ? 'Active' : 'Inactive'}</td>
                    <td style={tdStyle}>{referee.assignedMatches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}