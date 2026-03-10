"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireMatchRole, validateTeamInMatch, validatePlayerInTeam } from "@/server/queries/auth";
import { validateCardType, validateActionMinute } from "@/lib/validation";
import type { CardEventInput } from "@/types/database";

export async function recordCardEvent(input: CardEventInput) {
  await requireMatchRole(input.matchId, ["admin", "referee"]);

  const cardTypeError = validateCardType(input.cardType);
  if (cardTypeError) throw new Error(cardTypeError);

  const minuteError = validateActionMinute(input.minute);
  if (minuteError) throw new Error(minuteError);

  // Validate team belongs to match
  await validateTeamInMatch(input.matchId, input.teamId);

  // Validate player belongs to team
  await validatePlayerInTeam(input.playerId, input.teamId);

  const supabase = await createServerSupabaseClient();
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
