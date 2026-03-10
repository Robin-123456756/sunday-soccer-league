import Link from 'next/link';
import { buttonStyle, cardStyle, inputStyle, labelStyle, mutedTextStyle, pageStyle, secondaryButtonStyle, tableStyle, tdStyle, thStyle } from '@/components/ui/styles';
import { requireRolePage } from '@/server/queries/auth';
import { getRefereesList } from '@/server/queries/referees';

export default async function RefereesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRolePage(['admin']);
  const params = await searchParams;

  const search = typeof params.search === 'string' ? params.search : undefined;
  const statusParam = typeof params.status === 'string' ? params.status : undefined;
  const isActive = statusParam === 'active' ? true : statusParam === 'inactive' ? false : undefined;

  const hasFilters = search || statusParam;

  const referees = await getRefereesList({ search, isActive });

  return (
    <main className="page-main" style={pageStyle}>
      <div className="page-container" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ marginBottom: 8 }}>Referees</h1>
            <p style={mutedTextStyle}>Maintain referee contact details and see how many matches each referee is currently assigned.</p>
          </div>
          <Link href="/referees/new" style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            + Create referee
          </Link>
        </div>

        {/* Filters */}
        <form method="GET" style={{ ...cardStyle, display: 'grid', gap: 12 }}>
          <div className="filter-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <label>
              <span style={labelStyle}>Search name</span>
              <input name="search" type="text" defaultValue={search ?? ''} placeholder="Referee name..." style={inputStyle} />
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
              <Link href="/referees" style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '8px 20px' }}>
                Clear filters
              </Link>
            ) : null}
          </div>
        </form>

        {/* Results */}
        <div style={cardStyle}>
          <p style={{ ...mutedTextStyle, marginBottom: 12 }}>{referees.length} referee{referees.length !== 1 ? 's' : ''} found</p>
          {referees.length === 0 ? (
            <p style={mutedTextStyle}>
              {hasFilters ? 'No referees match the selected filters.' : 'No referees found yet.'}
            </p>
          ) : (
            <div className="table-wrapper"><table style={tableStyle}>
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
            </table></div>
          )}
        </div>
      </div>
    </main>
  );
}
