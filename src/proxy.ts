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

function getUnauthorizedRedirect(request: NextRequest, role: AppRole) {
  return getRedirectUrl(request, getDefaultRouteForRole(role));
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isExcludedFromAuth(pathname)) {
    return NextResponse.next();
  }

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

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not signed in
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

  // Signed in - check role + active status
  const { data: profile } = await supabase
    .from("users_profile")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role as AppRole | undefined;
  const isActive = Boolean(profile?.is_active);

  if (!role || !isActive) {
    const inactiveUrl = getRedirectUrl(request, "/sign-in");
    inactiveUrl.searchParams.set("flash", "inactive_profile");
    return NextResponse.redirect(inactiveUrl);
  }

  // Signed-in users on public auth pages get redirected to their default route
  if (pathname === "/" || pathname === "/sign-in") {
    return NextResponse.redirect(getRedirectUrl(request, getDefaultRouteForRole(role)));
  }

  // Allow auth utility pages even when signed in
  if (pathname === "/forgot-password" || pathname.startsWith("/auth/update-password") || pathname.startsWith("/auth/accept-invite") || pathname.startsWith("/auth/confirm") || pathname.startsWith("/auth/error")) {
    return response;
  }

  // Role-based route authorization
  if (!routeAllowsRole(pathname, role)) {
    const unauthorizedUrl = getUnauthorizedRedirect(request, role);
    unauthorizedUrl.searchParams.set("flash", "unauthorized");
    return NextResponse.redirect(unauthorizedUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
