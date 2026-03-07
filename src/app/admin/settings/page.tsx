import Link from 'next/link';
import { cardStyle, mutedTextStyle, pageStyle, secondaryButtonStyle } from '@/components/ui/styles';
import { requireRole } from '@/server/queries/auth';

export default async function AdminSettingsPage() {
  await requireRole(['admin']);

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Admin settings</h1>
          <p style={mutedTextStyle}>Control league-wide operations, data governance, and who can access the system.</p>
        </div>

        <div style={{ ...cardStyle, display: 'grid', gap: 12 }}>
          <strong>User and roles</strong>
          <p style={mutedTextStyle}>Manage admins, referees, and team managers from the users page.</p>
          <div><Link href="/admin/users" style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Open users management</Link></div>
        </div>

        <div style={{ ...cardStyle, display: 'grid', gap: 12 }}>
          <strong>Operational rules</strong>
          <ul style={{ margin: 0, color: '#4b5563' }}>
            <li>Team managers edit only their own lineups.</li>
            <li>Referees enter cards only for assigned matches.</li>
            <li>Only admins can export CSV or Excel files.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
