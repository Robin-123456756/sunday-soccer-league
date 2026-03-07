import { cardStyle, mutedTextStyle, pageStyle, tableStyle, tdStyle, thStyle } from '@/components/ui/styles';
import { getPlayersList } from '@/server/queries/players';

export default async function PlayersPage() {
  const players = await getPlayersList();

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Players</h1>
          <p style={mutedTextStyle}>A searchable table can be added later. This starter page already gives a league-wide player directory.</p>
        </div>

        <div style={cardStyle}>
          {players.length === 0 ? (
            <p style={mutedTextStyle}>No players found yet.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Player</th>
                  <th style={thStyle}>Team</th>
                  <th style={thStyle}>Number</th>
                  <th style={thStyle}>Position</th>
                  <th style={thStyle}>Registration</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id}>
                    <td style={tdStyle}><strong>{player.full_name}</strong></td>
                    <td style={tdStyle}>{player.team_name ?? '-'}</td>
                    <td style={tdStyle}>{player.jersey_number ?? '-'}</td>
                    <td style={tdStyle}>{player.position ?? '-'}</td>
                    <td style={tdStyle}>{player.registration_number ?? '-'}</td>
                    <td style={tdStyle}>{player.is_active ? 'Active' : 'Inactive'}</td>
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