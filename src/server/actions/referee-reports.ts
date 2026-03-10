"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireMatchRole } from "@/server/queries/auth";
import type { RefereeReportInput } from "@/types/database";

export async function submitRefereeReport(input: RefereeReportInput) {
  await requireMatchRole(input.matchId, ["admin", "referee"]);

  // Verify the refereeId matches the match's assigned referee
  const supabase = await createServerSupabaseClient();
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("referee_id")
    .eq("id", input.matchId)
    .single();

  if (matchError || !match) {
    throw new Error("Match not found.");
  }

  if (match.referee_id !== input.refereeId) {
    throw new Error("Referee report must use the referee assigned to this match.");
  }

  const { error } = await supabase.from("referee_reports").upsert({
    match_id: input.matchId,
    referee_id: input.refereeId,
    general_comment: input.generalComment ?? null,
    time_management_observation: input.timeManagementObservation ?? null,
    dress_code_observation: input.dressCodeObservation ?? null,
    organization_observation: input.organizationObservation ?? null,
    conduct_observation: input.conductObservation ?? null,
    incidents: input.incidents ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/matches/${input.matchId}`);
  revalidatePath("/reports");
  return { success: true };
}
