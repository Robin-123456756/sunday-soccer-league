import Link from 'next/link';
import { CreateMatchForm } from '@/components/forms/CreateMatchForm';
import { pageStyle } from '@/components/ui/styles';
import { getReferees } from '@/server/queries/referees';
import { getTeams } from '@/server/queries/teams';

export default async function NewMatchPage() {
  const [teams, referees] = await Promise.all([getTeams(), getReferees()]);

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <Link href="/matches">← Back to matches</Link>
          <h1>Create a match</h1>
        </div>
        <CreateMatchForm teams={teams} referees={referees} />
      </div>
    </main>
  );
}
