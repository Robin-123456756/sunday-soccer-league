import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AppRole, UserProfile } from "@/types/database";

export async function getCurrentUserProfile(): Promise<UserProfile> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be signed in.");
  }

  const { data: profile, error } = await supabase
    .from("users_profile")
    .select("id, full_name, email, role, team_id, is_active")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    throw new Error("Could not load your profile.");
  }

  return profile as UserProfile;
}

export async function requireRole(allowedRoles: AppRole[]) {
  const profile = await getCurrentUserProfile();

  if (!allowedRoles.includes(profile.role)) {
    throw new Error("You do not have permission to perform this action.");
  }

  return profile;
}
