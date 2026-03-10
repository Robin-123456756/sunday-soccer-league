"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getCurrentUserProfileOrNull,
  getDefaultRouteForRole,
  requireRole,
} from "@/server/queries/auth";
import type { AppRole } from "@/types/database";

export type AuthFormState = {
  error?: string;
  message?: string;
};

function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url && process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be set in production. Add it to your environment variables."
    );
  }
  return url || "http://localhost:3000";
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  // If there's a safe redirect target, go there; otherwise resolve via post-login
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    redirect(next);
  }

  redirect("/auth/post-login");
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/sign-in?flash=signed_out");
}

export async function resolvePostLoginRedirect(flash?: string | null) {
  const profile = await getCurrentUserProfileOrNull();

  if (!profile) {
    return "/sign-in?flash=auth_required";
  }

  if (!profile.is_active) {
    return "/sign-in?flash=inactive_profile";
  }

  const destination = getDefaultRouteForRole(profile.role);
  return flash ? `${destination}?flash=${encodeURIComponent(flash)}` : destination;
}

export async function requestPasswordResetAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    message:
      "Password reset email sent. Open the link in your email to choose a new password.",
  };
}

export async function syncCurrentUserProfileAction(fullName?: string | null) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in.");
  }

  const updates: Record<string, unknown> = {};
  if (fullName && fullName.trim()) {
    updates.full_name = fullName.trim();
  }
  if (user.email) {
    updates.email = user.email;
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from("users_profile").update(updates).eq("id", user.id);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/users");
  return { success: true };
}

export interface InviteManagedUserInput {
  email: string;
  role: AppRole;
  fullName?: string | null;
  teamId?: string | null;
}

export async function inviteManagedUser(input: InviteManagedUserInput) {
  await requireRole(["admin"]);

  const email = input.email.trim().toLowerCase();
  if (!email) throw new Error("Email is required.");

  const admin = createAdminSupabaseClient();
  const redirectTo = `${getSiteUrl()}/auth/accept-invite`;
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo,
    data: { full_name: input.fullName ?? null, role: input.role },
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Could not invite user.");
  }

  const supabase = await createServerSupabaseClient();
  const { error: profileError } = await supabase.from("users_profile").upsert({
    id: data.user.id,
    email,
    full_name: input.fullName?.trim() || null,
    role: input.role,
    team_id: input.role === "team_manager" ? input.teamId ?? null : null,
    is_active: true,
  });

  if (profileError) throw new Error(profileError.message);

  revalidatePath("/admin/users");
  return { id: data.user.id };
}
