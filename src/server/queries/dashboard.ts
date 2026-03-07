import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface DashboardStats {
  totalMatches: number;
  scheduledMatches: number;
  completedMatches: number;
  totalPlayers: number;
  totalTeams: number;
  totalReferees: number;
  pendingReports: number;
  totalCards: number;
}

export interface DashboardRecentCardEvent {
  id: string;
  minute: number;
  card_type: string;
  reason: string;
  player: { full_name: string | null } | null;
  match: {
    home_team: { name: string | null } | null;
    away_team: { name: string | null } | null;
  } | null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerSupabaseClient();

  const [
    matchesRes,
    playersRes,
    teamsRes,
    refereesRes,
    completedWithRefRes,
    reportsRes,
    cardsRes,
  ] = await Promise.all([
    supabase.from('matches').select('id, status', { count: 'exact' }),
    supabase.from('players').select('id', { count: 'exact', head: true }),
    supabase.from('teams').select('id', { count: 'exact', head: true }),
    supabase.from('referees').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('matches').select('id', { count: 'exact', head: true }).eq('status', 'completed').not('referee_id', 'is', null),
    supabase.from('referee_reports').select('id', { count: 'exact', head: true }),
    supabase.from('card_events').select('id', { count: 'exact', head: true }),
  ]);

  const matches = matchesRes.data ?? [];
  const completedWithRef = completedWithRefRes.count ?? 0;
  const submittedReports = reportsRes.count ?? 0;
  const withReportsNeeded = Math.max(0, completedWithRef - submittedReports);

  return {
    totalMatches: matches.length,
    scheduledMatches: matches.filter((m: any) => m.status === 'scheduled').length,
    completedMatches: matches.filter((m: any) => m.status === 'completed').length,
    totalPlayers: playersRes.count ?? 0,
    totalTeams: teamsRes.count ?? 0,
    totalReferees: refereesRes.count ?? 0,
    pendingReports: withReportsNeeded,
    totalCards: cardsRes.count ?? 0,
  };
}

export async function getRecentCardEvents(limit = 8): Promise<DashboardRecentCardEvent[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('card_events')
    .select(`
      id,
      minute,
      card_type,
      reason,
      player:players(full_name),
      match:matches(
        home_team:teams!matches_home_team_id_fkey(name),
        away_team:teams!matches_away_team_id_fkey(name)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error('Could not load recent card events.');
  return (data ?? []) as any;
}
