import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { MatchRecord } from '@/types/database';

export interface MatchListItem {
  id: string;
  match_date: string;
  kickoff_time: string | null;
  venue: string | null;
  status: string;
  home_team: { id: string; name: string } | null;
  away_team: { id: string; name: string } | null;
  referee: { id: string; full_name: string } | null;
  is_archived?: boolean;
}

export interface MatchLineupRow {
  player_id: string;
  lineup_type: 'starter' | 'bench';
  is_captain: boolean;
}

export interface MatchCardEventRow {
  id: string;
  minute: number;
  card_type: string;
  reason: string;
  referee_note: string | null;
  player: { id: string; full_name: string | null } | null;
  team: { id: string; name: string | null } | null;
}

export interface MatchUploadRow {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
  team: { id: string; name: string | null } | null;
}

export interface MatchQueryOptions {
  includeArchived?: boolean;
}

export async function getMatchById(matchId: string, options: MatchQueryOptions = {}): Promise<MatchRecord> {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from('matches').select('*').eq('id', matchId);
  if (!options.includeArchived) {
    query = query.eq('is_archived', false);
  }
  const { data, error } = await query.single();

  if (error || !data) {
    throw new Error('Match not found.');
  }

  return data as MatchRecord;
}

export async function getMatches(options: MatchQueryOptions = {}): Promise<MatchListItem[]> {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('matches')
    .select(`
      id,
      match_date,
      kickoff_time,
      venue,
      status,
      is_archived,
      home_team:teams!matches_home_team_id_fkey(id, name),
      away_team:teams!matches_away_team_id_fkey(id, name),
      referee:referees!matches_referee_id_fkey(id, full_name)
    `)
    .order('match_date', { ascending: false });

  if (!options.includeArchived) {
    query = query.eq('is_archived', false);
  }

  const { data, error } = await query;

  if (error) throw new Error('Could not load matches.');
  return (data ?? []) as unknown as MatchListItem[];
}

export async function getMatchDetails(matchId: string, options: MatchQueryOptions = {}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('matches')
    .select(`
      id,
      match_date,
      kickoff_time,
      venue,
      status,
      is_archived,
      home_score,
      away_score,
      home_jersey_color,
      away_jersey_color,
      home_team:teams!matches_home_team_id_fkey(id, name),
      away_team:teams!matches_away_team_id_fkey(id, name),
      referee:referees!matches_referee_id_fkey(id, full_name, email)
    `)
    .eq('id', matchId);

  if (!options.includeArchived) {
    query = query.eq('is_archived', false);
  }

  const { data, error } = await query.single();

  if (error || !data) throw new Error('Match not found.');
  return data as unknown as MatchListItem & {
    home_score: number | null;
    away_score: number | null;
    home_jersey_color: string | null;
    away_jersey_color: string | null;
    referee: { id: string; full_name: string; email: string | null } | null;
  };
}

export async function getMatchLineupRows(matchId: string, teamId: string): Promise<MatchLineupRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('match_lineups')
    .select('player_id, lineup_type, is_captain')
    .eq('match_id', matchId)
    .eq('team_id', teamId);

  if (error) throw new Error('Could not load lineup.');
  return (data ?? []) as MatchLineupRow[];
}

export async function getMatchCardEvents(matchId: string): Promise<MatchCardEventRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('card_events')
    .select(`
      id,
      minute,
      card_type,
      reason,
      referee_note,
      player:players(id, full_name),
      team:teams(id, name)
    `)
    .eq('match_id', matchId)
    .order('minute', { ascending: true });

  if (error) throw new Error('Could not load match cards.');
  return (data ?? []) as unknown as MatchCardEventRow[];
}

export async function getMatchUploads(matchId: string): Promise<MatchUploadRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('team_sheet_uploads')
    .select(`
      id,
      file_name,
      file_url,
      file_type,
      uploaded_at,
      team:teams(id, name)
    `)
    .eq('match_id', matchId)
    .order('uploaded_at', { ascending: false });

  if (error) throw new Error('Could not load match uploads.');
  return (data ?? []) as unknown as MatchUploadRow[];
}

export async function getMatchReport(matchId: string, refereeId?: string | null) {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from('referee_reports').select('*').eq('match_id', matchId);
  if (refereeId) query = query.eq('referee_id', refereeId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error('Could not load referee report.');
  return data;
}

export async function getMatchesAssignedToCurrentReferee(
  email?: string | null,
  options: MatchQueryOptions = {}
): Promise<MatchListItem[]> {
  const supabase = await createServerSupabaseClient();
  if (!email) return [];

  const { data: referee } = await supabase
    .from('referees')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (!referee?.id) return [];

  let query = supabase
    .from('matches')
    .select(`
      id,
      match_date,
      kickoff_time,
      venue,
      status,
      is_archived,
      home_team:teams!matches_home_team_id_fkey(id, name),
      away_team:teams!matches_away_team_id_fkey(id, name),
      referee:referees!matches_referee_id_fkey(id, full_name)
    `)
    .eq('referee_id', referee.id)
    .order('match_date', { ascending: false });

  if (!options.includeArchived) {
    query = query.eq('is_archived', false);
  }

  const { data, error } = await query;

  if (error) throw new Error('Could not load assigned matches.');
  return (data ?? []) as unknown as MatchListItem[];
}
