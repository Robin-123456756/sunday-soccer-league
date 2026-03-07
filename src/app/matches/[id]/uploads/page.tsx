import Link from 'next/link';
import { TeamSheetUploadForm } from '@/components/forms/TeamSheetUploadForm';
import { pageStyle } from '@/components/ui/styles';
import { getMatchDetails } from '@/server/queries/matches';

export default async function MatchUploadsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: matchId } = await params;
  const match = await getMatchDetails(matchId);
  const teams = [match.home_team, match.away_team].filter(Boolean) as Array<{ id: string; name: string }>;

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <Link href="/matches">← Back to matches</Link>
          <h1>Upload team sheets</h1>
          <p style={{ color: '#4b5563' }}>{match.home_team?.name} vs {match.away_team?.name}</p>
        </div>
        <TeamSheetUploadForm matchId={matchId} teams={teams} />
      </div>
    </main>
  );
}
