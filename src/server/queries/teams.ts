import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface TeamOption {
  id: string;
  name: string;
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
