import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface UserProfileListItem {
  id: string;
  full_name: string | null;
  email: string | null;
  role: 'admin' | 'referee' | 'team_manager';
  team_id: string | null;
  is_active: boolean;
  team_name: string | null;
}

export async function getUsersProfiles(): Promise<UserProfileListItem[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('users_profile')
    .select('id, full_name, email, role, team_id, is_active, teams!users_profile_team_id_fkey(name)')
    .order('full_name');

  if (error) throw new Error('Could not load user profiles.');

  return (data ?? []).map((profile: any) => ({
    id: profile.id,
    full_name: profile.full_name ?? null,
    email: profile.email ?? null,
    role: profile.role,
    team_id: profile.team_id ?? null,
    is_active: Boolean(profile.is_active),
    team_name: profile.teams?.name ?? null,
  }));
}
