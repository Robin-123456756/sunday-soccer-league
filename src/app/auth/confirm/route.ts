import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const allowedTypes: EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

function getDefaultNext(type: EmailOtpType) {
  if (type === "recovery") return "/auth/update-password";
  if (type === "invite") return "/auth/accept-invite";
  return "/auth/post-login";
}

function sanitizeNextPath(next: string | null, type: EmailOtpType) {
  if (!next) return getDefaultNext(type);
  if (!next.startsWith("/") || next.startsWith("//")) return getDefaultNext(type);
  return next;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.searchParams.delete("token_hash");
  redirectUrl.searchParams.delete("type");

  if (!typeParam || !allowedTypes.includes(typeParam as EmailOtpType)) {
    redirectUrl.pathname = "/auth/error";
    redirectUrl.searchParams.set("message", "Invalid or missing auth link type.");
    redirectUrl.searchParams.set("flash", "invalid_link");
    return NextResponse.redirect(redirectUrl);
  }

  const type = typeParam as EmailOtpType;
  const next = sanitizeNextPath(searchParams.get("next"), type);
  redirectUrl.pathname = next;
  redirectUrl.searchParams.delete("next");

  if (!tokenHash) {
    redirectUrl.pathname = "/auth/error";
    redirectUrl.searchParams.set("message", "This auth link is missing its token.");
    redirectUrl.searchParams.set("flash", "invalid_link");
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    redirectUrl.pathname = "/auth/error";
    redirectUrl.searchParams.set("message", error.message);
    redirectUrl.searchParams.set("flash", "expired_link");
    return NextResponse.redirect(redirectUrl);
  }

  redirectUrl.searchParams.set("flash", type === "invite" ? "invite_verified" : type === "recovery" ? "recovery_verified" : "auth_required");
  return NextResponse.redirect(redirectUrl);
}
