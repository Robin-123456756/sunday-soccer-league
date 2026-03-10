import Link from 'next/link';
import { buttonStyle, cardStyle, inputStyle, labelStyle, mutedTextStyle, pageStyle, secondaryButtonStyle, tableStyle, tdStyle, thStyle } from '@/components/ui/styles';
import { requireRolePage } from '@/server/queries/auth';
import { getPlayersList } from '@/server/queries/players';
import { getTeams } from '@/server/queries/teams';

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRolePage(['admin']);
  const params = await searchParams;

  const teamId = typeof params.team === 'string' ? params.team : undefined;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const statusParam = typeof params.status === 'string' ? params.status : undefined;
  const isActive = statusParam === 'active' ? true : statusParam === 'inactive' ? false : undefined;

  const hasFilters = teamId || search || statusParam;

  const [players, teams] = await Promise.all([
    getPlayersList({ teamId, search, isActive }),
    getTeams(),
  ]);

  return (
    <main className="page-main" style={pageStyle}>
      <div className="page-container" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ marginBottom: 8 }}>Players</h1>
            <p style={mutedTextStyle}>League-wide player directory with edit links for admin maintenance.</p>
          </div>
          <Link href="/players/new" style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            + Create player
          </Link>
        </div>

        {/* Filters */}
        <form method="GET" style={{ ...cardStyle, display: 'grid', gap: 12 }}>
          <div className="filter-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <label>
              <span style={labelStyle}>Search name</span>
              <input name="search" type="text" defaultValue={search ?? ''} placeholder="Player name..." style={inputStyle} />
            </label>
            <label>
              <span style={labelStyle}>Team</span>
              <select name="team" defaultValue={teamId ?? ''} style={inputStyle}>
                <option value="">All teams</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </label>
            <label>
              <span style={labelStyle}>Status</span>
              <select name="status" defaultValue={statusParam ?? ''} style={inputStyle}>
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={{ ...buttonStyle, padding: '8px 20px' }}>Search</button>
            {hasFilters ? (
              <Link href="/players" style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '8px 20px' }}>
                Clear filters
              </Link>
            ) : null}
          </div>
        </form>

        {/* Results */}
        <div style={cardStyle}>
          <p style={{ ...mutedTextStyle, marginBottom: 12 }}>{players.length} player{players.length !== 1 ? 's' : ''} found</p>
          {players.length === 0 ? (
            <p style={mutedTextStyle}>
              {hasFilters ? 'No players match the selected filters.' : 'No players found yet.'}
            </p>
          ) : (
            <div className="table-wrapper"><table style={tableStyle}>
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
            </table></div>
          )}
        </div>
      </div>
    </main>
  );
}
