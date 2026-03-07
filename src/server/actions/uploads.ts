"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/server/queries/auth";

export interface SaveTeamSheetUploadInput {
  matchId: string;
  teamId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

export async function saveTeamSheetUpload(input: SaveTeamSheetUploadInput) {
  const profile = await getCurrentUserProfile();

  if (!["admin", "team_manager"].includes(profile.role)) {
    throw new Error("Only admins or team managers can attach team sheets.");
  }

  if (profile.role === "team_manager" && profile.team_id !== input.teamId) {
    throw new Error("Team managers can only upload team sheets for their own team.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("team_sheet_uploads").insert({
    match_id: input.matchId,
    team_id: input.teamId,
    file_name: input.fileName,
    file_url: input.fileUrl,
    file_type: input.fileType,
    uploaded_by_user_id: profile.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/matches/${input.matchId}`);
  return { success: true };
}
