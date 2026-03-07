import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface RefereeOption {
  id: string;
  full_name: string;
  email: string | null;
}

export interface RefereeListItem {
  id: string;
  full_name: string;
  email: string | null;
  level: string | null;
  is_active: boolean;
  assignedMatches: number;
}

export async function getReferees(): Promise<RefereeOption[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('referees')
    .select('id, full_name, email')
    .eq('is_active', true)
    .order('full_name');

  if (error) throw new Error('Could not load referees.');
  return (data ?? []) as RefereeOption[];
}

export async function getRefereesList(): Promise<RefereeListItem[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('referees')
    .select('id, full_name, email, level, is_active, matches(id)')
    .order('full_name');

  if (error) throw new Error('Could not load referees list.');

  return (data ?? []).map((referee: any) => ({
    id: referee.id,
    full_name: referee.full_name,
    email: referee.email ?? null,
    level: referee.level ?? null,
    is_active: Boolean(referee.is_active),
    assignedMatches: Array.isArray(referee.matches) ? referee.matches.length : 0,
  }));
}
