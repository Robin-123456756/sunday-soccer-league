import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getDefaultRouteForRole } from "@/lib/auth/routes";
import { UnauthenticatedError, ForbiddenError } from "@/lib/errors";
import type { AppRole, UserProfile } from "@/types/database";

export { getDefaultRouteForRole };

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
    throw new UnauthenticatedError();
  }

  return profile;
}

export async function requireRole(allowedRoles: AppRole[]) {
  const profile = await getCurrentUserProfile();

  if (!allowedRoles.includes(profile.role)) {
    throw new ForbiddenError();
  }

  return profile;
}

export async function requireSignedInPage() {
  const profile = await getCurrentUserProfileOrNull();

  if (!profile || !profile.is_active) {
    redirect("/sign-in");
  }

  return profile;
}

export async function requireRolePage(allowedRoles: AppRole[]) {
  const profile = await requireSignedInPage();

  if (!allowedRoles.includes(profile.role)) {
    redirect(getDefaultRouteForRole(profile.role));
  }

  return profile;
}

/**
 * For admin/referee actions on a specific match.
 * Admins pass through. Referees must be assigned to the match.
 * Uses referees.user_id (stable ID) with email fallback for unmigrated rows.
 */
export async function requireMatchRole(
  matchId: string,
  allowedRoles: AppRole[] = ["admin", "referee"]
) {
  const profile = await getCurrentUserProfile();

  if (!allowedRoles.includes(profile.role)) {
    throw new ForbiddenError();
  }

  if (profile.role === "admin") {
    return profile;
  }

  // Referee: verify assignment to match
  const supabase = await createServerSupabaseClient();
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, referee_id, home_team_id, away_team_id")
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    throw new Error("Match not found.");
  }

  if (!match.referee_id) {
    throw new Error("This match has no referee assigned.");
  }

  // Check via user_id first (stable), then fall back to email (legacy)
  const { data: referee } = await supabase
    .from("referees")
    .select("id, user_id, email")
    .eq("id", match.referee_id)
    .single();

  if (!referee) {
    throw new Error("Assigned referee record not found.");
  }

  const matchesByUserId = referee.user_id && referee.user_id === profile.id;
  const matchesByEmail =
    !referee.user_id &&
    referee.email &&
    profile.email &&
    referee.email.toLowerCase() === profile.email.toLowerCase();

  if (!matchesByUserId && !matchesByEmail) {
    throw new ForbiddenError("You are not the referee assigned to this match.");
  }

  return profile;
}

/**
 * Validate that a team is participating in a given match.
 */
export async function validateTeamInMatch(matchId: string, teamId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: match, error } = await supabase
    .from("matches")
    .select("home_team_id, away_team_id")
    .eq("id", matchId)
    .single();

  if (error || !match) {
    throw new Error("Match not found.");
  }

  if (match.home_team_id !== teamId && match.away_team_id !== teamId) {
    throw new Error("Team is not participating in this match.");
  }
}

/**
 * Validate that a player belongs to the specified team.
 */
export async function validatePlayerInTeam(playerId: string, teamId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: player, error } = await supabase
    .from("players")
    .select("id, team_id")
    .eq("id", playerId)
    .single();

  if (error || !player) {
    throw new Error("Player not found.");
  }

  if (player.team_id !== teamId) {
    throw new Error("Player does not belong to the specified team.");
  }
}
