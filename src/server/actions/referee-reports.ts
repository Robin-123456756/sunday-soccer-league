"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/server/queries/auth";
import type { RefereeReportInput } from "@/types/database";

export async function submitRefereeReport(input: RefereeReportInput) {
  const profile = await getCurrentUserProfile();

  if (!["admin", "referee"].includes(profile.role)) {
    throw new Error("Only admins or referees can submit reports.");
  }

  const supabase = await createServerSupabaseClient();
  const { data: referee, error: refereeError } = await supabase
    .from("referees")
    .select("id, email")
    .eq("id", input.refereeId)
    .single();

  if (refereeError || !referee) {
    throw new Error("Referee not found.");
  }

  if (profile.role === "referee" && referee.email?.toLowerCase() !== (profile.email ?? "").toLowerCase()) {
    throw new Error("Referees can only submit their own reports.");
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
