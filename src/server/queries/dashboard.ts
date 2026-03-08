import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { UserProfile } from '@/types/database';

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

interface DashboardQueryOptions {
  includeArchived?: boolean;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerSupabaseClient();

  const [matchesRes, playersRes, teamsRes, refereesRes, cardsRes] = await Promise.all([
    supabase.from('matches').select('id, status', { count: 'exact' }).eq('is_archived', false),
    supabase.from('players').select('id', { count: 'exact', head: true }),
    supabase.from('teams').select('id', { count: 'exact', head: true }),
    supabase.from('referees').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase
      .from('card_events')
      .select('id, match:matches!inner(id, is_archived)', { count: 'exact', head: true })
      .eq('match.is_archived', false),
  ]);

  const matches = matchesRes.data ?? [];

  // Pending reports = completed matches with a referee that have no referee_reports row
  const completedWithRef = await supabase
    .from('matches')
    .select('id')
    .eq('status', 'completed')
    .eq('is_archived', false)
    .not('referee_id', 'is', null);

  const completedIds = (completedWithRef.data ?? []).map((m: { id: string }) => m.id);

  let pendingCount = completedIds.length;
  if (completedIds.length > 0) {
    const { count: reportedCount } = await supabase
      .from('referee_reports')
      .select('id', { count: 'exact', head: true })
      .in('match_id', completedIds);
    pendingCount = completedIds.length - (reportedCount ?? 0);
  }

  return {
    totalMatches: matches.length,
    scheduledMatches: matches.filter((m: { status: string }) => m.status === 'scheduled').length,
    completedMatches: matches.filter((m: { status: string }) => m.status === 'completed').length,
    totalPlayers: playersRes.count ?? 0,
    totalTeams: teamsRes.count ?? 0,
    totalReferees: refereesRes.count ?? 0,
    pendingReports: pendingCount,
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
      match:matches!inner(
        is_archived,
        home_team:teams!matches_home_team_id_fkey(name),
        away_team:teams!matches_away_team_id_fkey(name)
      )
    `)
    .eq('match.is_archived', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error('Could not load recent card events.');
  return (data ?? []) as unknown as DashboardRecentCardEvent[];
}

export async function getTeamManagerDashboardData(teamId: string, options: DashboardQueryOptions = {}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('matches')
    .select(`
      id,
      match_date,
      kickoff_time,
      status,
      home_team_id,
      away_team_id,
      home_team:teams!matches_home_team_id_fkey(name),
      away_team:teams!matches_away_team_id_fkey(name)
    `)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .order('match_date', { ascending: false })
    .limit(6);

  if (!options.includeArchived) {
    query = query.eq('is_archived', false);
  }

  const { data: matches, error: matchError } = await query;

  if (matchError) throw new Error('Could not load team manager dashboard data.');

  const { count: lineupCount } = await supabase
    .from('match_lineups')
    .select('id', { count: 'exact', head: true })
    .eq('team_id', teamId);

  const { count: uploadCount } = await supabase
    .from('team_sheet_uploads')
    .select('id', { count: 'exact', head: true })
    .eq('team_id', teamId);

  return {
    recentMatches: (matches ?? []) as unknown as { id: string; match_date: string; kickoff_time: string | null; status: string; home_team_id: string; away_team_id: string; home_team: { name: string } | null; away_team: { name: string } | null }[],
    lineupCount: lineupCount ?? 0,
    uploadCount: uploadCount ?? 0,
  };
}

export async function getRefereeDashboardData(profile: UserProfile, options: DashboardQueryOptions = {}) {
  const supabase = await createServerSupabaseClient();

  const { data: referee } = await supabase
    .from('referees')
    .select('id')
    .eq('email', profile.email ?? '')
    .maybeSingle();

  if (!referee?.id) {
    return { assignedMatches: [], reportsCount: 0, cardCount: 0 };
  }

  let query = supabase
    .from('matches')
    .select(`
      id,
      match_date,
      kickoff_time,
      status,
      home_team:teams!matches_home_team_id_fkey(name),
      away_team:teams!matches_away_team_id_fkey(name)
    `)
    .eq('referee_id', referee.id)
    .order('match_date', { ascending: false })
    .limit(8);

  if (!options.includeArchived) {
    query = query.eq('is_archived', false);
  }

  const { data: matches, error: matchError } = await query;

  if (matchError) throw new Error('Could not load referee dashboard data.');

  const { count: reportsCount } = await supabase
    .from('referee_reports')
    .select('id', { count: 'exact', head: true })
    .eq('referee_id', referee.id);

  const { data: playerCards } = await supabase
    .from('card_events')
    .select('id, match_id')
    .in('match_id', (matches ?? []).map((m: { id: string }) => m.id));

  return {
    assignedMatches: (matches ?? []) as unknown as { id: string; match_date: string; kickoff_time: string | null; status: string; home_team: { name: string } | null; away_team: { name: string } | null }[],
    reportsCount: reportsCount ?? 0,
    cardCount: Array.isArray(playerCards) ? playerCards.length : 0,
  };
}
