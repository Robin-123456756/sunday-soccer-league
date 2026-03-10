import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { AppRole } from "@/types/database";
import {
  getDefaultRouteForRole,
  isExcludedFromAuth,
  isPublicPath,
  routeAllowsRole,
} from "@/lib/auth/routes";

function getRedirectUrl(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return url;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip middleware for static assets, API routes, etc.
  if (isExcludedFromAuth(pathname)) {
    return NextResponse.next();
  }

  // Refresh the Supabase session on every request
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No session — allow public paths, redirect everything else to sign-in
  if (!user) {
    if (isPublicPath(pathname)) {
      return response;
    }
    const signInUrl = getRedirectUrl(request, "/sign-in");
    const next = `${pathname}${search || ""}`;
    signInUrl.searchParams.set("next", next);
    signInUrl.searchParams.set("flash", "auth_required");
    return NextResponse.redirect(signInUrl);
  }

  // Signed in — allow auth callback routes through without profile check
  if (
    pathname.startsWith("/auth/confirm") ||
    pathname.startsWith("/auth/error") ||
    pathname.startsWith("/auth/post-login") ||
    pathname.startsWith("/auth/update-password") ||
    pathname.startsWith("/auth/accept-invite")
  ) {
    return response;
  }

  // Fetch role and active status
  const { data: profile } = await supabase
    .from("users_profile")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role as AppRole | undefined;
  const isActive = Boolean(profile?.is_active);

  // Inactive or missing profile — send back to sign-in
  if (!role || !isActive) {
    const inactiveUrl = getRedirectUrl(request, "/sign-in");
    inactiveUrl.searchParams.set("flash", "inactive_profile");
    return NextResponse.redirect(inactiveUrl);
  }

  // Signed-in user hitting landing page or sign-in — redirect to their dashboard
  if (pathname === "/" || pathname === "/sign-in") {
    return NextResponse.redirect(
      getRedirectUrl(request, getDefaultRouteForRole(role))
    );
  }

  // Allow forgot-password even when signed in (edge case)
  if (pathname === "/forgot-password") {
    return response;
  }

  // Enforce role-based route access
  if (!routeAllowsRole(pathname, role)) {
    const unauthorizedUrl = getRedirectUrl(
      request,
      getDefaultRouteForRole(role)
    );
    unauthorizedUrl.searchParams.set("flash", "unauthorized");
    return NextResponse.redirect(unauthorizedUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
