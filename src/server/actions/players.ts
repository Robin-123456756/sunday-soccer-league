"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPlayers(teamId?: string) {
  return getDb().player.findMany({
    where: {
      isActive: true,
      ...(teamId ? { teamId } : {}),
    },
    include: { team: { select: { id: true, name: true, shortName: true } } },
    orderBy: { fullName: "asc" },
  });
}

export async function getPlayerById(id: string) {
  return getDb().player.findUnique({
    where: { id },
    include: { team: { select: { id: true, name: true, shortName: true } } },
  });
}

export async function createPlayer(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const teamId = formData.get("teamId") as string;
  const jerseyNumber = formData.get("jerseyNumber") as string;
  const position = (formData.get("position") as string) || undefined;
  const dateOfBirth = (formData.get("dateOfBirth") as string) || undefined;
  const registrationNumber =
    (formData.get("registrationNumber") as string) || undefined;

  if (!fullName || !teamId) {
    return { error: "Player name and team are required" };
  }

  const team = await getDb().team.findUnique({ where: { id: teamId } });
  if (!team) {
    return { error: "Selected team does not exist" };
  }

  if (registrationNumber) {
    const existing = await getDb().player.findUnique({
      where: { registrationNumber },
    });
    if (existing) {
      return { error: "A player with this registration number already exists" };
    }
  }

  await getDb().player.create({
    data: {
      fullName,
      teamId,
      jerseyNumber: jerseyNumber ? parseInt(jerseyNumber, 10) : null,
      position: position || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      registrationNumber: registrationNumber || null,
    },
  });

  revalidatePath("/players");
  revalidatePath(`/teams/${teamId}`);
  return { success: true };
}

export async function updatePlayer(id: string, formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const teamId = formData.get("teamId") as string;
  const jerseyNumber = formData.get("jerseyNumber") as string;
  const position = (formData.get("position") as string) || undefined;
  const dateOfBirth = (formData.get("dateOfBirth") as string) || undefined;
  const registrationNumber =
    (formData.get("registrationNumber") as string) || undefined;

  if (!fullName || !teamId) {
    return { error: "Player name and team are required" };
  }

  if (registrationNumber) {
    const existing = await getDb().player.findFirst({
      where: { registrationNumber, NOT: { id } },
    });
    if (existing) {
      return { error: "A player with this registration number already exists" };
    }
  }

  await getDb().player.update({
    where: { id },
    data: {
      fullName,
      teamId,
      jerseyNumber: jerseyNumber ? parseInt(jerseyNumber, 10) : null,
      position: position || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      registrationNumber: registrationNumber || null,
    },
  });

  revalidatePath("/players");
  revalidatePath(`/players/${id}`);
  revalidatePath(`/teams/${teamId}`);
  return { success: true };
}

export async function deletePlayer(id: string) {
  const player = await getDb().player.findUnique({ where: { id } });
  if (!player) return { error: "Player not found" };

  await getDb().player.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/players");
  revalidatePath(`/teams/${player.teamId}`);
  return { success: true };
}
