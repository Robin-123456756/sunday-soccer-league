"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireRole } from "@/server/queries/auth";

export interface UpsertTeamInput {
  id?: string;
  name: string;
  shortName?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  homeVenue?: string | null;
}

export async function createTeam(input: UpsertTeamInput) {
  await requireRole(["admin"]);
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("teams")
    .insert({
      name: input.name,
      short_name: input.shortName ?? null,
      primary_color: input.primaryColor ?? null,
      secondary_color: input.secondaryColor ?? null,
      home_venue: input.homeVenue ?? null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/teams");
  revalidatePath("/dashboard");
  return data;
}

export async function updateTeam(input: UpsertTeamInput) {
  await requireRole(["admin"]);
  if (!input.id) throw new Error("Team ID is required.");

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("teams")
    .update({
      name: input.name,
      short_name: input.shortName ?? null,
      primary_color: input.primaryColor ?? null,
      secondary_color: input.secondaryColor ?? null,
      home_venue: input.homeVenue ?? null,
    })
    .eq("id", input.id)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/teams");
  revalidatePath(`/teams/${input.id}/edit`);
  revalidatePath("/dashboard");
  return data;
}
