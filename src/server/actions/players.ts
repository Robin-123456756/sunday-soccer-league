"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireRole } from "@/server/queries/auth";

interface TeamRefRow {
  id: string;
  name: string;
  short_name: string | null;
}

interface PlayerRow {
  id: string;
  team_id: string;
  full_name: string;
  jersey_number: number | null;
  position: string | null;
  registration_number: string | null;
  is_active: boolean;
  team?: TeamRefRow | TeamRefRow[] | null;
  teams?: TeamRefRow | TeamRefRow[] | null;
}

function normalizeTeamRef(value: TeamRefRow | TeamRefRow[] | null | undefined) {
  if (!value) {
    return null;
  }
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapPlayerRow(row: PlayerRow) {
  const team = normalizeTeamRef(row.team ?? row.teams);

  return {
    id: row.id,
    teamId: row.team_id,
    fullName: row.full_name,
    jerseyNumber: row.jersey_number,
    position: row.position,
    registrationNumber: row.registration_number,
    dateOfBirth: null,
    isActive: row.is_active,
    team: team
      ? {
          id: team.id,
          name: team.name,
          shortName: team.short_name,
        }
      : null,
  };
}

export async function getPlayers(teamId?: string) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("players")
    .select(`
      id,
      team_id,
      full_name,
      jersey_number,
      position,
      registration_number,
      is_active,
      team:teams(id, name, short_name)
    `)
    .eq("is_active", true)
    .order("full_name");

  if (teamId) {
    query = query.eq("team_id", teamId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as PlayerRow[]).map(mapPlayerRow);
}

export async function getPlayerById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("players")
    .select(`
      id,
      team_id,
      full_name,
      jersey_number,
      position,
      registration_number,
      is_active,
      team:teams(id, name, short_name)
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return mapPlayerRow(data as PlayerRow);
}

export async function createPlayer(formData: FormData) {
  await requireRole(["admin"]);

  const fullName = formData.get("fullName") as string;
  const teamId = formData.get("teamId") as string;
  const jerseyNumber = formData.get("jerseyNumber") as string;
  const position = (formData.get("position") as string) || undefined;
  const registrationNumber =
    (formData.get("registrationNumber") as string) || undefined;

  if (!fullName || !teamId) {
    return { error: "Player name and team are required" };
  }

  const supabase = await createServerSupabaseClient();
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("id")
    .eq("id", teamId)
    .maybeSingle();

  if (teamError) {
    return { error: teamError.message };
  }

  if (!team) {
    return { error: "Selected team does not exist" };
  }

  if (registrationNumber) {
    const { data: existing, error: existingError } = await supabase
      .from("players")
      .select("id")
      .eq("registration_number", registrationNumber)
      .limit(1);

    if (existingError) {
      return { error: existingError.message };
    }

    if (existing && existing.length > 0) {
      return { error: "A player with this registration number already exists" };
    }
  }

  const { error } = await supabase.from("players").insert({
    full_name: fullName,
    team_id: teamId,
    jersey_number: jerseyNumber ? parseInt(jerseyNumber, 10) : null,
    position: position || null,
    registration_number: registrationNumber || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/players");
  revalidatePath(`/teams/${teamId}`);
  return { success: true };
}

export async function updatePlayer(id: string, formData: FormData) {
  await requireRole(["admin"]);

  const fullName = formData.get("fullName") as string;
  const teamId = formData.get("teamId") as string;
  const jerseyNumber = formData.get("jerseyNumber") as string;
  const position = (formData.get("position") as string) || undefined;
  const registrationNumber =
    (formData.get("registrationNumber") as string) || undefined;

  if (!fullName || !teamId) {
    return { error: "Player name and team are required" };
  }

  const supabase = await createServerSupabaseClient();

  if (registrationNumber) {
    const { data: existing, error: existingError } = await supabase
      .from("players")
      .select("id")
      .eq("registration_number", registrationNumber)
      .neq("id", id)
      .limit(1);

    if (existingError) {
      return { error: existingError.message };
    }

    if (existing && existing.length > 0) {
      return { error: "A player with this registration number already exists" };
    }
  }

  const { error } = await supabase
    .from("players")
    .update({
      full_name: fullName,
      team_id: teamId,
      jersey_number: jerseyNumber ? parseInt(jerseyNumber, 10) : null,
      position: position || null,
      registration_number: registrationNumber || null,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/players");
  revalidatePath(`/players/${id}`);
  revalidatePath(`/teams/${teamId}`);
  return { success: true };
}

// deletePlayer moved to archive.ts (archivePlayer for soft-delete, deletePlayer for hard-delete)
