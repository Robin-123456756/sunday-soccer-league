import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface TeamOption {
  id: string;
  name: string;
}

export interface TeamListItem {
  id: string;
  name: string;
  short_name: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  home_venue: string | null;
  is_archived: boolean;
  playerCount: number;
}

export interface TeamRecord {
  id: string;
  name: string;
  short_name: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  home_venue: string | null;
  is_archived: boolean;
}

export async function getTeams(): Promise<TeamOption[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('teams').select('id, name').eq('is_archived', false).order('name');

  if (error) throw new Error('Could not load teams.');
  return (data ?? []) as TeamOption[];
}

export async function getTeamById(teamId: string): Promise<TeamOption | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('teams').select('id, name').eq('id', teamId).maybeSingle();
  if (error) throw new Error('Could not load team.');
  return (data as TeamOption | null) ?? null;
}

export async function getTeamRecord(teamId: string): Promise<TeamRecord | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('teams')
    .select('id, name, short_name, primary_color, secondary_color, home_venue, is_archived')
    .eq('id', teamId)
    .maybeSingle();
  if (error) throw new Error('Could not load team.');
  return (data as TeamRecord | null) ?? null;
}

export async function getTeamsWithCounts(): Promise<TeamListItem[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('teams')
    .select('id, name, short_name, primary_color, secondary_color, home_venue, is_archived, players(id)')
    .order('name');

  if (error) throw new Error('Could not load teams with counts.');

  type TeamWithPlayers = {
    id: string;
    name: string;
    short_name: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    home_venue: string | null;
    is_archived: boolean;
    players: { id: string }[] | null;
  };

  return ((data ?? []) as unknown as TeamWithPlayers[]).map((team) => ({
    id: team.id,
    name: team.name,
    short_name: team.short_name ?? null,
    primary_color: team.primary_color ?? null,
    secondary_color: team.secondary_color ?? null,
    home_venue: team.home_venue ?? null,
    is_archived: Boolean(team.is_archived),
    playerCount: Array.isArray(team.players) ? team.players.length : 0,
  }));
}
