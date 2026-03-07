"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUserProfileOrNull, getDefaultRouteForRole } from "@/server/queries/auth";

export type AuthFormState = {
  error?: string;
};

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/auth/post-login");
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}

export async function resolvePostLoginRedirect() {
  const profile = await getCurrentUserProfileOrNull();

  if (!profile || !profile.is_active) {
    return "/sign-in";
  }

  return getDefaultRouteForRole(profile.role);
}
