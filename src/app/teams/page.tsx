import Link from 'next/link';
import { cardStyle, mutedTextStyle, pageStyle, tableStyle, tdStyle, thStyle } from '@/components/ui/styles';
import { getTeamsWithCounts } from '@/server/queries/teams';

export default async function TeamsPage() {
  const teams = await getTeamsWithCounts();

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Teams</h1>
          <p style={mutedTextStyle}>Review registered teams, squad size, and home venue details.</p>
        </div>

        <div style={cardStyle}>
          {teams.length === 0 ? (
            <p style={mutedTextStyle}>No teams found yet.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Team</th>
                  <th style={thStyle}>Players</th>
                  <th style={thStyle}>Primary color</th>
                  <th style={thStyle}>Secondary color</th>
                  <th style={thStyle}>Home venue</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td style={tdStyle}><strong>{team.name}</strong></td>
                    <td style={tdStyle}>{team.playerCount}</td>
                    <td style={tdStyle}>{team.primary_color ?? '-'}</td>
                    <td style={tdStyle}>{team.secondary_color ?? '-'}</td>
                    <td style={tdStyle}>{team.home_venue ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={cardStyle}>
          <strong>Next useful build:</strong> add team detail pages with roster history, uploads, and recent matches.
          <div style={{ marginTop: 12 }}>
            <Link href="/players">Go to players -&gt;</Link>
          </div>
        </div>
      </div>
    </main>
  );
}