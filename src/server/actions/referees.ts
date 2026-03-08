"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireRole } from "@/server/queries/auth";

export interface UpsertRefereeInput {
  id?: string;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  level?: string | null;
  isActive?: boolean;
}

export async function createReferee(input: UpsertRefereeInput) {
  await requireRole(["admin"]);
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("referees")
    .insert({
      full_name: input.fullName,
      phone: input.phone ?? null,
      email: input.email ?? null,
      level: input.level ?? null,
      is_active: input.isActive ?? true,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/referees");
  revalidatePath("/matches");
  return data;
}

export async function updateReferee(input: UpsertRefereeInput) {
  await requireRole(["admin"]);
  if (!input.id) throw new Error("Referee ID is required.");
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("referees")
    .update({
      full_name: input.fullName,
      phone: input.phone ?? null,
      email: input.email ?? null,
      level: input.level ?? null,
      is_active: input.isActive ?? true,
    })
    .eq("id", input.id)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/referees");
  revalidatePath(`/referees/${input.id}/edit`);
  revalidatePath("/matches");
  return data;
}
