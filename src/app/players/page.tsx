import Link from 'next/link';
import { cardStyle, mutedTextStyle, pageStyle, secondaryButtonStyle, tableStyle, tdStyle, thStyle } from '@/components/ui/styles';
import { requireRolePage } from '@/server/queries/auth';
import { getPlayersList } from '@/server/queries/players';

export default async function PlayersPage() {
  await requireRolePage(['admin']);
  const players = await getPlayersList();

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ marginBottom: 8 }}>Players</h1>
            <p style={mutedTextStyle}>League-wide player directory with edit links for admin maintenance.</p>
          </div>
          <Link href="/players/new" style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            + Create player
          </Link>
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
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id}>
                    <td style={tdStyle}><strong>{player.full_name}</strong></td>
                    <td style={tdStyle}>{player.team_name ?? '\u2014'}</td>
                    <td style={tdStyle}>{player.jersey_number ?? '\u2014'}</td>
                    <td style={tdStyle}>{player.position ?? '\u2014'}</td>
                    <td style={tdStyle}>{player.registration_number ?? '\u2014'}</td>
                    <td style={tdStyle}>{player.is_active ? 'Active' : 'Inactive'}</td>
                    <td style={tdStyle}><Link href={`/players/${player.id}/edit`}>Edit</Link></td>
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
