"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getVenues() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("matches")
    .select("venue")
    .not("venue", "is", null)
    .order("venue", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const names = Array.from(
    new Set(
      (data ?? [])
        .map((row) => row.venue)
        .filter((value): value is string => Boolean(value))
    )
  );

  return names.map((name) => ({ id: name, name }));
}

export async function createVenue(formData: FormData) {
  const name = (formData.get("name") as string) || "";

  if (!name) {
    return { error: "Venue name is required" };
  }

  return {
    error:
      "Standalone venue creation is not available in Supabase mode. Enter venue names directly on matches or teams.",
  };
}
