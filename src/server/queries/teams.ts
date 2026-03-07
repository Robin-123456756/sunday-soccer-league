import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface TeamOption {
  id: string;
  name: string;
}

export interface TeamListItem {
  id: string;
  name: string;
  primary_color: string | null;
  secondary_color: string | null;
  home_venue: string | null;
  playerCount: number;
}

export async function getTeams(): Promise<TeamOption[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('teams').select('id, name').order('name');

  if (error) throw new Error('Could not load teams.');
  return (data ?? []) as TeamOption[];
}

export async function getTeamById(teamId: string): Promise<TeamOption | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('teams').select('id, name').eq('id', teamId).maybeSingle();
  if (error) throw new Error('Could not load team.');
  return (data as TeamOption | null) ?? null;
}

export async function getTeamsWithCounts(): Promise<TeamListItem[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('teams')
    .select('id, name, primary_color, secondary_color, home_venue, players(id)')
    .order('name');

  if (error) throw new Error('Could not load teams with counts.');

  return (data ?? []).map((team: any) => ({
    id: team.id,
    name: team.name,
    primary_color: team.primary_color ?? null,
    secondary_color: team.secondary_color ?? null,
    home_venue: team.home_venue ?? null,
    playerCount: Array.isArray(team.players) ? team.players.length : 0,
  }));
}
