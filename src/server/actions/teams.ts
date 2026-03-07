"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireRole } from "@/server/queries/auth";

interface TeamRow {
  id: string;
  name: string;
  short_name: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  home_venue: string | null;
}

interface TeamPlayerRow {
  id: string;
  full_name: string;
  jersey_number: number | null;
  position: string | null;
  is_active: boolean;
}

function mapTeamRow(row: TeamRow) {
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    homeVenue: row.home_venue,
  };
}

export async function getTeams() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("teams")
    .select("id, name, short_name, primary_color, secondary_color, home_venue")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as TeamRow[]).map(mapTeamRow);
}

export async function getTeamById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("teams")
    .select(`
      id,
      name,
      short_name,
      primary_color,
      secondary_color,
      home_venue,
      players(id, full_name, jersey_number, position, is_active)
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  const row = data as TeamRow & { players: TeamPlayerRow[] | null };

  return {
    ...mapTeamRow(row),
    players: (row.players ?? [])
      .filter((player) => player.is_active)
      .sort((a, b) => a.full_name.localeCompare(b.full_name))
      .map((player) => ({
        id: player.id,
        fullName: player.full_name,
        jerseyNumber: player.jersey_number,
        position: player.position,
      })),
  };
}

export async function createTeam(formData: FormData) {
  await requireRole(["admin"]);

  const name = formData.get("name") as string;
  const shortName = (formData.get("shortName") as string) || undefined;
  const primaryColor = (formData.get("primaryColor") as string) || undefined;
  const secondaryColor =
    (formData.get("secondaryColor") as string) || undefined;
  const homeVenue = (formData.get("homeVenue") as string) || undefined;

  if (!name) {
    return { error: "Team name is required" };
  }

  const supabase = await createServerSupabaseClient();
  const { data: existing, error: existingError } = await supabase
    .from("teams")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (existingError) {
    return { error: existingError.message };
  }

  if (existing) {
    return { error: "A team with this name already exists" };
  }

  const { error } = await supabase.from("teams").insert({
    name,
    short_name: shortName || null,
    primary_color: primaryColor || null,
    secondary_color: secondaryColor || null,
    home_venue: homeVenue || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/teams");
  return { success: true };
}

export async function updateTeam(id: string, formData: FormData) {
  await requireRole(["admin"]);

  const name = formData.get("name") as string;
  const shortName = (formData.get("shortName") as string) || undefined;
  const primaryColor = (formData.get("primaryColor") as string) || undefined;
  const secondaryColor =
    (formData.get("secondaryColor") as string) || undefined;
  const homeVenue = (formData.get("homeVenue") as string) || undefined;

  if (!name) {
    return { error: "Team name is required" };
  }

  const supabase = await createServerSupabaseClient();
  const { data: existing, error: existingError } = await supabase
    .from("teams")
    .select("id")
    .eq("name", name)
    .neq("id", id)
    .maybeSingle();

  if (existingError) {
    return { error: existingError.message };
  }

  if (existing) {
    return { error: "A team with this name already exists" };
  }

  const { error } = await supabase
    .from("teams")
    .update({
      name,
      short_name: shortName || null,
      primary_color: primaryColor || null,
      secondary_color: secondaryColor || null,
      home_venue: homeVenue || null,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/teams");
  revalidatePath(`/teams/${id}`);
  return { success: true };
}

// deleteTeam moved to archive.ts (archiveTeam for soft-delete, deleteTeam for hard-delete)
