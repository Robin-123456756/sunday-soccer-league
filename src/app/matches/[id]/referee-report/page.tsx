import { RefereeReportForm } from '@/components/forms/RefereeReportForm';
import { pageStyle, cardStyle } from '@/components/ui/styles';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireRolePage } from '@/server/queries/auth';
import { getMatchDetails } from '@/server/queries/matches';

export default async function RefereeReportPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRolePage(['admin', 'referee']);
  const { id } = await params;
  const match = await getMatchDetails(id);
  const supabase = await createServerSupabaseClient();

  const { data: report } = await supabase
    .from('referee_reports')
    .select('*')
    .eq('match_id', id)
    .eq('referee_id', match.referee?.id ?? '')
    .maybeSingle();

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <Breadcrumbs items={[{ label: 'Matches', href: '/matches' }, { label: `${match.home_team?.name} vs ${match.away_team?.name}`, href: `/matches/${id}` }, { label: 'Referee report' }]} />
          <h1>Referee report</h1>
          <p style={{ color: '#4b5563' }}>{match.home_team?.name} vs {match.away_team?.name}</p>
        </div>

        {!match.referee?.id ? (
          <div style={cardStyle}>Assign a referee to this match before submitting a referee report.</div>
        ) : (
          <RefereeReportForm matchId={id} refereeId={match.referee.id} initialValues={report} />
        )}
      </div>
    </main>
  );
}
