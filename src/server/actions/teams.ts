"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getTeams() {
  return getDb().team.findMany({
    where: { isActive: true },
    include: { _count: { select: { players: true } }, homeVenue: true },
    orderBy: { name: "asc" },
  });
}

export async function getTeamById(id: string) {
  return getDb().team.findUnique({
    where: { id },
    include: {
      players: { where: { isActive: true }, orderBy: { fullName: "asc" } },
      homeVenue: true,
    },
  });
}

export async function createTeam(formData: FormData) {
  const name = formData.get("name") as string;
  const shortName = (formData.get("shortName") as string) || undefined;
  const primaryColor = (formData.get("primaryColor") as string) || undefined;
  const secondaryColor =
    (formData.get("secondaryColor") as string) || undefined;
  const homeVenueId = (formData.get("homeVenueId") as string) || undefined;

  if (!name) {
    return { error: "Team name is required" };
  }

  const existing = await getDb().team.findUnique({ where: { name } });
  if (existing) {
    return { error: "A team with this name already exists" };
  }

  await getDb().team.create({
    data: {
      name,
      shortName,
      primaryColor,
      secondaryColor,
      homeVenueId: homeVenueId || null,
    },
  });

  revalidatePath("/teams");
  return { success: true };
}

export async function updateTeam(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const shortName = (formData.get("shortName") as string) || undefined;
  const primaryColor = (formData.get("primaryColor") as string) || undefined;
  const secondaryColor =
    (formData.get("secondaryColor") as string) || undefined;
  const homeVenueId = (formData.get("homeVenueId") as string) || undefined;

  if (!name) {
    return { error: "Team name is required" };
  }

  const existing = await getDb().team.findFirst({
    where: { name, NOT: { id } },
  });
  if (existing) {
    return { error: "A team with this name already exists" };
  }

  await getDb().team.update({
    where: { id },
    data: {
      name,
      shortName: shortName || null,
      primaryColor: primaryColor || null,
      secondaryColor: secondaryColor || null,
      homeVenueId: homeVenueId || null,
    },
  });

  revalidatePath("/teams");
  revalidatePath(`/teams/${id}`);
  return { success: true };
}

export async function deleteTeam(id: string) {
  await getDb().team.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/teams");
  return { success: true };
}
