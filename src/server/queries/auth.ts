import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AppRole, UserProfile } from "@/types/database";

export async function getCurrentUserProfileOrNull(): Promise<UserProfile | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("users_profile")
    .select("id, full_name, email, role, team_id, is_active")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile as UserProfile;
}

export async function getCurrentUserProfile(): Promise<UserProfile> {
  const profile = await getCurrentUserProfileOrNull();

  if (!profile) {
    throw new Error("You must be signed in.");
  }

  return profile;
}

export async function requireRole(allowedRoles: AppRole[]) {
  const profile = await getCurrentUserProfile();

  if (!allowedRoles.includes(profile.role)) {
    throw new Error("You do not have permission to perform this action.");
  }

  return profile;
}

export function getDefaultRouteForRole(role: AppRole) {
  if (role === "team_manager") return "/team-manager/lineups";
  if (role === "referee") return "/referee/assigned-matches";
  return "/dashboard";
}
