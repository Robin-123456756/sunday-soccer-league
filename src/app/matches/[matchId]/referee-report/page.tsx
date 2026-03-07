import Link from 'next/link';
import { RefereeReportForm } from '@/components/forms/RefereeReportForm';
import { pageStyle, cardStyle } from '@/components/ui/styles';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getMatchDetails } from '@/server/queries/matches';

interface RefereeReportValues {
  general_comment?: string | null;
  time_management_observation?: string | null;
  dress_code_observation?: string | null;
  organization_observation?: string | null;
  conduct_observation?: string | null;
  incidents?: string | null;
}

export default async function RefereeReportPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const match = await getMatchDetails(matchId);
  const supabase = await createServerSupabaseClient();

  const { data: report } = await supabase
    .from('referee_reports')
    .select('*')
    .eq('match_id', matchId)
    .eq('referee_id', match.referee?.id ?? '')
    .maybeSingle();

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <Link href="/matches">← Back to matches</Link>
          <h1>Referee report</h1>
          <p style={{ color: '#4b5563' }}>{match.home_team?.name} vs {match.away_team?.name}</p>
        </div>

        {!match.referee?.id ? (
          <div style={cardStyle}>Assign a referee to this match before submitting a referee report.</div>
        ) : (
          <RefereeReportForm matchId={matchId} refereeId={match.referee.id} initialValues={report as RefereeReportValues | null} />
        )}
      </div>
    </main>
  );
}
