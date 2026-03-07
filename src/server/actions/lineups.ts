"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/server/queries/auth";
import type { MatchLineupInput } from "@/types/database";

export async function saveMatchLineup(input: MatchLineupInput) {
  const profile = await getCurrentUserProfile();

  if (!["admin", "team_manager"].includes(profile.role)) {
    throw new Error("Only admins or team managers can save lineups.");
  }

  if (profile.role === "team_manager" && profile.team_id !== input.teamId) {
    throw new Error("Team managers can only edit their own team lineups.");
  }

  const allPlayerIds = [...input.starterIds, ...input.benchIds];
  if (new Set(allPlayerIds).size !== allPlayerIds.length) {
    throw new Error("A player cannot appear twice in the same lineup.");
  }

  const supabase = await createServerSupabaseClient();

  const { error: deleteError } = await supabase
    .from("match_lineups")
    .delete()
    .eq("match_id", input.matchId)
    .eq("team_id", input.teamId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const payload = [
    ...input.starterIds.map((playerId) => ({
      match_id: input.matchId,
      team_id: input.teamId,
      player_id: playerId,
      lineup_type: "starter",
      is_captain: input.captainPlayerId === playerId,
    })),
    ...input.benchIds.map((playerId) => ({
      match_id: input.matchId,
      team_id: input.teamId,
      player_id: playerId,
      lineup_type: "bench",
      is_captain: input.captainPlayerId === playerId,
    })),
  ];

  if (payload.length > 0) {
    const { error: insertError } = await supabase.from("match_lineups").insert(payload);
    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  revalidatePath(`/matches/${input.matchId}`);
  revalidatePath("/matches");
  return { success: true };
}
