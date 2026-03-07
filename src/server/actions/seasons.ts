"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSeasons() {
  return getDb().season.findMany({
    include: { _count: { select: { matchdays: true, matches: true } } },
    orderBy: { startDate: "desc" },
  });
}

export async function getSeasonWithMatchdays(seasonId: string) {
  return getDb().season.findUnique({
    where: { id: seasonId },
    include: {
      matchdays: { orderBy: { date: "asc" } },
    },
  });
}

export async function createSeason(formData: FormData) {
  const name = formData.get("name") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  if (!name || !startDate || !endDate) {
    return { error: "Season name, start date, and end date are required" };
  }

  await getDb().season.create({
    data: {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  revalidatePath("/matches/create");
  return { success: true };
}

export async function getMatchdays(seasonId: string) {
  return getDb().matchday.findMany({
    where: { seasonId },
    orderBy: { date: "asc" },
  });
}

export async function createMatchday(formData: FormData) {
  const seasonId = formData.get("seasonId") as string;
  const name = formData.get("name") as string;
  const date = (formData.get("date") as string) || undefined;

  if (!seasonId || !name) {
    return { error: "Season and matchday name are required" };
  }

  await getDb().matchday.create({
    data: {
      seasonId,
      name,
      date: date ? new Date(date) : null,
    },
  });

  revalidatePath("/matches/create");
  return { success: true };
}
