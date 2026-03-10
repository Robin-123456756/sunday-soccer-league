import Link from 'next/link';
import { cardStyle, mutedTextStyle, pageStyle, secondaryButtonStyle, tableStyle, tdStyle, thStyle } from '@/components/ui/styles';
import { requireRolePage } from '@/server/queries/auth';
import { getTeamsWithCounts } from '@/server/queries/teams';

export default async function TeamsPage() {
  await requireRolePage(['admin']);
  const teams = await getTeamsWithCounts();

  return (
    <main className="page-main" style={pageStyle}>
      <div className="page-container" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ marginBottom: 8 }}>Teams</h1>
            <p style={mutedTextStyle}>Review registered teams, squad size, colors, and home venue details.</p>
          </div>
          <Link href="/teams/new" style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            + Create team
          </Link>
        </div>

        <div style={cardStyle}>
          {teams.length === 0 ? (
            <p style={mutedTextStyle}>No teams found yet.</p>
          ) : (
            <div className="table-wrapper"><table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Team</th>
                  <th style={thStyle}>Short name</th>
                  <th style={thStyle}>Players</th>
                  <th style={thStyle}>Primary color</th>
                  <th style={thStyle}>Secondary color</th>
                  <th style={thStyle}>Home venue</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td style={tdStyle}><strong>{team.name}</strong></td>
                    <td style={tdStyle}>{team.short_name ?? '\u2014'}</td>
                    <td style={tdStyle}>{team.playerCount}</td>
                    <td style={tdStyle}>{team.primary_color ?? '\u2014'}</td>
                    <td style={tdStyle}>{team.secondary_color ?? '\u2014'}</td>
                    <td style={tdStyle}>{team.home_venue ?? '\u2014'}</td>
                    <td style={tdStyle}><Link href={`/teams/${team.id}/edit`}>Edit</Link></td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          )}
        </div>
      </div>
    </main>
  );
}
