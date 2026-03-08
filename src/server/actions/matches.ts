"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireRole } from "@/server/queries/auth";

export interface CreateMatchInput {
  matchdayId?: string | null;
  matchDate: string;
  kickoffTime?: string | null;
  venue?: string | null;
  homeTeamId: string;
  awayTeamId: string;
  homeJerseyColor?: string | null;
  awayJerseyColor?: string | null;
  refereeId?: string | null;
  status?: "scheduled" | "in_progress" | "completed" | "postponed";
}

export async function createMatch(input: CreateMatchInput) {
  await requireRole(["admin"]);

  if (input.homeTeamId === input.awayTeamId) {
    throw new Error("Home and away teams cannot be the same.");
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("matches")
    .insert({
      matchday_id: input.matchdayId ?? null,
      match_date: input.matchDate,
      kickoff_time: input.kickoffTime ?? null,
      venue: input.venue ?? null,
      home_team_id: input.homeTeamId,
      away_team_id: input.awayTeamId,
      home_jersey_color: input.homeJerseyColor ?? null,
      away_jersey_color: input.awayJerseyColor ?? null,
      referee_id: input.refereeId ?? null,
      status: input.status ?? "scheduled",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/matches");
  revalidatePath("/dashboard");
  return data;
}


export interface UpdateMatchInput {
  matchId: string;
  matchDate: string;
  kickoffTime?: string | null;
  venue?: string | null;
  homeTeamId: string;
  awayTeamId: string;
  homeJerseyColor?: string | null;
  awayJerseyColor?: string | null;
  refereeId?: string | null;
  status?: "scheduled" | "in_progress" | "completed" | "postponed";
  homeScore?: number | null;
  awayScore?: number | null;
}

export async function updateMatch(input: UpdateMatchInput) {
  await requireRole(["admin"]);

  if (input.homeTeamId === input.awayTeamId) {
    throw new Error("Home and away teams cannot be the same.");
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("matches")
    .update({
      match_date: input.matchDate,
      kickoff_time: input.kickoffTime ?? null,
      venue: input.venue ?? null,
      home_team_id: input.homeTeamId,
      away_team_id: input.awayTeamId,
      home_jersey_color: input.homeJerseyColor ?? null,
      away_jersey_color: input.awayJerseyColor ?? null,
      referee_id: input.refereeId ?? null,
      status: input.status ?? "scheduled",
      home_score: input.homeScore ?? null,
      away_score: input.awayScore ?? null,
    })
    .eq("id", input.matchId)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/matches");
  revalidatePath(`/matches/${input.matchId}`);
  revalidatePath(`/matches/${input.matchId}/edit`);
  revalidatePath("/dashboard");
  return data;
}
