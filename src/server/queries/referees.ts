import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface RefereeOption {
  id: string;
  full_name: string;
  email: string | null;
}

export interface RefereeListItem {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  level: string | null;
  is_active: boolean;
  assignedMatches: number;
}

export interface RefereeRecord {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  level: string | null;
  is_active: boolean;
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

export async function getRefereeRecord(refereeId: string): Promise<RefereeRecord | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('referees')
    .select('id, full_name, phone, email, level, is_active')
    .eq('id', refereeId)
    .maybeSingle();

  if (error) throw new Error('Could not load referee.');
  return (data as RefereeRecord | null) ?? null;
}

export interface RefereeFilterOptions {
  search?: string;
  isActive?: boolean;
}

export async function getRefereesList(filters: RefereeFilterOptions = {}): Promise<RefereeListItem[]> {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('referees')
    .select('id, full_name, phone, email, level, is_active, matches(id)')
    .order('full_name');

  if (filters.search) {
    query = query.ilike('full_name', `%${filters.search}%`);
  }

  if (filters.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive);
  }

  const { data, error } = await query;

  if (error) throw new Error('Could not load referees list.');

  type RefereeWithMatches = {
    id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
    level: string | null;
    is_active: boolean;
    matches: { id: string }[] | null;
  };

  return ((data ?? []) as unknown as RefereeWithMatches[]).map((referee) => ({
    id: referee.id,
    full_name: referee.full_name,
    phone: referee.phone ?? null,
    email: referee.email ?? null,
    level: referee.level ?? null,
    is_active: Boolean(referee.is_active),
    assignedMatches: Array.isArray(referee.matches) ? referee.matches.length : 0,
  }));
}
