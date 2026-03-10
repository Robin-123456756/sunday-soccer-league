"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireMatchRole, validateTeamInMatch, validatePlayerInTeam } from "@/server/queries/auth";
import { validateDifferentPlayers, validateActionMinute } from "@/lib/validation";

export interface SubstitutionInput {
  matchId: string;
  teamId: string;
  playerOffId: string;
  playerOnId: string;
  minute: number;
  reason?: string | null;
}

export async function recordSubstitution(input: SubstitutionInput) {
  await requireMatchRole(input.matchId, ["admin", "referee"]);

  const samePlayerError = validateDifferentPlayers(input.playerOffId, input.playerOnId);
  if (samePlayerError) throw new Error(samePlayerError);

  const minuteError = validateActionMinute(input.minute);
  if (minuteError) throw new Error(minuteError);

  // Validate team belongs to match
  await validateTeamInMatch(input.matchId, input.teamId);

  // Validate both players belong to team
  await validatePlayerInTeam(input.playerOffId, input.teamId);
  await validatePlayerInTeam(input.playerOnId, input.teamId);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("substitutions").insert({
    match_id: input.matchId,
    team_id: input.teamId,
    player_off_id: input.playerOffId,
    player_on_id: input.playerOnId,
    minute: input.minute,
    reason: input.reason ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/matches/${input.matchId}`);
  revalidatePath(`/matches/${input.matchId}/substitutions`);
  return { success: true };
}

export async function deleteSubstitution(substitutionId: string, matchId: string) {
  await requireMatchRole(matchId, ["admin", "referee"]);

  const supabase = await createServerSupabaseClient();
  const { data: substitution, error: substitutionError } = await supabase
    .from("substitutions")
    .select("id, match_id")
    .eq("id", substitutionId)
    .single();

  if (substitutionError || !substitution) {
    throw new Error("Substitution not found.");
  }

  if (substitution.match_id !== matchId) {
    throw new Error("Substitution does not belong to the selected match.");
  }

  const { error } = await supabase
    .from("substitutions")
    .delete()
    .eq("id", substitutionId)
    .eq("match_id", matchId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/matches/${matchId}`);
  revalidatePath(`/matches/${matchId}/substitutions`);
  return { success: true };
}
