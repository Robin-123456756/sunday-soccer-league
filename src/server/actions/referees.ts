"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireRole } from "@/server/queries/auth";

interface RefereeRow {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  level: string | null;
  is_active: boolean;
}

function mapRefereeRow(row: RefereeRow) {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    level: row.level,
    isActive: row.is_active,
  };
}

export async function getReferees() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("referees")
    .select("id, full_name, phone, email, level, is_active")
    .eq("is_active", true)
    .order("full_name");

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RefereeRow[]).map(mapRefereeRow);
}

export async function getRefereeById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("referees")
    .select("id, full_name, phone, email, level, is_active")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return mapRefereeRow(data as RefereeRow);
}

export async function createReferee(formData: FormData) {
  await requireRole(["admin"]);

  const fullName = formData.get("fullName") as string;
  const phone = (formData.get("phone") as string) || undefined;
  const email = (formData.get("email") as string) || undefined;
  const level = (formData.get("level") as string) || undefined;

  if (!fullName) {
    return { error: "Referee name is required" };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("referees").insert({
    full_name: fullName,
    phone: phone || null,
    email: email || null,
    level: level || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/referees");
  return { success: true };
}

export async function updateReferee(id: string, formData: FormData) {
  await requireRole(["admin"]);

  const fullName = formData.get("fullName") as string;
  const phone = (formData.get("phone") as string) || undefined;
  const email = (formData.get("email") as string) || undefined;
  const level = (formData.get("level") as string) || undefined;

  if (!fullName) {
    return { error: "Referee name is required" };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("referees")
    .update({
      full_name: fullName,
      phone: phone || null,
      email: email || null,
      level: level || null,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/referees");
  revalidatePath(`/referees/${id}`);
  return { success: true };
}

// deleteReferee moved to archive.ts (archiveReferee for soft-delete, deleteReferee for hard-delete)
