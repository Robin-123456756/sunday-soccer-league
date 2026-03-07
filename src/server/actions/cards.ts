"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/server/queries/auth";
import type { CardEventInput } from "@/types/database";

export async function recordCardEvent(input: CardEventInput) {
  const profile = await getCurrentUserProfile();

  if (!["admin", "referee"].includes(profile.role)) {
    throw new Error("Only admins or referees can record cards.");
  }

  const supabase = await createServerSupabaseClient();
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select(`
      id,
      referee_id,
      referees:referee_id ( id, email )
    `)
    .eq("id", input.matchId)
    .single();

  if (matchError || !match) {
    throw new Error("Match not found.");
  }

  const refereeEmail = Array.isArray(match.referees)
    ? (match.referees[0]?.email ?? "").toLowerCase()
    : "";

  if (profile.role === "referee" && refereeEmail !== (profile.email ?? "").toLowerCase()) {
    throw new Error("Referees can only record cards for matches assigned to them.");
  }

  const { error } = await supabase.from("card_events").insert({
    match_id: input.matchId,
    team_id: input.teamId,
    player_id: input.playerId,
    card_type: input.cardType,
    minute: input.minute,
    reason: input.reason,
    referee_note: input.refereeNote ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/matches/${input.matchId}`);
  revalidatePath("/matches");
  return { success: true };
}
