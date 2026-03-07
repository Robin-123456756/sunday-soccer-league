import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface RefereeOption {
  id: string;
  full_name: string;
  email: string | null;
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
