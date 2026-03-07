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
}

export interface MatchLineupRow {
  player_id: string;
  lineup_type: 'starter' | 'bench';
  is_captain: boolean;
}

export interface MatchDetails {
  id: string;
  match_date: string;
  kickoff_time: string | null;
  venue: string | null;
  status: string;
  home_jersey_color: string | null;
  away_jersey_color: string | null;
  home_team: { id: string; name: string } | null;
  away_team: { id: string; name: string } | null;
  referee: { id: string; full_name: string; email: string | null } | null;
}

interface RawMatchListItem {
  id: string;
  match_date: string;
  kickoff_time: string | null;
  venue: string | null;
  status: string;
  home_team: { id: string; name: string }[] | null;
  away_team: { id: string; name: string }[] | null;
  referee: { id: string; full_name: string }[] | null;
}

interface RawMatchDetails {
  id: string;
  match_date: string;
  kickoff_time: string | null;
  venue: string | null;
  status: string;
  home_jersey_color: string | null;
  away_jersey_color: string | null;
  home_team: { id: string; name: string }[] | null;
  away_team: { id: string; name: string }[] | null;
  referee: { id: string; full_name: string; email: string | null }[] | null;
}

export async function getMatchById(matchId: string): Promise<MatchRecord> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('matches').select('*').eq('id', matchId).single();

  if (error || !data) {
    throw new Error('Match not found.');
  }

  return data as MatchRecord;
}

export async function getMatches(): Promise<MatchListItem[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      match_date,
      kickoff_time,
      venue,
      status,
      home_team:teams!matches_home_team_id_fkey(id, name),
      away_team:teams!matches_away_team_id_fkey(id, name),
      referee:referees!matches_referee_id_fkey(id, full_name)
    `)
    .order('match_date', { ascending: false });

  if (error) throw new Error('Could not load matches.');
  return ((data ?? []) as RawMatchListItem[]).map((row) => ({
    id: row.id,
    match_date: row.match_date,
    kickoff_time: row.kickoff_time,
    venue: row.venue,
    status: row.status,
    home_team: row.home_team?.[0] ?? null,
    away_team: row.away_team?.[0] ?? null,
    referee: row.referee?.[0] ?? null,
  }));
}

export async function getAssignedRefereeMatchIds() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('matches').select('id').order('match_date', { ascending: false });

  if (error) {
    throw new Error('Could not load referee matches.');
  }

  return (data ?? []).map((row: { id: string }) => row.id);
}

export async function getMatchDetails(matchId: string): Promise<MatchDetails> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      match_date,
      kickoff_time,
      venue,
      status,
      home_jersey_color,
      away_jersey_color,
      home_team:teams!matches_home_team_id_fkey(id, name),
      away_team:teams!matches_away_team_id_fkey(id, name),
      referee:referees!matches_referee_id_fkey(id, full_name, email)
    `)
    .eq('id', matchId)
    .single();

  if (error || !data) throw new Error('Match not found.');
  const row = data as RawMatchDetails;
  return {
    id: row.id,
    match_date: row.match_date,
    kickoff_time: row.kickoff_time,
    venue: row.venue,
    status: row.status,
    home_jersey_color: row.home_jersey_color,
    away_jersey_color: row.away_jersey_color,
    home_team: row.home_team?.[0] ?? null,
    away_team: row.away_team?.[0] ?? null,
    referee: row.referee?.[0] ?? null,
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
