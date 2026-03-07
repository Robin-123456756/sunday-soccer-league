"use server";

import { MatchStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const validMatchStatuses = new Set<MatchStatus>(Object.values(MatchStatus));

function parseMatchStatus(value?: string): MatchStatus | undefined {
  if (!value) {
    return undefined;
  }

  return validMatchStatuses.has(value as MatchStatus)
    ? (value as MatchStatus)
    : undefined;
}

export async function getMatches(filters?: {
  seasonId?: string;
  teamId?: string;
  status?: string;
}) {
  const status = parseMatchStatus(filters?.status);

  return prisma.match.findMany({
    where: {
      ...(filters?.seasonId ? { seasonId: filters.seasonId } : {}),
      ...(filters?.teamId
        ? {
            OR: [
              { homeTeamId: filters.teamId },
              { awayTeamId: filters.teamId },
            ],
          }
        : {}),
      ...(status ? { status } : {}),
    },
    include: {
      homeTeam: { select: { id: true, name: true, shortName: true } },
      awayTeam: { select: { id: true, name: true, shortName: true } },
      venue: { select: { id: true, name: true } },
      referee: { select: { id: true, fullName: true } },
      season: { select: { id: true, name: true } },
      matchday: { select: { id: true, name: true } },
    },
    orderBy: { matchDate: "desc" },
  });
}

export async function getMatchById(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: {
        select: {
          id: true,
          name: true,
          shortName: true,
          primaryColor: true,
        },
      },
      awayTeam: {
        select: {
          id: true,
          name: true,
          shortName: true,
          primaryColor: true,
        },
      },
      venue: true,
      referee: true,
      assistantReferee1: true,
      assistantReferee2: true,
      season: true,
      matchday: true,
      lineups: {
        include: {
          player: { select: { id: true, fullName: true, jerseyNumber: true } },
        },
      },
      cardEvents: {
        include: {
          player: { select: { id: true, fullName: true } },
          team: { select: { id: true, name: true } },
        },
        orderBy: { minute: "asc" },
      },
      substitutions: {
        include: {
          playerOff: { select: { id: true, fullName: true } },
          playerOn: { select: { id: true, fullName: true } },
          team: { select: { id: true, name: true } },
        },
        orderBy: { minute: "asc" },
      },
      refereeReport: true,
      teamSheetUploads: true,
    },
  });
}

export async function createMatch(formData: FormData) {
  const matchDate = formData.get("matchDate") as string;
  const kickoffTime = (formData.get("kickoffTime") as string) || undefined;
  const venueId = (formData.get("venueId") as string) || undefined;
  const homeTeamId = formData.get("homeTeamId") as string;
  const awayTeamId = formData.get("awayTeamId") as string;
  const homeJerseyColor =
    (formData.get("homeJerseyColor") as string) || undefined;
  const awayJerseyColor =
    (formData.get("awayJerseyColor") as string) || undefined;
  const refereeId = (formData.get("refereeId") as string) || undefined;
  const seasonId = (formData.get("seasonId") as string) || undefined;
  const matchdayId = (formData.get("matchdayId") as string) || undefined;

  if (!matchDate || !homeTeamId || !awayTeamId) {
    return { error: "Match date, home team, and away team are required" };
  }

  if (homeTeamId === awayTeamId) {
    return { error: "Home team and away team cannot be the same" };
  }

  await prisma.match.create({
    data: {
      matchDate: new Date(matchDate),
      kickoffTime: kickoffTime || null,
      venueId: venueId || null,
      homeTeamId,
      awayTeamId,
      homeJerseyColor: homeJerseyColor || null,
      awayJerseyColor: awayJerseyColor || null,
      refereeId: refereeId || null,
      seasonId: seasonId || null,
      matchdayId: matchdayId || null,
      status: "scheduled",
    },
  });

  revalidatePath("/matches");
  return { success: true };
}

export async function updateMatch(id: string, formData: FormData) {
  const matchDate = formData.get("matchDate") as string;
  const kickoffTime = (formData.get("kickoffTime") as string) || undefined;
  const venueId = (formData.get("venueId") as string) || undefined;
  const homeTeamId = formData.get("homeTeamId") as string;
  const awayTeamId = formData.get("awayTeamId") as string;
  const homeJerseyColor =
    (formData.get("homeJerseyColor") as string) || undefined;
  const awayJerseyColor =
    (formData.get("awayJerseyColor") as string) || undefined;
  const refereeId = (formData.get("refereeId") as string) || undefined;
  const seasonId = (formData.get("seasonId") as string) || undefined;
  const matchdayId = (formData.get("matchdayId") as string) || undefined;
  const statusInput = (formData.get("status") as string) || undefined;
  const status = parseMatchStatus(statusInput);
  const homeScore = formData.get("homeScore") as string;
  const awayScore = formData.get("awayScore") as string;

  if (!matchDate || !homeTeamId || !awayTeamId) {
    return { error: "Match date, home team, and away team are required" };
  }

  if (homeTeamId === awayTeamId) {
    return { error: "Home team and away team cannot be the same" };
  }

  if (statusInput && !status) {
    return { error: "Invalid match status" };
  }

  await prisma.match.update({
    where: { id },
    data: {
      matchDate: new Date(matchDate),
      kickoffTime: kickoffTime || null,
      venueId: venueId || null,
      homeTeamId,
      awayTeamId,
      homeJerseyColor: homeJerseyColor || null,
      awayJerseyColor: awayJerseyColor || null,
      refereeId: refereeId || null,
      seasonId: seasonId || null,
      matchdayId: matchdayId || null,
      status: status || undefined,
      homeScore: homeScore ? parseInt(homeScore, 10) : null,
      awayScore: awayScore ? parseInt(awayScore, 10) : null,
    },
  });

  revalidatePath("/matches");
  revalidatePath(`/matches/${id}`);
  return { success: true };
}

export async function deleteMatch(id: string) {
  await prisma.match.delete({ where: { id } });

  revalidatePath("/matches");
  return { success: true };
}
