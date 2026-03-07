"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireRole } from "@/server/queries/auth";

export async function getSeasons() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("matchdays")
    .select("season_label")
    .not("season_label", "is", null);

  if (error) {
    throw new Error(error.message);
  }

  const labels = Array.from(
    new Set(
      (data ?? [])
        .map((row) => row.season_label)
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => b.localeCompare(a));

  // Count matchdays per season label
  const countMap: Record<string, number> = {};
  for (const row of data ?? []) {
    const label = row.season_label as string;
    countMap[label] = (countMap[label] ?? 0) + 1;
  }

  return labels.map((label) => ({
    id: label,
    name: label,
    _count: { matchdays: countMap[label] ?? 0, matches: 0 },
  }));
}

export async function getSeasonWithMatchdays(seasonId: string) {
  const matchdays = await getMatchdays(seasonId);
  return {
    id: seasonId,
    name: seasonId,
    matchdays,
  };
}

export async function createSeason(formData: FormData) {
  await requireRole(["admin"]);

  const name = formData.get("name") as string;

  if (!name) {
    return { error: "Season label is required" };
  }

  // Check if this season label already exists
  const supabase = await createServerSupabaseClient();
  const { data: existing } = await supabase
    .from("matchdays")
    .select("id")
    .eq("season_label", name)
    .limit(1);

  if (existing && existing.length > 0) {
    return { error: "A season with this label already exists" };
  }

  // Create the first matchday for this season
  const { error } = await supabase.from("matchdays").insert({
    name: "Matchday 1",
    season_label: name,
    round_number: 1,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/matches/new");
  return { success: true };
}

export async function getMatchdays(seasonId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("matchdays")
    .select("id, name, round_number, season_label, created_at")
    .eq("season_label", seasonId)
    .order("round_number", { ascending: true, nullsFirst: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    seasonId: row.season_label ?? seasonId,
    name: row.name,
    date: null,
  }));
}

export async function createMatchday(formData: FormData) {
  await requireRole(["admin"]);

  const seasonId = formData.get("seasonId") as string;
  const name = formData.get("name") as string;
  const roundNumber = (formData.get("roundNumber") as string) || undefined;

  if (!seasonId || !name) {
    return { error: "Season and matchday name are required" };
  }

  const parsedRound =
    roundNumber && Number.isFinite(Number(roundNumber))
      ? Number(roundNumber)
      : null;

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("matchdays").insert({
    season_label: seasonId,
    name,
    round_number: parsedRound,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/matches/new");
  return { success: true };
}
