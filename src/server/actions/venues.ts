"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getVenues() {
  return getDb().venue.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createVenue(formData: FormData) {
  const name = formData.get("name") as string;
  const address = (formData.get("address") as string) || undefined;
  const city = (formData.get("city") as string) || undefined;

  if (!name) {
    return { error: "Venue name is required" };
  }

  await getDb().venue.create({
    data: {
      name,
      address: address || null,
      city: city || null,
    },
  });

  revalidatePath("/matches/create");
  return { success: true };
}
