import { pageStyle, mutedTextStyle } from '@/components/ui/styles';
import { requireRole } from '@/server/queries/auth';
import { getTeams } from '@/server/queries/teams';
import { getUsersProfiles } from '@/server/queries/users';
import { UserManagementForm } from '@/components/forms/UserManagementForm';

export default async function AdminUsersPage() {
  await requireRole(['admin']);
  const [teams, users] = await Promise.all([getTeams(), getUsersProfiles()]);

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1150, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <h1 style={{ marginBottom: 8 }}>Admin users management</h1>
          <p style={mutedTextStyle}>Create league users, assign roles, and manage team ownership for team managers.</p>
        </div>
        <UserManagementForm teams={teams} existingUsers={users} />
      </div>
    </main>
  );
}
