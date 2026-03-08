"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireRole } from "@/server/queries/auth";

export interface UpsertPlayerInput {
  id?: string;
  teamId: string;
  fullName: string;
  jerseyNumber?: number | null;
  position?: string | null;
  registrationNumber?: string | null;
  isActive?: boolean;
}

export async function createPlayer(input: UpsertPlayerInput) {
  await requireRole(["admin"]);
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("players")
    .insert({
      team_id: input.teamId,
      full_name: input.fullName,
      jersey_number: input.jerseyNumber ?? null,
      position: input.position ?? null,
      registration_number: input.registrationNumber ?? null,
      is_active: input.isActive ?? true,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/players");
  revalidatePath("/teams");
  return data;
}

export async function updatePlayer(input: UpsertPlayerInput) {
  await requireRole(["admin"]);
  if (!input.id) throw new Error("Player ID is required.");
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("players")
    .update({
      team_id: input.teamId,
      full_name: input.fullName,
      jersey_number: input.jerseyNumber ?? null,
      position: input.position ?? null,
      registration_number: input.registrationNumber ?? null,
      is_active: input.isActive ?? true,
    })
    .eq("id", input.id)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/players");
  revalidatePath(`/players/${input.id}/edit`);
  revalidatePath("/teams");
  return data;
}
