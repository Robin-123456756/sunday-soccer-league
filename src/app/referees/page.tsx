import Link from 'next/link';
import { cardStyle, mutedTextStyle, pageStyle, secondaryButtonStyle, tableStyle, tdStyle, thStyle } from '@/components/ui/styles';
import { requireRolePage } from '@/server/queries/auth';
import { getRefereesList } from '@/server/queries/referees';

export default async function RefereesPage() {
  await requireRolePage(['admin']);
  const referees = await getRefereesList();

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ marginBottom: 8 }}>Referees</h1>
            <p style={mutedTextStyle}>Maintain referee contact details and see how many matches each referee is currently assigned.</p>
          </div>
          <Link href="/referees/new" style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            + Create referee
          </Link>
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
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Level</th>
                  <th style={thStyle}>Assigned matches</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {referees.map((referee) => (
                  <tr key={referee.id}>
                    <td style={tdStyle}><strong>{referee.full_name}</strong></td>
                    <td style={tdStyle}>{referee.email ?? '\u2014'}</td>
                    <td style={tdStyle}>{referee.phone ?? '\u2014'}</td>
                    <td style={tdStyle}>{referee.level ?? '\u2014'}</td>
                    <td style={tdStyle}>{referee.assignedMatches}</td>
                    <td style={tdStyle}>{referee.is_active ? 'Active' : 'Inactive'}</td>
                    <td style={tdStyle}><Link href={`/referees/${referee.id}/edit`}>Edit</Link></td>
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
