"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getReferees() {
  return getDb().referee.findMany({
    where: { isActive: true },
    orderBy: { fullName: "asc" },
  });
}

export async function getRefereeById(id: string) {
  return getDb().referee.findUnique({
    where: { id },
  });
}

export async function createReferee(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const phone = (formData.get("phone") as string) || undefined;
  const email = (formData.get("email") as string) || undefined;
  const level = (formData.get("level") as string) || undefined;

  if (!fullName) {
    return { error: "Referee name is required" };
  }

  await getDb().referee.create({
    data: {
      fullName,
      phone: phone || null,
      email: email || null,
      level: level || null,
    },
  });

  revalidatePath("/referees");
  return { success: true };
}

export async function updateReferee(id: string, formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const phone = (formData.get("phone") as string) || undefined;
  const email = (formData.get("email") as string) || undefined;
  const level = (formData.get("level") as string) || undefined;

  if (!fullName) {
    return { error: "Referee name is required" };
  }

  await getDb().referee.update({
    where: { id },
    data: {
      fullName,
      phone: phone || null,
      email: email || null,
      level: level || null,
    },
  });

  revalidatePath("/referees");
  revalidatePath(`/referees/${id}`);
  return { success: true };
}

export async function deleteReferee(id: string) {
  await getDb().referee.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/referees");
  return { success: true };
}
